import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import ClassCard from '../components/ClassCard';
import { Loader2, PlusCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function OverviewPage({ classes: propClasses, onSelectClass }) {
  const [classes, setClasses] = useState(propClasses || []);
  const [isLoading, setIsLoading] = useState(!propClasses);
  const { t } = useTheme();

  useEffect(() => {
    if (propClasses) return;
    
    const fetchClasses = async () => {
      try {
        const data = await dashboardService.getClasses();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, [propClasses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-40">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600/30" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 text-center px-4">
        <div className="w-32 h-32 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-16 h-16 text-teal-200" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('classroomQuiet')}</h2>
        <p className="text-slate-500 mt-2 max-w-sm font-medium">
          {t('classroomQuietDesc')}
        </p>
      </div>
    );
  }

  const handleClassRemoved = (classId) => {
    setClasses(prev => prev.filter(c => c._id !== classId));
  };

  return (
    <div className="pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {classes.map((cls) => (
          <ClassCard 
            key={cls._id} 
            cls={{
              ...cls,
              id: cls._id
            }} 
            onSelectClass={onSelectClass}
            onClassRemoved={handleClassRemoved}
          />
        ))}
      </div>
    </div>
  );
}
