import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Users, 
  Layers,
  Calendar,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClassManagement({ onSelectClass }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await adminService.getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class? This will remove access for all teachers and students.')) return;
    try {
      await adminService.deleteClass(id);
      setClasses(classes.filter(c => c._id !== id));
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Spheres</h1>
          <p className="text-slate-500 mt-2 font-medium">Audit and manage all active educational spaces.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by class name, subject, or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-teal-600/30 mx-auto" />
            </div>
          ) : filteredClasses.map((cls) => (
            <motion.div 
              key={cls._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSelectClass && onSelectClass(cls)}
              className="group bg-slate-50 rounded-[2rem] p-6 border border-slate-100 hover:border-teal-200 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-teal-100/20 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl ${cls.color || 'bg-teal-600'} shadow-lg shadow-teal-100/50 flex items-center justify-center text-white`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectClass && onSelectClass(cls); }}
                    className="p-2 bg-white rounded-xl text-slate-400 hover:text-teal-600 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls._id); }}
                    className="p-2 bg-white rounded-xl text-slate-400 hover:text-rose-500 shadow-sm transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">{cls.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{cls.subject || 'General'} • {cls.section || 'No Section'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-black text-slate-600">{cls.students?.length || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-black text-teal-600 uppercase tracking-widest">{cls.code}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                   {cls.teachers?.[0]?.profilePicture ? <img src={cls.teachers[0].profilePicture} alt="" /> : null}
                </div>
                <span className="text-[10px] font-bold text-slate-400">Teacher: <span className="text-slate-900">{cls.teachers?.[0]?.username || 'Unassigned'}</span></span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClasses.length === 0 && !loading && (
          <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-medium italic">No spheres found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
