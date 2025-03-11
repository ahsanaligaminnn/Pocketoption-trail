import { PocketOptionSignal, MarketAnalysis, ConnectionStatus } from '../types';

export class PocketOptionApi {
  private baseUrl: string;
  private connected: boolean;
  private apiVersion: string;

  constructor() {
    this.baseUrl = '/api/pocketoption';
    this.connected = true;
    this.apiVersion = '2.0';
  }

  async getMarketData(symbol: string, timeframe: number = 1): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/market-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, timeframe }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async analyzeMarket(
    symbol: string,
    days: number,
    useNewsFilter: boolean = true
  ): Promise<MarketAnalysis> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, days, useNewsFilter }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze market');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing market:', error);
      throw error;
    }
  }

  async generateSignals(
    symbol: string,
    startTime: string,
    endTime: string,
    accuracy: number,
    count: number,
    timeframe: number = 1
  ): Promise<PocketOptionSignal[]> {
    try {
      const response = await fetch(`${this.baseUrl}/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          startTime,
          endTime,
          accuracy,
          count,
          timeframe,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate signals');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating signals:', error);
      throw error;
    }
  }

  getConnectionStatus(): ConnectionStatus {
    return {
      connected: this.connected,
      version: this.apiVersion,
      timestamp: Date.now(),
    };
  }
}

// Types
export interface PocketOptionSignal {
  id: number;
  symbol: string;
  type: 'CALL' | 'PUT';
  time: string;
  probability: string;
  timeframe: string;
}

export interface MarketAnalysis {
  symbol: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  volatility: 'low' | 'medium' | 'high';
  supportLevels: number[];
  resistanceLevels: number[];
  newsImpact: 'low' | 'medium' | 'high' | 'unknown';
}

export interface ConnectionStatus {
  connected: boolean;
  version: string;
  timestamp: number;
}