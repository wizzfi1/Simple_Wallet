from datetime import datetime
from backtest.backtester import Backtester

if __name__ == "__main__":
    bt = Backtester(
        symbol="EURUSD",
        start_balance=100000
    )

    trades, final_balance = bt.run(
        start_date=datetime(2024, 1, 1),
        end_date=datetime(2024, 6, 1)
    )

    wins = [t for t in trades if t["result"] == "WIN"]
    losses = [t for t in trades if t["result"] == "LOSS"]

    print("========== BACKTEST RESULTS ==========")
    print(f"Trades: {len(trades)}")
    print(f"Wins: {len(wins)}")
    print(f"Losses: {len(losses)}")
    print(f"Final Balance: {final_balance}")
