import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-emerald-500/15 bg-[#030d09] text-slate-400 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Waste<span className="text-emerald-400">Sphere</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens and municipal officers with AI-driven waste reporting, live status tracking, and environmental civic recognition.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/report" className="hover:text-emerald-400 transition-colors">AI Waste Reporting</Link></li>
              <li><Link to="/complaints" className="hover:text-emerald-400 transition-colors">Complaint Lifecycle Tracking</Link></li>
              <li><Link to="/pickup" className="hover:text-emerald-400 transition-colors">Doorstep Waste Pickup</Link></li>
              <li><Link to="/awareness" className="hover:text-emerald-400 transition-colors">Waste Segregation Guide</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recognition & Badges</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/badges" className="hover:text-emerald-400 transition-colors">Bronze (3–4 Reports)</Link></li>
              <li><Link to="/badges" className="hover:text-emerald-400 transition-colors">Silver (5–9 Reports)</Link></li>
              <li><Link to="/badges" className="hover:text-emerald-400 transition-colors">Gold (10+ Reports)</Link></li>
              <li><Link to="/certificate" className="hover:text-emerald-400 transition-colors">Official Admin Certificate</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Civic Help & Support</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> Helpline: 1800-WASTE-SPHERE</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> support@wastesphere.gov.in</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> Department of Municipal Affairs</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-500/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 WasteSphere Civic Technology Platform. Built for Hackathon Excellence.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Verified Admin System</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-emerald-400" /> AI-Assisted Recognition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
