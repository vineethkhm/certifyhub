import React from 'react';

const Spinner = ({ size = 24, className = '' }) => {
  return (
    <div 
      className={`animate-spin ${className}`} 
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: 'var(--color-primary)',
        display: 'inline-block'
      }}
    />
  );
};

export default Spinner;
