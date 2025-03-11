import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Download, RefreshCw, Shield, Zap, History } from 'lucide-react';

interface Signal {
  id: number;
  market: string;
  type: 'CALL' | 'PUT';
  time: Date;
  probability: string;
  timeFrame: string;
  filters: {
    news: boolean;
    volatility: boolean;
    trendStrength: string;
    backtest: number;
  };
}

interface SignalOutputProps {
  signals: Signal[];
  onGenerateAgain: () => void;
}

export const SignalOutput: React.FC<SignalOutputProps> = ({ signals, onGenerateAgain }) => {
  const handleDownload = () => {
    const text = signals
      .map(signal => {
        const filters = [
          signal.filters.news ? 'News Filter: ON' : 'News Filter: OFF',
          signal.filters.volatility ? 'Volatility Filter: ON' : 'Volatility Filter: OFF',
          `Trend Strength: ${signal.filters.trendStrength.toUpperCase()}`,
          signal.filters.backtest > 0 ? `Backtest: ${signal.filters.backtest} days` : 'Backtest: OFF'
        ].join(' | ');
        
        return `${signal.time.toLocaleTimeString()} | ${signal.market} | ${signal.type} | ${signal.probability} | ${filters}`;
      })
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pocketoption-signals.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 bg-[#131722] rounded-xl p-6 shadow-xl border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Generated Signals</h2>
          <p className="text-gray-400 text-sm mt-1">Enhanced accuracy with multi-layer filtering</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
          >
            <Download size={18} />
            Download Signals
          </button>
          <button
            onClick={onGenerateAgain}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            <RefreshCw size={18} />
            Generate Again
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {signals.map(signal => (
          <div
            key={signal.id}
            className="flex items-center justify-between p-4 bg-[#1E222D] rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-4">
              {signal.type === 'CALL' ? (
                <ArrowUpCircle className="w-8 h-8 text-green-500" />
              ) : (
                <ArrowDownCircle className="w-8 h-8 text-red-500" />
              )}
              <div>
                <h3 className="font-semibold">{signal.market}</h3>
                <p className="text-sm text-gray-400">
                  {signal.time.toLocaleTimeString()} • {signal.timeFrame}
                </p>
                <div className="flex gap-2 mt-1">
                  {signal.filters.news && (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                      <Shield size={12} />
                      News Filter
                    </span>
                  )}
                  {signal.filters.volatility && (
                    <span className="inline-flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                      <Zap size={12} />
                      Volatility
                    </span>
                  )}
                  {signal.filters.backtest > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded">
                      <History size={12} />
                      {signal.filters.backtest}d Backtest
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={signal.type === 'CALL' ? 'text-green-500' : 'text-red-500'}>
                {signal.type}
              </p>
              <p className="text-sm text-gray-400">{signal.probability} Probability</p>
              <p className="text-xs text-gray-500 mt-1">
                Trend: {signal.filters.trendStrength.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};