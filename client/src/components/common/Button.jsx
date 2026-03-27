import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading, icon: Icon, ...props }) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${className} ${isLoading ? 'loading' : ''}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {Icon && <Icon className="btn-icon" size={18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
