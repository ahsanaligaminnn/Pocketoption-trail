import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Header = () => {
  return (
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <TrendingUp className="w-12 h-12 text-blue-500" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          AFA TRADING
        </h1>
      </div>
      <h2 className="text-xl text-gray-400">Professional Binary Options Signal Generator</h2>
      <div className="mt-2 inline-block px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
        PocketOption API v2.0 Connected
      </div>
    </div>
  );
}