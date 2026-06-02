import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import useRedirectIfAuthenticated from '../hooks/useRedirectIfAuthenticated';
import { useAuth } from '../context/AuthContext';
// JWT decoding is performed manually without external library
import api from '../services/api';
const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authRedirect = useRedirectIfAuthenticated();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (authRedirect) return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
        const userInfo = { name: payload.name || payload.email || 'Google User', email: payload.email };
        login(userInfo, token);
        navigate('/dashboard');
      } catch (e) {
        console.error('Failed to decode JWT:', e);
        // fallback to generic user
        login({ name: 'Google User', email: 'user@gmail.com' }, token);
        navigate('/dashboard');
      }
    }
    
    if (error) {
      setErrorMessage('Google Authentication failed. Please try again.');
    }
  }, [location.search, login, navigate]);  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const endpoint = type === 'register' ? '/auth/register' : '/auth/login';
      const res = await api.post(endpoint, formData);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'An unexpected error occurred';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {type === 'register' ? 'Create an Account' : 'Welcome Back'}
        </h2>
        {errorMessage && (
          <div className="mb-4 p-2 bg-rose-600/20 text-rose-300 rounded" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <input 
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary-500 transition"
              placeholder="Full Name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}
          <input 
            type="email"
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary-500 transition"
            placeholder="Email Address"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              className="w-full bg-white/5 border border-white/10 p-3 pr-10 rounded-xl outline-none focus:border-primary-500 transition"
              placeholder="Password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button className="w-full bg-primary-600 py-3 rounded-xl font-semibold hover:bg-primary-500 transition">
            {type === 'register' ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5"><path fill="#FFC107" d="M43.6 20.4h-4.6V20h-16v8h9.6c-1.6 4.6-6 8-10.6 8-6.2 0-11.2-5-11.2-11.2s5-11.2 11.2-11.2c2.9 0 5.5 1.1 7.5 2.9l5.6-5.6C33.5 7.5 30.1 6 26.4 6 15.9 6 7.4 14.5 7.4 25s8.5 19 19 19c10.5 0 19-8.5 19-19 0-1.3-.1-2.5-.3-3.6z"/>
            </svg>
            Sign {type === 'register' ? 'Up' : 'In'} with Google
          </button>
            {/* Navigation links */}
            {type === 'register' ? (
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-300 hover:underline">Sign In</Link>
              </p>
            ) : (
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-300 hover:underline">Sign Up</Link>
              </p>
            )}
          <div className="text-sm text-slate-400">
            <Link to="/" className="hover:text-white transition">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
