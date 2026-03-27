import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label" htmlFor={props.id}>{label}</label>}
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={18} />}
        <input 
          ref={ref}
          className={`input-field ${Icon ? 'has-icon' : ''} ${error ? 'has-error' : ''}`}
          {...props} 
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
