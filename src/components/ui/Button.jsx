import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800 shadow-lg shadow-navy-700/20',
    secondary: 'bg-white text-navy-800 border-2 border-navy-200 hover:border-navy-300 hover:bg-navy-50',
    outline: 'bg-transparent text-navy-700 border-2 border-navy-300 hover:bg-navy-50',
    ghost: 'bg-transparent text-navy-600 hover:bg-navy-50',
    teal: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </motion.button>
  );
};
