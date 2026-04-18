import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  size = 'md', 
  variant = 'default',
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const variantStyles = {
    default: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
    primary: 'bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800',
    outline: 'border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50',
    ghost: 'text-gray-600 hover:text-pink-600 hover:bg-pink-50',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  return ( 
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
