import sys
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, PROJECT_ROOT)

import MetaTrader5 as mt5
import pandas as pd

from strategies.liquidity_inducement_strategy import LiquidityInducementStrategy
from core.data_handler import DataHandler
from config.settings import SYMBOL, RISK_PER_TRADE_NAIRA


class Backtester:
    """
    RR-weighted backtester with DD shown in ₦ and R
    """

    def __init__(self, symbol, start_balance=100000):
        self.symbol = symbol
        self.balance = start_balance
        self.start_balance = start_balance
        self.max_balance = start_balance

        self.max_dd_naira = 0
        self.max_dd_r = 0

        self.strategy = LiquidityInducementStrategy(mode="BACKTEST")
        self.open_trade = None
        self.results = []

    # =====================================================
    def run(self, requested_bars=100_000):
        print("[BACKTEST] RR-WEIGHTED | DD IN ₦ & R")

        if not mt5.initialize():
            print("[BACKTEST] MT5 init failed")
            return

        if not mt5.symbol_select(self.symbol, True):
            print("[BACKTEST] Symbol select failed")
            return

        df_m5 = DataHandler.get_rates(self.symbol, mt5.TIMEFRAME_M5, requested_bars)
        df_h1 = DataHandler.get_rates(self.symbol, mt5.TIMEFRAME_H1, 3000)

        if df_m5 is None or df_h1 is None:
            print("[BACKTEST] Data load failed")
            return

        df_m5["time"] = pd.to_datetime(df_m5["time"], unit="s")
        df_h1["time"] = pd.to_datetime(df_h1["time"], unit="s")

        for i in range(300, len(df_m5)):
            slice_m5 = df_m5.iloc[:i]
            candle = df_m5.iloc[i]

            if self.open_trade:
                self._check_exit(candle)

            if not self.open_trade:
                trade = self.strategy.process_backtest(slice_m5, df_h1)
                if trade:
                    trade["open_time"] = candle["time"]
                    self.open_trade = trade

        self.report()

    # =====================================================
    def _check_exit(self, candle):
        t = self.open_trade

        hit_tp = (
            candle["high"] >= t["tp"]
            if t["direction"] == "BUY"
            else candle["low"] <= t["tp"]
        )

        hit_sl = (
            candle["low"] <= t["stop"]
            if t["direction"] == "BUY"
            else candle["high"] >= t["stop"]
        )

        if not hit_tp and not hit_sl:
            return

        risk = abs(t["entry"] - t["stop"])
        reward = abs(t["tp"] - t["entry"])
        rr = reward / risk if risk > 0 else 0

        pnl = (
            RISK_PER_TRADE_NAIRA * rr
            if hit_tp
            else -RISK_PER_TRADE_NAIRA
        )

        self.balance += pnl
        self.max_balance = max(self.max_balance, self.balance)

        dd = self.max_balance - self.balance
        self.max_dd_naira = max(self.max_dd_naira, dd)
        self.max_dd_r = max(self.max_dd_r, dd / RISK_PER_TRADE_NAIRA)

        self.results.append({
            "time": candle["time"],
            "direction": t["direction"],
            "rr": round(rr, 2),
            "pnl_naira": round(pnl, 2),
            "balance": round(self.balance, 2)
        })

        self.open_trade = None

    # =====================================================
    def report(self):
        if not self.results:
            print("[BACKTEST] No trades")
            return

        df = pd.DataFrame(self.results)

        print("\n========== BACKTEST RESULTS ==========")
        print(f"Trades:          {len(df)}")
        print(f"Win rate:        {(df['pnl_naira'] > 0).mean()*100:.2f}%")
        print(f"Avg RR:          {df['rr'].mean():.2f}")
        print(f"Net PnL:         ₦{df['pnl_naira'].sum():.2f}")
        print(f"Max DD:          ₦{self.max_dd_naira:.2f}")
        print(f"Max DD (R):      {self.max_dd_r:.2f}R")
        print(f"End Balance:     ₦{self.balance:.2f}")
        print("====================================")

        df.to_csv("backtest_rr_dd.csv", index=False)
        print("\n[BACKTEST] Saved → backtest_rr_dd.csv")


if __name__ == "__main__":
    Backtester(SYMBOL).run()
