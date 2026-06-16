import React, { useState, useEffect } from 'react';
import { Layers, File, Video, Music, Image, Download, MoreVertical, Search, Filter, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { dashboardService } from '../services/dashboardService';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await dashboardService.getMyMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.classId?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-teal-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-teal-100">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resource Library</h2>
                <p className="text-slate-500 font-medium text-lg">Central hub for all your sphere materials</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search resources..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent pl-10 pr-4 py-2 text-sm font-bold outline-none w-64" 
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-teal-600/30" />
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="bg-white p-20 rounded-[2rem] border border-dashed border-slate-200 text-center">
               <p className="text-slate-400 font-medium italic">No resources found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredMaterials.map((file) => (
                <div key={file._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-2xl bg-slate-50 text-teal-600")}>
                      <File className="w-6 h-6" />
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><MoreVertical className="w-4 h-4 text-slate-300" /></button>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">{file.title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{file.classId?.name}</p>
                    <div className="flex items-center gap-3 mt-4 text-xs font-bold text-slate-400">
                      <span>Shared on {new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.url || '#';
                      link.download = file.title || 'download';
                      link.click();
                    }}
                  >
                    <Download className="w-3.5 h-3.5" /> Open Resource
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-[10px] text-teal-400">Library Summary</h3>
            <div className="space-y-6">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Files</p>
                  <p className="text-3xl font-black">{materials.length}</p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Disk Usage</p>
                  <p className="text-3xl font-black">--</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 italic">Storage calculation optimized</p>
               </div>
               <div className="pt-4">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Resources are shared securely across your academic spheres. Content generation and AI summaries are available in the Classroom view.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
