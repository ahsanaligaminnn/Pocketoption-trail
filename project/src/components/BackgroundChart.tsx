import React from 'react';

export const BackgroundChart = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0,50 Q25,40 50,60 T100,50"
          stroke="url(#gradient)"
          strokeWidth="0.5"
          fill="none"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};