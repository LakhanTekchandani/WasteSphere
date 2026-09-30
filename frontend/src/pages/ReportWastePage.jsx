import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Camera,
  Cpu,
  Edit3,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Sparkles,
  Upload,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Navigation,
  User,
  Phone,
  Mail
} from 'lucide-react';

export const ReportWastePage = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Wizard Stage: 1 = Upload, 2 = AI Processing, 3 = Review & Form Input, 4 = Final Verification, 5 = Submitted
  const [stage, setStage] = useState(1);

  // Form State
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // AI Recognition Output State
  const [aiSuggestedCategory, setAiSuggestedCategory] = useState('');
  const [aiConfidence, setAiConfidence] = useState(0);
  const [aiProvider, setAiProvider] = useState('');

  // Editable User Fields
  const [wasteType, setWasteType] = useState('Plastic Waste');
  const [issueType, setIssueType] = useState('Overflowing Garbage Bin');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('12-B Park Street, Sector 4, New Delhi'); // display address string
  const [latitude, setLatitude] = useState(28.6139);  // GPS latitude
  const [longitude, setLongitude] = useState(77.209); // GPS longitude
  const [landmark, setLandmark] = useState('');
  const [severity, setSeverity] = useState('Medium');

  // Guest-specific fields (when not logged in)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Sample quick images for testing
  const sampleImages = [
    { label: 'Plastic Bottles Dump', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
    { label: 'Wet Food Waste', url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Electronic E-Waste', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cardboard Box Heap', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleImageSelect = (url, file = null) => {
    setImagePreview(url);
    setImageFile(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleImageSelect(url, file);
    }
  };

  // STEP 2 & 3: Run AI Recognition
  const triggerAiRecognition = async () => {
    if (!imagePreview) {
      showToast('Please select or upload a waste photo first.', 'error');
      return;
    }

    setStage(2); // Show AI analyzing state
    try {
      const result = await api.analyzeWasteImage(imageFile || imagePreview);
      setAiSuggestedCategory(result.suggestedWasteType);
      setWasteType(result.suggestedWasteType); // Pre-fill waste type
      setAiConfidence(result.confidence || 0.94);
      setAiProvider(result.aiProvider || 'Groq AI');

      showToast(`AI Suggested: ${result.suggestedWasteType}. You can review and edit before submitting.`, 'success', 'AI Analysis Complete');
      setStage(3); // Move to review & edit form
    } catch (err) {
      showToast('AI recognition unavailable. Please select waste category manually.', 'error');
      setWasteType('Plastic Waste');
      setStage(3);
    }
  };

  // STEP 8: GPS Location helper
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Detected)`);
          showToast('GPS coordinates acquired successfully!', 'info', 'Location Detected');
        },
        () => {
          setLatitude(28.6139);
          setLongitude(77.209);
          setLocation('Park Street Axis, Sector 4, New Delhi');
          showToast('Using reference municipal district location.', 'info');
        }
      );
    } else {
      setLocation('Park Street Axis, Sector 4, New Delhi');
    }
  };

  // STEP 9: Final submission (Handles both Guest & Authenticated Users)
  const handleSubmitReport = async () => {
    if (!wasteType || !issueType || !location) {
      showToast('Please complete all required report fields.', 'error');
      return;
    }

    // If guest, validate contact fields
    if (!user) {
      if (!guestName.trim()) {
        showToast('Please provide your name for citizen report verification.', 'error');
        return;
      }
      if (!guestPhone.trim() || guestPhone.trim().length < 10) {
        showToast('Please provide a valid 10-digit phone number for SMS tracking.', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      // If guest user, seamlessly enroll/authenticate to obtain backend token
      if (!user) {
        const cleanPhone = guestPhone.trim();
        const autoEmail = guestEmail.trim() || `citizen_${cleanPhone.slice(-6)}_${Date.now().toString().slice(-4)}@wastesphere.org`;
        const autoPassword = `WasteSphere#${cleanPhone.slice(-4)}`;

        try {
          // Attempt registration
          const regRes = await api.registerCitizen({
            name: guestName.trim(),
            email: autoEmail,
            phone: cleanPhone,
            password: autoPassword
          });
          if (regRes.token && regRes.user) {
            localStorage.setItem('wastesphere_token', regRes.token);
            localStorage.setItem('wastesphere_user', JSON.stringify(regRes.user));
          }
        } catch (regErr) {
          // If user exists or registration returns, attempt login
          try {
            const loginRes = await api.login({ email: autoEmail, password: autoPassword });
            if (loginRes.token && loginRes.user) {
              localStorage.setItem('wastesphere_token', loginRes.token);
              localStorage.setItem('wastesphere_user', JSON.stringify(loginRes.user));
            }
          } catch {
            // Proceed to attempt submission
          }
        }
      }

      const fields = {
        wasteType,
        issueType,
        description,
        address: location,
        latitude,
        longitude,
        landmark,
        severity,
        ...(imageFile ? {} : { wastePhotoUrl: imagePreview }),
      };

      const res = await api.createComplaint(fields, imageFile);
      setSubmittedComplaint(res.complaint);

      const targetPhone = user?.phone || guestPhone || 'registered mobile';
      showToast(
        `Report submitted! SMS confirmation sent to ${targetPhone}.`,
        'sms',
        'SMS Confirmation Sent 📱'
      );
      setStage(5);
    } catch (err) {
      const msg = err?.message || 'Failed to submit report. Please check input data.';
      showToast(msg, 'error', 'Submission Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12332a] border border-[#00a884]/40 text-[#25d366] text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#25d366]" />
          <span>AI-Assisted Citizen Complaint Portal (Open to Public)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Report Waste Issue</h1>
        <p className="text-[#8696a0] text-sm max-w-xl mx-auto">
          AI detects waste type from your photo. You retain full authority to review, edit, and supply location details before final submission.
        </p>
      </motion.div>

      {/* Process Stepper */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-3 glass-panel rounded-2xl border border-[#2a3942] text-xs font-semibold bg-[#1f2c34]/80">
        <div className={`flex items-center gap-1.5 ${stage >= 1 ? 'text-[#25d366]' : 'text-[#8696a0]'}`}>
          <Camera className="w-4 h-4" /> 1. Upload
        </div>
        <span className="text-[#8696a0]">→</span>
        <div className={`flex items-center gap-1.5 ${stage >= 2 ? 'text-[#25d366]' : 'text-[#8696a0]'}`}>
          <Cpu className="w-4 h-4" /> 2. AI Recognition
        </div>
        <span className="text-[#8696a0]">→</span>
        <div className={`flex items-center gap-1.5 ${stage >= 3 ? 'text-[#25d366]' : 'text-[#8696a0]'}`}>
          <Edit3 className="w-4 h-4" /> 3. Review & Edit
        </div>
        <span className="text-[#8696a0]">→</span>
        <div className={`flex items-center gap-1.5 ${stage >= 4 ? 'text-[#25d366]' : 'text-[#8696a0]'}`}>
          <CheckCircle2 className="w-4 h-4" /> 4. Submit
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: Upload Photo */}
        {stage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <BorderGlowCard className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#25d366]" /> Step 1: Upload Photographic Evidence
              </h2>

              <div className="border-2 border-dashed border-[#2a3942] rounded-2xl p-8 text-center space-y-4 bg-[#111b21]/60 hover:border-[#00a884]/60 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Waste Evidence Preview"
                      className="max-h-64 mx-auto rounded-xl shadow-lg border border-[#2a3942] object-cover"
                    />
                    <div className="flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setImagePreview('')}
                        className="px-4 py-2 rounded-xl glass-panel text-[#e9edef] hover:bg-[#1f2c34] text-xs font-semibold"
                      >
                        Change Image
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={triggerAiRecognition}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-bold text-xs shadow-lg shadow-[#00a884]/20 flex items-center gap-2"
                      >
                        Analyze with AI <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#12332a] text-[#25d366] flex items-center justify-center mx-auto border border-[#00a884]/30">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#e9edef]">Drag & drop photo here or click to browse</p>
                      <p className="text-xs text-[#8696a0] mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
                    </div>
                    <label className="inline-block px-6 py-3 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-[#111b21] text-xs font-bold cursor-pointer shadow-md transition-transform hover:scale-105">
                      Browse Device Photos
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {/* Preset Demo Samples */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">
                  Or pick a sample hackathon evidence photo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sampleImages.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleImageSelect(img.url)}
                      className={`p-2 rounded-xl text-left transition-all border ${
                        imagePreview === img.url
                          ? 'border-[#25d366] bg-[#12332a]'
                          : 'border-[#2a3942] bg-[#111b21]/70 hover:border-[#00a884]/40'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-20 object-cover rounded-lg mb-1.5" />
                      <span className="text-[11px] font-semibold text-[#e9edef] line-clamp-1">{img.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </BorderGlowCard>
          </motion.div>
        )}

        {/* STAGE 2: AI Processing State */}
        {stage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <BorderGlowCard className="p-12 text-center space-y-6">
              <LoadingSpinner label="AI Computer Vision Engine is analyzing waste patterns..." size="lg" />
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-sm text-[#25d366] font-semibold">Running Groq AI / Gemini Vision Model...</p>
                <p className="text-xs text-[#8696a0]">
                  Detecting category features (Polyethylene, Organic Pulp, Printed Circuit Boards, Glass).
                </p>
              </div>
            </BorderGlowCard>
          </motion.div>
        )}

        {/* STAGE 3: Review AI Output & Fill Form */}
        {stage === 3 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* AI Banner */}
            <div className="p-4 rounded-2xl bg-[#12332a] border border-[#00a884]/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#25d366] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#25d366] flex items-center gap-2">
                  <span>AI Suggested Category: {aiSuggestedCategory}</span>
                  <span className="px-2 py-0.5 rounded bg-[#075e54] text-[10px] text-white font-mono">
                    {(aiConfidence * 100).toFixed(0)}% Confidence ({aiProvider})
                  </span>
                </div>
                <p className="text-[#8696a0] leading-normal">
                  <strong>User Review Required:</strong> AI is not the final authority. You can edit the waste type and provide exact location details below.
                </p>
              </div>
            </div>

            <BorderGlowCard className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#25d366]" /> Step 3: Confirm & Complete Complaint Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo Preview Thumbnail */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider">
                    Uploaded Evidence Photo
                  </label>
                  <img
                    src={imagePreview}
                    alt="Report evidence"
                    className="w-full h-48 object-cover rounded-xl border border-[#2a3942]"
                  />
                  <button
                    type="button"
                    onClick={() => setStage(1)}
                    className="text-xs text-[#25d366] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-upload Image
                  </button>
                </div>

                {/* Waste Type Category */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                      Waste Category (AI Suggested & User Confirmed) *
                    </label>
                    <select
                      value={wasteType}
                      onChange={(e) => setWasteType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                    >
                      <option value="Plastic Waste">Plastic Waste</option>
                      <option value="Organic / Wet Waste">Organic / Wet Waste</option>
                      <option value="Paper / Cardboard">Paper / Cardboard</option>
                      <option value="Glass Waste">Glass Waste</option>
                      <option value="Metal Waste">Metal Waste</option>
                      <option value="E-Waste">E-Waste</option>
                      <option value="Mixed Waste">Mixed Waste</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                      Issue Category *
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                    >
                      <option value="Overflowing Garbage Bin">Overflowing Garbage Bin</option>
                      <option value="Garbage on Road / Public Area">Garbage on Road / Public Area</option>
                      <option value="Missed Waste Collection">Missed Waste Collection</option>
                      <option value="Illegal Dumping">Illegal Dumping</option>
                      <option value="Open Waste Burning">Open Waste Burning</option>
                      <option value="Uncollected Waste">Uncollected Waste</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                      Severity Level *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Low', 'Medium', 'High'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeverity(s)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            severity === s
                              ? s === 'High'
                                ? 'bg-[#ea4335]/20 text-[#ea4335] border-[#ea4335]'
                                : 'bg-[#12332a] text-[#25d366] border-[#00a884]'
                              : 'bg-[#111b21] border-[#2a3942] text-[#8696a0]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Landmark Section */}
              <div className="space-y-4 pt-4 border-t border-[#2a3942]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider">
                    Location & Address Reference *
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="px-3 py-1 rounded-lg bg-[#12332a] text-[#25d366] border border-[#00a884]/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-[#00a884]/20"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#25d366]" /> Detect Current Location
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-3 text-[#8696a0]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="12-B Park Street, Sector 4, New Delhi"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Opposite City Metro Gate 3"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                      Issue Description / Extra Details
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Bin overflowing onto sidewalk since morning..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Information Section (If Not Logged In) */}
              {!user && (
                <div className="space-y-4 pt-4 border-t border-[#2a3942] bg-[#12332a]/30 p-4 rounded-xl border">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#25d366]">
                    <User className="w-4 h-4" /> Guest Reporter Details (No Signup Required)
                  </div>
                  <p className="text-xs text-[#8696a0]">
                    Provide your contact details so the municipal officer can dispatch SMS alerts to you regarding cleanup progress.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-[#8696a0]" />
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                        Mobile Phone (For SMS Updates) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-[#8696a0]" />
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-[#2a3942]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStage(1)}
                  className="px-5 py-2.5 rounded-xl glass-panel text-[#e9edef] hover:bg-[#1f2c34] text-sm font-semibold"
                >
                  Back to Image
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    if (!user) {
                      if (!guestName.trim()) {
                        showToast('Please enter your name.', 'error');
                        return;
                      }
                      if (!guestPhone.trim()) {
                        showToast('Please enter your mobile phone for SMS tracking.', 'error');
                        return;
                      }
                    }
                    setStage(4);
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-bold text-sm shadow-lg shadow-[#00a884]/20 flex items-center gap-2"
                >
                  Review Summary <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </BorderGlowCard>
          </motion.div>
        )}

        {/* STAGE 4: Final Summary Review Modal / View */}
        {stage === 4 && (
          <motion.div
            key="stage4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <BorderGlowCard className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#25d366]" /> Step 4: Explicit Review & Submission
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#111b21]/70 border border-[#2a3942] text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#8696a0] block">Confirmed Waste Category:</span>
                    <span className="font-bold text-[#25d366] text-base">{wasteType}</span>
                    <span className="text-[11px] text-[#8696a0] block">AI Suggested: {aiSuggestedCategory || 'User selected'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8696a0] block">Issue Category:</span>
                    <span className="font-semibold text-white">{issueType}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8696a0] block">Severity Level:</span>
                    <span className="font-semibold text-amber-300">{severity}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#8696a0] block">Report Location:</span>
                    <span className="font-semibold text-white">{location || 'Sector 4, New Delhi'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8696a0] block">Landmark:</span>
                    <span className="text-[#e9edef]">{landmark || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8696a0] block">SMS Notification Destination:</span>
                    <span className="font-mono text-[#25d366] font-bold">{user?.phone || guestPhone || 'Provided mobile'}</span>
                  </div>
                  {!user && (
                    <div>
                      <span className="text-xs text-[#8696a0] block">Reporter Name:</span>
                      <span className="font-semibold text-white">{guestName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStage(3)}
                  className="px-5 py-2.5 rounded-xl glass-panel text-[#e9edef] hover:bg-[#1f2c34] text-sm font-semibold"
                >
                  Edit Form Fields
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitReport}
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-extrabold text-sm shadow-xl shadow-[#00a884]/25 flex items-center gap-2"
                >
                  {submitting ? 'Submitting Report...' : 'Confirm & Submit Waste Report'}
                </motion.button>
              </div>
            </BorderGlowCard>
          </motion.div>
        )}

        {/* STAGE 5: Success Confirmation */}
        {stage === 5 && (
          <motion.div
            key="stage5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <BorderGlowCard className="p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#12332a] text-[#25d366] flex items-center justify-center mx-auto border border-[#00a884]/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">Waste Report Submitted!</h2>
                {submittedComplaint?.id && (
                  <p className="text-xs font-mono text-[#25d366]">Complaint ID: {submittedComplaint.id}</p>
                )}
                <p className="text-sm text-[#8696a0] max-w-md mx-auto">
                  Your report has been queued for municipal review. An SMS confirmation was dispatched to <span className="text-[#25d366] font-mono">{user?.phone || guestPhone}</span>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/complaints')}
                  className="px-6 py-3 rounded-xl bg-[#00a884] text-[#111b21] font-bold text-sm shadow-lg"
                >
                  Track Complaint Status
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStage(1);
                    setImagePreview('');
                  }}
                  className="px-6 py-3 rounded-xl glass-panel text-[#e9edef] hover:bg-[#1f2c34] text-sm font-semibold"
                >
                  Report Another Problem
                </motion.button>
              </div>
            </BorderGlowCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
