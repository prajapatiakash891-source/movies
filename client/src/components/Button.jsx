import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  className = '',
  disabled = false,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-red text-white hover:bg-brand-red-hover shadow-lg shadow-brand-red/20 focus:ring-brand-red',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10 focus:ring-white/30',
    outline: 'border border-brand-red text-brand-red hover:bg-brand-red/10 focus:ring-brand-red',
    ghost: 'text-neutral-300 hover:text-white hover:bg-white/10',
    dark: 'bg-dark-card hover:bg-dark-hover text-white border border-dark-border',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
};

export default Button;
