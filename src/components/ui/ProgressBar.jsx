import { motion } from 'framer-motion';

export const ProgressBar = ({ value, max = 100, className = '', showLabel = true, color = 'indigo', theme = 'light' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const barColors = {
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  const isDark = theme === 'dark';
  const trackClass = isDark ? 'bg-white/20' : 'bg-gray-200';
  const fillClass = isDark ? 'bg-white' : barColors[color];
  const labelClass = isDark ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-gray-700';

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        {showLabel && (
          <span className={labelClass}>{Math.round(percentage)}%</span>
        )}
      </div>
      <div className={`w-full ${trackClass} rounded-full h-2 overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${fillClass} rounded-full`}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({ value, max = 100, size = 120, strokeWidth = 8, className = '', theme = 'light' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const isDark = theme === 'dark';

  const getColor = (percent) => {
    if (isDark) return '#ffffff';
    if (percent < 30) return '#ef4444';
    if (percent < 50) return '#f59e0b';
    if (percent < 70) return '#eab308';
    return '#10b981';
  };

  const trackColor = isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb';
  const labelClass = isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={labelClass}>{Math.round(percentage)}</span>
      </div>
    </div>
  );
};
