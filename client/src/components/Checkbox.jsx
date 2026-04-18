import React from 'react';

const Checkbox = ({ id, ...props }) => {
  return (
    <input
      type="checkbox"
      id={id}
      className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded"
      {...props}
    />
  ); 
};

export default Checkbox;
