import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="logo-placeholder">CH</div>
          <h2>Admin Portal</h2>
          <p className="text-secondary">Sign in to manage certificates</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <Input 
            icon={Mail}
            type="email"
            label="Email Address"
            placeholder="admin@certifyhub.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            icon={Lock}
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="login-actions">
            <Button 
              type="submit" 
              className="w-full mt-4" 
              isLoading={isLoading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="login-footer">
          <a href="/" className="text-sm">← Back to public verification</a>
        </div>
      </div>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Login;
