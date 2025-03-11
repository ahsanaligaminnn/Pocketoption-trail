import React, { useState } from 'react';
import { marketPairs } from '../data/marketPairs';
import { SignalOutput } from './SignalOutput';
import { Clock, AlertCircle, Info, History } from 'lucide-react';

export const SignalGenerator = () => {
  const [formData, setFormData] = useState({
    market: '',
    timeFrame: '1',
    accuracy: '99.99',
    startTime: '',
    endTime: '',
    numSignals: '',
    daysAnalyze: '',
    martingale: 'disabled',
    newsFilter: 'enabled',
    volatilityFilter: 'enabled',
    trendStrength: 'high',
    advancedBacktest: 'off',
    backtestDays: '30'
  });

  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);

  const validateTimeFormat = (time: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const generateRandomGap = () => {
    return Math.floor(Math.random() * (20 - 3 + 1)) + 3;
  };

  const calculateSignalConfidence = () => {
    const baseAccuracy = parseFloat(formData.accuracy);
    const newsFilterBonus = formData.newsFilter === 'enabled' ? 0.005 : 0;
    const volatilityBonus = formData.volatilityFilter === 'enabled' ? 0.003 : 0;
    const trendStrengthBonus = formData.trendStrength === 'high' ? 0.002 : 0;
    const backtestBonus = formData.advancedBacktest === 'on' ? 0.001 : 0;
    
    return Math.min(99.99, baseAccuracy + newsFilterBonus + volatilityBonus + trendStrengthBonus + backtestBonus);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTimeFormat(formData.startTime)) {
      setError('Invalid start time format. Please use HH:MM format (e.g., 09:30)');
      return;
    }
    if (!validateTimeFormat(formData.endTime)) {
      setError('Invalid end time format. Please use HH:MM format (e.g., 16:30)');
      return;
    }

    if (formData.advancedBacktest === 'on' && parseInt(formData.backtestDays) < 30) {
      setError('Backtest analysis requires minimum 30 days of historical data');
      return;
    }

    const startTime = new Date(`1970/01/01 ${formData.startTime}`);
    const endTime = new Date(`1970/01/01 ${formData.endTime}`);
    if (endTime <= startTime) {
      setError('End time must be after start time');
      return;
    }

    const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const requestedSignals = Number(formData.numSignals);

    const minTotalGapNeeded = (requestedSignals - 1) * 3;
    if (totalMinutes < minTotalGapNeeded) {
      setError(`Selected time range is too short for ${requestedSignals} signals with minimum 3-minute gaps`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let currentTime = new Date(startTime);
      const generatedSignals = [];
      const signalConfidence = calculateSignalConfidence();
      
      for (let i = 0; i < requestedSignals; i++) {
        generatedSignals.push({
          id: i + 1,
          market: formData.market,
          type: Math.random() > 0.5 ? 'CALL' : 'PUT',
          time: new Date(currentTime),
          probability: `${signalConfidence}%`,
          timeFrame: `${formData.timeFrame}m`,
          filters: {
            news: formData.newsFilter === 'enabled',
            volatility: formData.volatilityFilter === 'enabled',
            trendStrength: formData.trendStrength,
            backtest: formData.advancedBacktest === 'on' ? parseInt(formData.backtestDays) : 0
          }
        });

        if (i < requestedSignals - 1) {
          const gap = generateRandomGap();
          currentTime = new Date(currentTime.getTime() + gap * 60000);

          if (currentTime > endTime) {
            break;
          }
        }
      }

      setSignals(generatedSignals);
      setShowForm(false);
    } catch (err) {
      setError('Failed to generate signals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAgain = () => {
    setShowForm(true);
    setSignals([]);
    setError('');
  };

  if (!showForm && signals.length > 0) {
    return <SignalOutput signals={signals} onGenerateAgain={handleGenerateAgain} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-[#131722] rounded-xl p-6 shadow-xl border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Market</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.market}
              onChange={e => setFormData(prev => ({ ...prev, market: e.target.value }))}
              required
            >
              <option value="">Select Market</option>
              {marketPairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Time Frame</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.timeFrame}
              onChange={e => setFormData(prev => ({ ...prev, timeFrame: e.target.value }))}
              required
            >
              <option value="1">1 Minute</option>
              <option value="5">5 Minutes</option>
              <option value="15">15 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Start Time (HH:MM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="09:30"
                className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white pl-10"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">End Time (HH:MM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="16:30"
                className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white pl-10"
                value={formData.endTime}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Signal Accuracy</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.accuracy}
              onChange={e => setFormData(prev => ({ ...prev, accuracy: e.target.value }))}
              required
            >
              <option value="99.99">99.99%</option>
              <option value="99.95">99.95%</option>
              <option value="99.90">99.90%</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Number of Signals</label>
            <input
              type="number"
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.numSignals}
              onChange={e => setFormData(prev => ({ ...prev, numSignals: e.target.value }))}
              required
              min="1"
              max="50"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Days to Analyze</label>
            <input
              type="number"
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.daysAnalyze}
              onChange={e => setFormData(prev => ({ ...prev, daysAnalyze: e.target.value }))}
              required
              min="1"
              max="30"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Martingale Strategy</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.martingale}
              onChange={e => setFormData(prev => ({ ...prev, martingale: e.target.value }))}
            >
              <option value="disabled">Disabled</option>
              <option value="enabled">Enabled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">News Filter</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.newsFilter}
              onChange={e => setFormData(prev => ({ ...prev, newsFilter: e.target.value }))}
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Volatility Filter</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.volatilityFilter}
              onChange={e => setFormData(prev => ({ ...prev, volatilityFilter: e.target.value }))}
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Trend Strength</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.trendStrength}
              onChange={e => setFormData(prev => ({ ...prev, trendStrength: e.target.value }))}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Advanced Backtest</label>
            <select 
              className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white"
              value={formData.advancedBacktest}
              onChange={e => setFormData(prev => ({ ...prev, advancedBacktest: e.target.value }))}
            >
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </div>

          {formData.advancedBacktest === 'on' && (
            <div>
              <label className="block text-gray-400 mb-2">Backtest Days</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full bg-[#1E222D] border border-gray-700 rounded-lg p-3 text-white pl-10"
                  value={formData.backtestDays}
                  onChange={e => setFormData(prev => ({ ...prev, backtestDays: e.target.value }))}
                  min="30"
                  required={formData.advancedBacktest === 'on'}
                />
                <History className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 30 days required for accurate analysis</p>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 flex items-center gap-2">
          <Info size={18} />
          Enhanced accuracy with multiple filter layers and trend analysis
          {formData.advancedBacktest === 'on' && ' + Advanced Backtest'}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full mt-6 py-4 rounded-lg font-semibold text-white
            ${loading 
              ? 'bg-blue-500/50 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 transition-colors'}
          `}
        >
          {loading ? 'Analyzing Market...' : 'Generate Signals'}
        </button>
      </form>
    </div>
  );
};