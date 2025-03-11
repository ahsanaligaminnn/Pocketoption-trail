from typing import Dict, List, Optional
from .pocketoption_api import PocketOptionAPI

class PocketOptionClient:
    def __init__(self):
        self.api = PocketOptionAPI()
        
    def validate_market(self, symbol: str) -> bool:
        """Validate if a market symbol is available for trading."""
        valid_markets = [
            # Forex Pairs
            "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD",
            "AUD/USD", "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY",
            
            # OTC Market Pairs
            "EUR/USD-OTC", "GBP/USD-OTC", "USD/JPY-OTC", "EUR/JPY-OTC",
            "GBP/JPY-OTC", "USD/CHF-OTC", "EUR/CHF-OTC", "AUD/CAD-OTC",
            "AUD/CHF-OTC", "AUD/JPY-OTC",
            
            # Stock OTC
            "AAPL-OTC", "GOOGL-OTC", "MSFT-OTC", "AMZN-OTC", "TSLA-OTC",
            "META-OTC", "NFLX-OTC", "NVDA-OTC", "AMD-OTC", "INTC-OTC"
        ]
        return symbol in valid_markets
        
    async def get_signals(
        self,
        symbol: str,
        start_time: str,
        end_time: str,
        accuracy: int,
        count: int,
        timeframe: int = 1,
        use_news_filter: bool = True
    ) -> Dict:
        """Get trading signals with market analysis."""
        if not self.validate_market(symbol):
            raise ValueError(f"Invalid market symbol: {symbol}")
            
        # Analyze market conditions
        market_analysis = self.api.analyze_market(symbol, 7, use_news_filter)
        
        # Generate signals based on analysis
        signals = self.api.generate_signals(
            symbol,
            start_time,
            end_time,
            accuracy,
            count,
            timeframe
        )
        
        return {
            "market_analysis": market_analysis,
            "signals": signals,
            "metadata": {
                "generated_at": int(time.time()),
                "timeframe": f"{timeframe}m",
                "accuracy": f"{accuracy}%",
                "news_filter": use_news_filter
            }
        }