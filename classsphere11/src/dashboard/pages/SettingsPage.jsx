import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Shield, Eye, Globe, Save, Loader2, CheckCircle2, Upload, Lock, Moon, Languages } from 'lucide-react';
import { cn } from '../utils';
import { dashboardService } from '../services/dashboardService';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ username: '', email: '', bio: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, digest: false });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: 30 });
  const fileInputRef = useRef(null);
  
  // Use global theme and settings from context
  const { 
    theme, 
    changeTheme, 
    language, 
    changeLanguage, 
    fontSize, 
    changeFontSize, 
    accentColor, 
    changeAccentColor,
    t
  } = useTheme();

  useEffect(() => {
    fetchProfile();
    const savedNotifications = localStorage.getItem('appNotifications') ? JSON.parse(localStorage.getItem('appNotifications')) : { email: true, push: true, digest: false };
    const savedSecurity = localStorage.getItem('appSecurity') ? JSON.parse(localStorage.getItem('appSecurity')) : { twoFactor: false, sessionTimeout: 30 };
    
    setNotifications(savedNotifications);
    setSecurity(savedSecurity);
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await dashboardService.getProfile();
      setProfile({
        username: data.username || '',
        email: data.email || '',
        bio: data.bio || '',
        profilePicture: data.profilePicture || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updatedProfile = await dashboardService.updateProfile({
        username: profile.username,
        bio: profile.bio,
        profilePicture: profile.profilePicture
      });

      // Update stored user in localStorage
      const storedUser = localStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : {};
      const newUserObj = { ...userObj, username: updatedProfile.username, bio: updatedProfile.bio, profilePicture: updatedProfile.profilePicture };
      localStorage.setItem('user', JSON.stringify(newUserObj));

      // Dispatch event to update other components in real-time
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: newUserObj }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({ ...profile, profilePicture: event.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('appNotifications', JSON.stringify(updated));
  };

  const handleSecurityToggle = (key) => {
    const updated = { ...security, [key]: !security[key] };
    setSecurity(updated);
    localStorage.setItem('appSecurity', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600/30" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 mb-10">
        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-slate-200">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('settings')}</h2>
          <p className="text-slate-500 font-medium text-lg">{t('configureSphere')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: t('profile'), icon: User },
            { id: 'notifications', label: t('notifications'), icon: Bell },
            { id: 'security', label: t('security'), icon: Shield },
            { id: 'appearance', label: t('appearance'), icon: Eye },
            { id: 'language', label: t('language'), icon: Globe },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all",
                activeTab === item.id ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "text-slate-500 hover:bg-white hover:text-slate-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900">{t('publicProfile')}</h3>
              
              <div className="flex items-center gap-8 pb-8 border-b border-slate-50">
                <div 
                  onClick={handleProfilePictureClick}
                  className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 relative group cursor-pointer overflow-hidden border-2 border-slate-50"
                >
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                      <Upload className="w-3 h-3" /> {t('change')}
                    </p>
                  </div>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{t('profilePicture')}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{t('pngJpgMax')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('username')}</label>
                  <input 
                    type="text" 
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl py-4 px-6 font-bold outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('emailAddress')}</label>
                  <input 
                    type="email" disabled
                    value={profile.email}
                    className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-4 px-6 font-bold outline-none cursor-not-allowed text-slate-400" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('bio')}</label>
                  <textarea 
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl py-4 px-6 font-bold outline-none transition-all min-h-[120px]" 
                    placeholder={t('bioPlaceholder')} 
                  />
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-4">
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> {t('profileUpdated')}
                  </div>
                )}
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-10 py-4 bg-teal-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {t('saveChanges')}</>}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900">{t('notificationPreferences')}</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: t('emailNotifications'), desc: t('receiveClassUpdates') },
                  { key: 'push', label: t('pushNotifications'), desc: t('browserNotifications') },
                  { key: 'digest', label: t('dailyDigest'), desc: t('summaryDaily') }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.label}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications[item.key]}
                        onChange={() => handleNotificationToggle(item.key)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900">{t('securitySettings')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><Lock className="w-4 h-4" /> {t('twoFactor')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('addExtraSecurity')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={security.twoFactor}
                      onChange={() => handleSecurityToggle('twoFactor')}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('sessionTimeout')}</label>
                  <input 
                    type="number" 
                    min="5"
                    value={security.sessionTimeout}
                    onChange={(e) => {
                      const updated = { ...security, sessionTimeout: parseInt(e.target.value) };
                      setSecurity(updated);
                      localStorage.setItem('appSecurity', JSON.stringify(updated));
                    }}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl py-4 px-6 font-bold outline-none transition-all" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900">{t('appearance')}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Moon className="w-4 h-4" /> {t('theme')}</label>
                  <div className="flex gap-3">
                    {['light', 'dark', 'auto'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => changeTheme(themeOption)}
                        className={cn(
                          'flex-1 py-3 rounded-2xl font-bold text-sm transition-all capitalize',
                          theme === themeOption 
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                      >
                        {t(themeOption)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fontSize')}</label>
                  <div className="flex gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => changeFontSize(size)}
                        className={cn(
                          'flex-1 py-3 rounded-2xl font-bold text-sm transition-all capitalize',
                          fontSize === size 
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                      >
                        {t(size)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('accentColor') || 'Accent Color'}</label>
                  <div className="flex gap-3 flex-wrap">
                    {['teal', 'indigo', 'rose', 'emerald', 'violet'].map((color) => (
                      <button
                        key={color}
                        onClick={() => changeAccentColor(color)}
                        className={cn(
                          'px-6 py-3 rounded-2xl font-bold text-sm transition-all capitalize flex items-center gap-2',
                          accentColor === color 
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          "w-3 h-3 rounded-full border border-black/10",
                          color === 'teal' ? "bg-teal-500" :
                          color === 'indigo' ? "bg-indigo-500" :
                          color === 'rose' ? "bg-rose-500" :
                          color === 'emerald' ? "bg-emerald-500" :
                          "bg-violet-500"
                        )} />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900">{t('languageSettings')}</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Languages className="w-4 h-4" /> {t('preferredLanguage')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['English', 'Spanish', 'French', 'German', 'Chinese'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={cn(
                        'py-3 rounded-2xl font-bold text-sm transition-all',
                        language === lang 
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
