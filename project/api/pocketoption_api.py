from typing import Dict, List, Optional
import time
from datetime import datetime, timedelta
import random
from dataclasses import dataclass

@dataclass
class MarketIndicators:
    macd: float
    signal_line: float
    rsi: float
    stochastic_k: float
    stochastic_d: float
    sma_20: float
    ema_50: float

class PocketOptionAPI:
    def __init__(self):
        self.connected = True
        self.api_version = "2.0"
        
    def calculate_indicators(self, prices: List[float]) -> MarketIndicators:
        """Calculate technical indicators for market analysis."""
        # Calculate MACD
        ema_12 = self._calculate_ema(prices, 12)
        ema_26 = self._calculate_ema(prices, 26)
        macd_line = ema_12 - ema_26
        signal_line = self._calculate_ema([macd_line], 9)[0]
        
        # Calculate RSI
        rsi = self._calculate_rsi(prices, 14)
        
        # Calculate Stochastic
        stoch_k, stoch_d = self._calculate_stochastic(prices, 14, 3)
        
        # Calculate Moving Averages
        sma_20 = sum(prices[-20:]) / 20 if len(prices) >= 20 else prices[-1]
        ema_50 = self._calculate_ema(prices, 50)
        
        return MarketIndicators(
            macd=macd_line,
            signal_line=signal_line,
            rsi=rsi,
            stochastic_k=stoch_k,
            stochastic_d=stoch_d,
            sma_20=sma_20,
            ema_50=ema_50
        )
    
    def _calculate_ema(self, prices: List[float], period: int) -> float:
        """Calculate Exponential Moving Average."""
        if len(prices) < period:
            return prices[-1]
            
        multiplier = 2 / (period + 1)
        ema = prices[0]
        
        for price in prices[1:]:
            ema = (price - ema) * multiplier + ema
            
        return ema
    
    def _calculate_rsi(self, prices: List[float], period: int) -> float:
        """Calculate Relative Strength Index."""
        if len(prices) < period + 1:
            return 50
            
        deltas = [prices[i+1] - prices[i] for i in range(len(prices)-1)]
        gains = [d if d > 0 else 0 for d in deltas]
        losses = [-d if d < 0 else 0 for d in deltas]
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            return 100
            
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    def _calculate_stochastic(self, prices: List[float], k_period: int, d_period: int) -> tuple[float, float]:
        """Calculate Stochastic Oscillator."""
        if len(prices) < k_period:
            return 50, 50
            
        low_min = min(prices[-k_period:])
        high_max = max(prices[-k_period:])
        
        if high_max - low_min == 0:
            return 50, 50
            
        k = 100 * (prices[-1] - low_min) / (high_max - low_min)
        d = sum([k] * d_period) / d_period  # Simple average for demonstration
        
        return k, d
        
    def get_market_data(self, symbol: str, timeframe: int = 1) -> Dict:
        """Get market data for a specific symbol."""
        # Simulate real market data
        base_price = 1.2345
        prices = [
            base_price + (random.random() - 0.5) * 0.01 
            for _ in range(100)
        ]
        
        current_price = prices[-1]
        
        return {
            "symbol": symbol,
            "timeframe": timeframe,
            "timestamp": int(time.time()),
            "open": current_price - 0.0010,
            "high": current_price + 0.0020,
            "low": current_price - 0.0015,
            "close": current_price,
            "volume": 1000,
            "prices": prices
        }
        
    def analyze_market(self, symbol: str, days: int, use_news_filter: bool = True) -> Dict:
        """Analyze market conditions for signal generation."""
        market_data = self.get_market_data(symbol)
        indicators = self.calculate_indicators(market_data["prices"])
        
        # Determine trend based on indicators
        trend = self._determine_trend(indicators)
        
        # Calculate trend strength
        strength = self._calculate_trend_strength(indicators)
        
        # Determine volatility
        volatility = self._determine_volatility(market_data["prices"])
        
        # Calculate support and resistance levels
        support_levels = self._calculate_support_levels(market_data["prices"])
        resistance_levels = self._calculate_resistance_levels(market_data["prices"])
        
        return {
            "symbol": symbol,
            "trend": trend,
            "strength": strength,
            "volatility": volatility,
            "support_levels": support_levels,
            "resistance_levels": resistance_levels,
            "news_impact": "low" if use_news_filter else "unknown",
            "indicators": {
                "macd": indicators.macd,
                "signal_line": indicators.signal_line,
                "rsi": indicators.rsi,
                "stochastic_k": indicators.stochastic_k,
                "stochastic_d": indicators.stochastic_d,
                "sma_20": indicators.sma_20,
                "ema_50": indicators.ema_50
            }
        }
    
    def _determine_trend(self, indicators: MarketIndicators) -> str:
        """Determine market trend based on technical indicators."""
        # MACD trend
        macd_bullish = indicators.macd > indicators.signal_line
        
        # RSI trend
        rsi_bullish = indicators.rsi > 50
        
        # Stochastic trend
        stoch_bullish = (
            indicators.stochastic_k > indicators.stochastic_d and 
            indicators.stochastic_k < 80
        )
        
        # Moving averages trend
        ma_bullish = indicators.sma_20 > indicators.ema_50
        
        # Count bullish signals
        bullish_count = sum([
            macd_bullish,
            rsi_bullish,
            stoch_bullish,
            ma_bullish
        ])
        
        if bullish_count >= 3:
            return "bullish"
        elif bullish_count <= 1:
            return "bearish"
        else:
            return "neutral"
    
    def _calculate_trend_strength(self, indicators: MarketIndicators) -> float:
        """Calculate trend strength based on indicators."""
        # RSI strength
        rsi_strength = abs(indicators.rsi - 50) / 50
        
        # MACD strength
        macd_strength = abs(indicators.macd - indicators.signal_line) / abs(indicators.macd) if indicators.macd != 0 else 0
        
        # Stochastic strength
        stoch_strength = abs(indicators.stochastic_k - 50) / 50
        
        # Average strength
        return (rsi_strength + macd_strength + stoch_strength) / 3
    
    def _determine_volatility(self, prices: List[float]) -> str:
        """Determine market volatility."""
        returns = [(prices[i+1] - prices[i]) / prices[i] for i in range(len(prices)-1)]
        volatility = sum([abs(r) for r in returns]) / len(returns)
        
        if volatility < 0.001:
            return "low"
        elif volatility < 0.002:
            return "medium"
        else:
            return "high"
    
    def _calculate_support_levels(self, prices: List[float]) -> List[float]:
        """Calculate support levels."""
        min_prices = []
        window = 20
        
        for i in range(len(prices) - window):
            min_prices.append(min(prices[i:i+window]))
            
        return sorted(list(set([round(p, 4) for p in min_prices[-3:]])))
    
    def _calculate_resistance_levels(self, prices: List[float]) -> List[float]:
        """Calculate resistance levels."""
        max_prices = []
        window = 20
        
        for i in range(len(prices) - window):
            max_prices.append(max(prices[i:i+window]))
            
        return sorted(list(set([round(p, 4) for p in max_prices[-3:]])))
        
    def generate_signals(
        self,
        symbol: str,
        start_time: str,
        end_time: str,
        accuracy: int,
        count: int,
        timeframe: int = 1
    ) -> List[Dict]:
        """Generate trading signals based on market analysis."""
        signals = []
        current_time = datetime.strptime(start_time, "%H:%M")
        end_datetime = datetime.strptime(end_time, "%H:%M")
        
        market_analysis = self.analyze_market(symbol, 7)
        
        for i in range(count):
            if current_time >= end_datetime:
                break
                
            # Determine signal type based on analysis
            signal_type = self._determine_signal_type(market_analysis)
                
            signal = {
                "id": i + 1,
                "symbol": symbol,
                "type": signal_type,
                "time": current_time.strftime("%H:%M"),
                "probability": f"{accuracy}%",
                "timeframe": f"{timeframe}m"
            }
            signals.append(signal)
            
            # Add random gap between 3-20 minutes
            gap = random.randint(3, 21)
            current_time += timedelta(minutes=gap)
            
        return signals
    
    def _determine_signal_type(self, analysis: Dict) -> str:
        """Determine signal type based on market analysis."""
        if analysis["trend"] == "bullish" and analysis["strength"] > 0.7:
            return "CALL"
        elif analysis["trend"] == "bearish" and analysis["strength"] > 0.7:
            return "PUT"
        else:
            # If trend is not strong enough, use additional indicators
            indicators = analysis["indicators"]
            
            bullish_signals = [
                indicators["macd"] > indicators["signal_line"],
                indicators["rsi"] < 30,
                indicators["stochastic_k"] < 20 and indicators["stochastic_k"] > indicators["stochastic_d"]
            ]
            
            return "CALL" if sum(bullish_signals) >= 2 else "PUT"
        
    def get_connection_status(self) -> Dict:
        """Get API connection status."""
        return {
            "connected": self.connected,
            "version": self.api_version,
            "timestamp": int(time.time())
        }