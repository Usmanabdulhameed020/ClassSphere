import React from 'react';
import { Link } from 'react-router-dom';

export default function GlobalFooter() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 px-5 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="ClassSphere Logo" className="w-10 h-7 object-contain" />
              <span className="font-bold text-[#1f1f1f] text-sm tracking-tight">ClassSphere</span>
            </div>
            <p className="text-xs text-[#5f6368] max-w-xs leading-relaxed">
              The modern, privacy-focused engine replacing legacy learning ecosystems globally.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f1f1f]">Product</h4>
            <ul className="space-y-2 text-xs text-[#5f6368]">
              <li><Link to="/insights" className="hover:text-[#008080] transition-colors">Insights Engine</Link></li>
              <li><Link to="/portals" className="hover:text-[#008080] transition-colors">Portals</Link></li>
              <li><Link to="/security" className="hover:text-[#008080] transition-colors">Security Architecture</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f1f1f]">Security</h4>
            <ul className="space-y-2 text-xs text-[#5f6368]">
              <li><Link to="/compliance" className="hover:text-[#008080] transition-colors">FERPA / COPPA</Link></li>
              <li><Link to="/privacy" className="hover:text-[#008080] transition-colors">Data Privacy</Link></li>
              <li><Link to="/encryption" className="hover:text-[#008080] transition-colors">Encryption Protocols</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f1f1f]">Enterprise</h4>
            <ul className="space-y-2 text-xs text-[#5f6368]">
              <li><Link to="/pilot" className="hover:text-[#008080] transition-colors">Pilot Programs</Link></li>
              <li><Link to="/sales" className="hover:text-[#008080] transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
        </div>

        {/* System Credits Bottom Line */}
        <div className="pt-8 border-t border-[#dadce0] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#5f6368]">
          <span>&copy; {new Date().getFullYear()} ClassSphere Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-[#008080] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#008080] transition-colors">T&C</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}