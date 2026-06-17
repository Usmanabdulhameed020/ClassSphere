import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, School, Building2, Key, GraduationCap, Briefcase, ShieldCheck, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role-specific fields
  const [extraField1, setExtraField1] = useState(''); // School/Dept/Institution
  const [extraField2, setExtraField2] = useState(''); // ID/Code
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let checkInterval;
    
    const initGoogle = () => {
      if (googleClientId && window.google) {
        try {
          const buttonContainer = document.getElementById("googleSignUpRealButton");
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
                text: "signup_with",
                shape: "pill"
              }
            );
            if (checkInterval) clearInterval(checkInterval);
          }
        } catch (err) {
          console.error("GSI Init error:", err);
        }
      }
    };

    // Try immediately
    initGoogle();

    // Set up polling interval as backup in case script is still loading
    if (!window.google && googleClientId) {
      checkInterval = setInterval(() => {
        if (window.google) {
          initGoogle();
        }
      }, 500);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [googleClientId, role]);

  const handleGoogleLoginSubmit = async (credential) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        credential,
        role: role // Use the pre-selected role (student, teacher, admin)
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchParams.get('role')) {
      navigate('/select-role');
    }
  }, [searchParams, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
        role,
        extraFields: {
          field1: extraField1,
          field2: extraField2,
        }
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'teacher':
        return {
          title: 'Teacher Registration',
          subtitle: 'Empower the next generation of leaders.',
          icon: <Briefcase className="w-12 h-12" />,
          field1Label: 'Department',
          field1Placeholder: 'e.g. Mathematics',
          field1Icon: <Building2 className="w-5 h-5" />,
          field2Label: 'Employee ID',
          field2Placeholder: 'T-XXXXX',
          field2Icon: <Key className="w-5 h-5" />,
        };
      case 'admin':
        return {
          title: 'Admin Portal Setup',
          subtitle: 'Manage and oversee your institutional ecosystem.',
          icon: <ShieldCheck className="w-12 h-12" />,
          field1Label: 'Institution Name',
          field1Placeholder: 'e.g. ClassSphere University',
          field1Icon: <School className="w-5 h-5" />,
          field2Label: 'Admin Access Code',
          field2Placeholder: 'Enter verification code',
          field2Icon: <Key className="w-5 h-5" />,
        };
      default: // student
        return {
          title: 'Student Enrollment',
          subtitle: 'Start your personalized learning journey today.',
          icon: <GraduationCap className="w-12 h-12" />,
          field1Label: 'School / University',
          field1Placeholder: 'e.g. Westside High',
          field1Icon: <School className="w-5 h-5" />,
          field2Label: 'Student ID',
          field2Placeholder: 'S-XXXXX',
          field2Icon: <Key className="w-5 h-5" />,
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 pt-24 md:pt-32">
      <div className="w-full max-w-3xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[32px] bg-teal-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-teal-100"
          >
            <div className="text-white scale-75 sm:scale-100">
              {config.icon}
            </div>
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            {config.title}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-light text-base sm:text-xl"
          >
            {config.subtitle}
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSignUp}
          className="bg-slate-50 p-6 sm:p-8 md:p-12 rounded-[30px] sm:rounded-[50px] border border-slate-100 space-y-6 sm:space-y-8 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                  placeholder="Usman Hameed"
                />
              </div>
            </div>

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
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">{config.field1Label}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {config.field1Icon}
                </div>
                <input
                  type="text"
                  required
                  value={extraField1}
                  onChange={(e) => setExtraField1(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                  placeholder={config.field1Placeholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">{config.field2Label}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {config.field2Icon}
                </div>
                <input
                  type="text"
                  required
                  value={extraField2}
                  onChange={(e) => setExtraField2(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                  placeholder={config.field2Placeholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Password</label>
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:border-teal-500 transition-colors text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-teal-500 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-3 group disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="flex justify-center w-full min-h-[44px] my-2">
                <div id="googleSignUpRealButton" className="w-full [&>div]:!w-full [&>div]:!max-w-full"></div>
                {!googleClientId && (
                  <div className="w-full text-xs text-slate-400 font-bold bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                    ⚠️ Google Auth not configured.
                  </div>
                )}
              </div>
        </motion.form>

        {/* Footer */}
        <p className="text-center text-slate-500 font-light">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign In Instead</Link>
        </p>
      </div>
    </div>
  );
}
