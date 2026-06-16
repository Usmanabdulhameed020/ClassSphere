import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, School, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    { 
      id: 'student', 
      title: 'Student', 
      icon: <GraduationCap className="w-12 h-12" />, 
      desc: 'Join classes, submit assignments, and track your progress.',
      color: 'bg-teal-50 text-teal-600 border-teal-100'
    },
    { 
      id: 'teacher', 
      title: 'Teacher', 
      icon: <School className="w-12 h-12" />, 
      desc: 'Create courses, manage students, and deliver engaging lessons.',
      color: 'bg-teal-50 text-teal-600 border-teal-100'
    },
    { 
      id: 'admin', 
      title: 'Admin', 
      icon: <ShieldCheck className="w-12 h-12" />, 
      desc: 'Oversee institutional operations and manage system settings.',
      color: 'bg-teal-50 text-teal-600 border-teal-100'
    },
  ];

  const handleRoleSelect = async (roleId) => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (token && user && (user.role === 'pending' || !user.role)) {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/select-role', { role: roleId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to set role:', err);
        alert('Failed to update your role. Please try again.');
      }
    } else {
      navigate(`/signup?role=${roleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black text-slate-900 tracking-tight"
          >
            Join ClassSphere.
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-light text-xl max-w-2xl mx-auto"
          >
            Select your role to get started with a tailored experience designed for your needs.
          </motion.p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleRoleSelect(role.id)}
              className="group bg-slate-50 p-8 rounded-[40px] border border-slate-100 text-left hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              <div className={`w-20 h-20 rounded-3xl ${role.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {role.icon}
              </div>
              <div className="space-y-4 flex-grow">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{role.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {role.desc}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-teal-600 font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-sm">
                Get Started <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-500 font-light"
        >
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-teal-600 font-bold hover:underline">Sign In Instead</button>
        </motion.p>
      </div>
    </div>
  );
}
