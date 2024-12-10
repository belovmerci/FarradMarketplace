import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import '../styles/general.css';

const AuthPage: React.FC = () => {
  const { login, register } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Toggle between login and registration
  const [isLogin, setIsLogin] = useState(true); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      navigate('/'); // Redirect to home on successful login
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register(username, password, email);
      setIsLogin(true); // Switch to login form on successful registration
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-toggle">
        <button
          className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => {
            setIsLogin(true);
            setError(null);
          }}
        >
          Login
        </button>
        <button
          className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => {
            setIsLogin(false);
            setError(null);
          }}
        >
          Register
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="form-group">
            <label htmlFor="login-username">Username:</label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <div className="form-group">
            <label htmlFor="register-username">Username:</label>
            <input
              type="text"
              id="register-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-username">Email:</label>
            <input
              type="text"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password:</label>
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="register-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
