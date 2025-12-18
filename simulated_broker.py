class SimulatedBroker:
    """
    Simulates order execution, SL/TP, and equity.
    """

    def __init__(self, starting_balance):
        self.balance = starting_balance
        self.equity = starting_balance
        self.open_trades = []
        self.closed_trades = []

    def place_limit(self, trade):
        self.open_trades.append(trade)

    def update(self, candle):
        still_open = []

        for trade in self.open_trades:
            direction = trade["direction"]

            if direction == "BUY":
                if candle["low"] <= trade["entry"]:
                    trade["filled"] = True
                if trade.get("filled"):
                    if candle["low"] <= trade["stop"]:
                        trade["exit_price"] = trade["stop"]
                        trade["result"] = "LOSS"
                        self._close(trade)
                        continue
                    if candle["high"] >= trade["tp"]:
                        trade["exit_price"] = trade["tp"]
                        trade["result"] = "WIN"
                        self._close(trade)
                        continue

            if direction == "SELL":
                if candle["high"] >= trade["entry"]:
                    trade["filled"] = True
                if trade.get("filled"):
                    if candle["high"] >= trade["stop"]:
                        trade["exit_price"] = trade["stop"]
                        trade["result"] = "LOSS"
                        self._close(trade)
                        continue
                    if candle["low"] <= trade["tp"]:
                        trade["exit_price"] = trade["tp"]
                        trade["result"] = "WIN"
                        self._close(trade)
                        continue

            still_open.append(trade)

        self.open_trades = still_open

    def _close(self, trade):
        pnl = trade["risk"] if trade["result"] == "WIN" else -trade["risk"]
        self.balance += pnl
        trade["pnl"] = pnl
        self.closed_trades.append(trade)
