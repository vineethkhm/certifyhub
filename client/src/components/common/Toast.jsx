import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
