import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { SignalGenerator } from './components/SignalGenerator';
import { Header } from './components/Header';
import { BackgroundChart } from './components/BackgroundChart';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white relative overflow-hidden">
      <BackgroundChart />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        <SignalGenerator />
      </div>
    </div>
  );
}

export default App;