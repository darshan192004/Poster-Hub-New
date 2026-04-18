import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`py-2 px-4 border rounded ${className}`}
      {...props}
    />
  ); 
};

export default Input;
