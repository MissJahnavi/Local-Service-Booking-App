import React from 'react';

export const Button = ({ children, onClick, variant = 'default', size = 'md', ...props }) => {
  const base = 'rounded-xl font-medium px-4 py-1 transition';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizes = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
