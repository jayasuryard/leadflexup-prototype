import { useState } from 'react';

export const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-12' : ''} 
            bg-white border-2 rounded-xl
            transition-all duration-200
            ${focused ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-200'}
            ${error ? 'border-red-500' : ''}
            focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
            placeholder:text-gray-400
            ${className}
          `}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export const Select = ({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  children,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-12' : ''} 
            bg-white border-2 rounded-xl appearance-none
            transition-all duration-200
            ${focused ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-200'}
            ${error ? 'border-red-500' : ''}
            focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
            cursor-pointer
            ${className}
          `}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
