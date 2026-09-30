import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-foreground">
                Waste<span className="text-primary">Sphere</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering citizens and municipal officers with AI-driven waste reporting, live status tracking, and environmental civic recognition.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Core Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/report" className="hover:text-primary transition-colors">AI Waste Reporting (Public)</Link></li>
              <li><Link to="/complaints" className="hover:text-primary transition-colors">Complaint Lifecycle Tracking</Link></li>
              <li><Link to="/pickup" className="hover:text-primary transition-colors">Doorstep Waste Pickup</Link></li>
              <li><Link to="/awareness" className="hover:text-primary transition-colors">Waste Segregation & Quiz</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Recognition & Badges</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/badges" className="hover:text-primary transition-colors">Bronze (3–4 Reports)</Link></li>
              <li><Link to="/badges" className="hover:text-primary transition-colors">Silver (5–9 Reports)</Link></li>
              <li><Link to="/badges" className="hover:text-primary transition-colors">Gold (10+ Reports)</Link></li>
              <li><Link to="/certificate" className="hover:text-primary transition-colors">Official Admin Certificate</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Civic Help & Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Helpline: 1800-WASTE-SPHERE</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@wastesphere.gov.in</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Department of Municipal Affairs</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 WasteSphere Civic Technology Platform. Clean Green Smart Governance.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> Verified Officer System</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-primary" /> AI-Assisted Recognition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
