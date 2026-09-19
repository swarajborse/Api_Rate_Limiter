import { useState, useEffect } from 'react';

export default function TokenBucket({ currentTokens, maxTokens }) {
  const [animatedTokens, setAnimatedTokens] = useState(currentTokens);

  useEffect(() => {
    setAnimatedTokens(currentTokens);
  }, [currentTokens]);

  const percentage = maxTokens > 0 ? (animatedTokens / maxTokens) * 100 : 0;
  const barHeight = Math.max(percentage, 2);

  let barColor = 'bg-emerald-400';
  let glowColor = 'shadow-emerald-500/20';
  if (percentage < 20) {
    barColor = 'bg-red-400';
    glowColor = 'shadow-red-500/20';
  } else if (percentage < 50) {
    barColor = 'bg-amber-400';
    glowColor = 'shadow-amber-500/20';
  }

  return (
    <div className="bg-dark-700 rounded-xl border border-dark-600 p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-dark-200 mb-4 uppercase tracking-wider">
        Token Bucket
      </h3>

      <div className="relative w-28 h-52 border-2 border-dark-500 rounded-b-3xl rounded-t-lg overflow-hidden bg-dark-800">
        <div className="absolute inset-0 flex flex-col justify-end p-1">
          <div
            className={`w-full rounded-b-2xl transition-all duration-500 ease-out ${barColor} opacity-80`}
            style={{ height: `${barHeight}%` }}
          />
        </div>

        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dark-600/30"
            style={{ bottom: `${(i + 1) * 20}%` }}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-dark-100">
          {animatedTokens}
          <span className="text-sm text-dark-400 font-normal ml-1">/ {maxTokens}</span>
        </p>
        <p className="text-xs text-dark-400 mt-1">Available Tokens</p>
      </div>

      <div className="w-full mt-3 bg-dark-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-dark-400 mt-1">{Math.round(percentage)}% capacity</p>
    </div>
  );
}
