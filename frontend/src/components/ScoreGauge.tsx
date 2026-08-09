import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: number;
  type?: 'ats' | 'quality' | 'risk' | 'match';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  sublabel,
  size = 140,
  type = 'ats'
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#059669'; // Rich Emerald Green
  let textColor = 'text-emerald-700';
  if (type === 'risk') {
    if (clampedScore >= 45) {
      strokeColor = '#dc2626'; // Red
      textColor = 'text-rose-700';
    } else {
      strokeColor = '#059669'; // Emerald Green
      textColor = 'text-emerald-700';
    }
  } else if (type === 'match' || type === 'ats' || type === 'quality') {
    if (clampedScore >= 75) strokeColor = '#059669';
    else if (clampedScore >= 50) strokeColor = '#d97706';
    else strokeColor = '#dc2626';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
            {clampedScore}%
          </span>
          {sublabel && <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{sublabel}</span>}
        </div>
      </div>
      <span className="mt-3 text-xs font-bold text-slate-900 uppercase tracking-wider">{label}</span>
    </div>
  );
};
