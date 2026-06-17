import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, UserCircle, Key, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (googleClientId && window.google) {
      try {
        const buttonContainer = document.getElementById("googleSignInRealButton");
        if (buttonContainer && buttonContainer.children.length === 0) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            ux_mode: 'popup',
            callback: (response) => {
              handleGoogleLoginSubmit(response.credential);
            }
          });
          window.google.accounts.id.renderButton(
            buttonContainer,
            { 
              theme: "outline", 
              size: "large", 
              width: buttonContainer.clientWidth || 320, 
              text: "continue_with",
              shape: "pill"
            }
          );
        }
      } catch (err) {
        console.error("GSI Init error:", err);
      }
    }
  }, [googleClientId]);

  const handleGoogleLoginSubmit = async (credential, roleVal) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        credential,
        role: roleVal
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.user.role === 'pending') {
        navigate('/select-role');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error('Google Auth Error Details:', err.response?.data);
      setError(err.response?.data?.message || 'Google authentication failed. Please check your network or server status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage('A reset code has been sent to your email.');
      setMode('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      setMessage('Password reset successfully. You can now log in.');
      setMode('login');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-24 md:pt-32">
      <div className="w-full max-w-md space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <motion.div
            key={mode}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 sm:w-20 sm:h-20 bg-teal-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-teal-100"
          >
            {mode === 'login' ? <UserCircle className="text-white w-8 h-8 sm:w-12 sm:h-12" /> : <Key className="text-white w-8 h-8 sm:w-12 sm:h-12" />}
          </motion.div>
          
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login-text"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="space-y-1"
              >
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Welcome Back.</h2>
                <p className="text-slate-500 font-light text-sm sm:text-lg">Sign in to continue your learning journey.</p>
              </motion.div>
            )}
            {mode === 'forgot' && (
              <motion.div
                key="forgot-text"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="space-y-1"
              >
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Forgot Password?</h2>
                <p className="text-slate-500 font-light text-sm sm:text-lg">No worries! Enter your email to receive a code.</p>
              </motion.div>
            )}
            {mode === 'reset' && (
              <motion.div
                key="reset-text"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="space-y-1"
              >
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Reset Password.</h2>
                <p className="text-slate-500 font-light text-sm sm:text-lg">Enter code and new password.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-50 p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] border border-slate-100 space-y-4 sm:space-y-6 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-teal-50 text-teal-600 p-4 rounded-2xl text-sm font-medium border border-teal-100">
              {message}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                    placeholder="name@institution.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-500 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="flex justify-center w-full min-h-[44px] my-2">
                <div id="googleSignInRealButton" className="w-full"></div>
                {!googleClientId && (
                  <div className="text-xs text-slate-400 font-bold bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
                    ⚠️ Google Auth not configured. Add VITE_GOOGLE_CLIENT_ID to .env
                  </div>
                )}
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                    placeholder="name@institution.edu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-500 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Reset Code <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>

              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="w-full flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-teal-600 transition-colors text-sm uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Reset Code</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-500 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Reset Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>

              <button 
                type="button" 
                onClick={() => setMode('forgot')}
                className="w-full flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-teal-600 transition-colors text-sm uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" /> Resend Code
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-slate-500 font-light">
          Don't have an account?{' '}
          <Link to="/select-role" className="text-teal-600 font-bold hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  );
}
