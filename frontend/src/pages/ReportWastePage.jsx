import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Navigation
} from 'lucide-react';

export const ReportWastePage = () => {
  const { user } = useAuth();
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
  const [wasteType, setWasteType] = useState('');
  const [issueType, setIssueType] = useState('Overflowing Garbage Bin');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);

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
      setAiProvider(result.aiProvider || 'Groq API');

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
          setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Sector 4, Central District)`);
          showToast('GPS coordinates acquired successfully!', 'info', 'Location Detected');
        },
        () => {
          setLocation('Park Street Axis, Sector 4, New Delhi');
          showToast('Using reference municipal district location.', 'info');
        }
      );
    } else {
      setLocation('Park Street Axis, Sector 4, New Delhi');
    }
  };

  // STEP 9: Final submission
  const handleSubmitReport = async () => {
    if (!wasteType || !issueType || !location) {
      showToast('Please complete all required report fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createComplaint({
        wasteType,
        aiSuggestedWasteType: aiSuggestedCategory,
        issueType,
        description,
        location,
        landmark,
        severity,
        photoUrl: imagePreview
      });

      showToast(
        `Report ${res.complaint.id} created! SMS confirmation sent to ${user?.phone || 'registered phone'}.`,
        'sms',
        'SMS Confirmation Sent 📱'
      );
      setStage(5);
    } catch (err) {
      showToast('Failed to submit report. Please check input data.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI-Assisted Citizen Complaint Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Report Waste Issue</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          AI detects waste type from your photo. You retain full authority to review, edit, and supply location details before final submission.
        </p>
      </div>

      {/* Process Stepper */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-3 glass-panel rounded-2xl border border-emerald-500/20 text-xs font-semibold">
        <div className={`flex items-center gap-1.5 ${stage >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
          <Camera className="w-4 h-4" /> 1. Upload
        </div>
        <span className="text-slate-600">→</span>
        <div className={`flex items-center gap-1.5 ${stage >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
          <Cpu className="w-4 h-4" /> 2. AI Recognition
        </div>
        <span className="text-slate-600">→</span>
        <div className={`flex items-center gap-1.5 ${stage >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
          <Edit3 className="w-4 h-4" /> 3. Review & Edit
        </div>
        <span className="text-slate-600">→</span>
        <div className={`flex items-center gap-1.5 ${stage >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
          <CheckCircle2 className="w-4 h-4" /> 4. Submit
        </div>
      </div>

      {/* STAGE 1: Upload Photo */}
      {stage === 1 && (
        <BorderGlowCard className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" /> Step 1: Upload Photographic Evidence
          </h2>

          <div className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 bg-emerald-950/20 hover:border-emerald-500/50 transition-colors">
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Waste Evidence Preview"
                  className="max-h-64 mx-auto rounded-xl shadow-lg border border-emerald-500/30 object-cover"
                />
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setImagePreview('')}
                    className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={triggerAiRecognition}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    Analyze with AI <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Drag & drop photo here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
                </div>
                <label className="inline-block px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md">
                  Browse Device Photos
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Preset Demo Samples */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or pick a sample hackathon evidence photo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImageSelect(img.url)}
                  className={`p-2 rounded-xl glass-card text-left transition-all border ${
                    imagePreview === img.url
                      ? 'border-emerald-400 bg-emerald-500/20'
                      : 'border-emerald-500/10 hover:border-emerald-500/30'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-20 object-cover rounded-lg mb-1.5" />
                  <span className="text-[11px] font-semibold text-slate-200 line-clamp-1">{img.label}</span>
                </button>
              ))}
            </div>
          </div>
        </BorderGlowCard>
      )}

      {/* STAGE 2: AI Processing State */}
      {stage === 2 && (
        <BorderGlowCard className="p-12 text-center space-y-6">
          <LoadingSpinner label="AI Computer Vision Engine is analyzing waste patterns..." size="lg" />
          <div className="max-w-md mx-auto space-y-2">
            <p className="text-sm text-emerald-300 font-semibold">Running Groq API Primary Vision Model...</p>
            <p className="text-xs text-slate-400">
              Detecting category features (Polyethylene, Organic Pulp, Printed Circuit Boards, Glass).
            </p>
          </div>
        </BorderGlowCard>
      )}

      {/* STAGE 3: Review AI Output & Fill Form */}
      {(stage === 3 || stage === 4) && (
        <div className="space-y-6">
          {/* AI Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-2">
                <span>AI Suggested Category: {aiSuggestedCategory}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-800/60 text-[10px] text-emerald-200 font-mono">
                  {(aiConfidence * 100).toFixed(0)}% Confidence ({aiProvider})
                </span>
              </div>
              <p className="text-slate-300 leading-normal">
                <strong>User Review Required:</strong> AI is not the final authority. You can edit the waste type and provide exact location details below.
              </p>
            </div>
          </div>

          <BorderGlowCard className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-400" /> Step 3: Confirm & Complete Complaint Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Preview Thumbnail */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Uploaded Evidence Photo
                </label>
                <img
                  src={imagePreview}
                  alt="Report evidence"
                  className="w-full h-48 object-cover rounded-xl border border-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-upload Image
                </button>
              </div>

              {/* Waste Type Category */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Waste Category (AI Suggested & User Confirmed) *
                  </label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
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
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
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
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
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
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-emerald-950/30 border-emerald-500/20 text-slate-400'
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
            <div className="space-y-4 pt-4 border-t border-emerald-500/20">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Location & Address Reference *
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/30"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Detect Current Location
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="12-B Park Street, Sector 4, New Delhi"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Opposite City Metro Gate 3"
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Issue Description / Extra Details
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Bin overflowing onto sidewalk since yesterday morning..."
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={() => setStage(1)}
                className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-sm font-semibold"
              >
                Back to Image Selection
              </button>

              <button
                type="button"
                onClick={() => setStage(4)}
                className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                Review Complete Summary <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </BorderGlowCard>
        </div>
      )}

      {/* STAGE 4: Final Summary Review Modal / View */}
      {stage === 4 && (
        <BorderGlowCard className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Step 4: Explicit User Review & Submission
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block">Confirmed Waste Category:</span>
                <span className="font-bold text-emerald-300 text-base">{wasteType}</span>
                <span className="text-[11px] text-slate-400 block">AI Suggested: {aiSuggestedCategory}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Issue Category:</span>
                <span className="font-semibold text-white">{issueType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Severity Level:</span>
                <span className="font-semibold text-amber-300">{severity}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block">Report Location:</span>
                <span className="font-semibold text-white">{location || 'Sector 4, New Delhi'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Landmark:</span>
                <span className="text-slate-200">{landmark || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">SMS Notification Destination:</span>
                <span className="font-mono text-emerald-300">{user?.phone || '+91 9876543210'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStage(3)}
              className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-sm font-semibold"
            >
              Edit Form Fields
            </button>
            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2"
            >
              {submitting ? 'Submitting Report...' : 'Confirm & Submit Waste Report'}
            </button>
          </div>
        </BorderGlowCard>
      )}

      {/* STAGE 5: Success Confirmation */}
      {stage === 5 && (
        <BorderGlowCard className="p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Waste Report Submitted!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your report has been queued for municipal review. An SMS confirmation was dispatched to <span className="text-emerald-300 font-mono">{user?.phone}</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/complaints')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg"
            >
              Track Complaint Status
            </button>
            <button
              onClick={() => {
                setStage(1);
                setImagePreview('');
              }}
              className="px-6 py-3 rounded-xl glass-panel text-slate-300 hover:text-white text-sm font-semibold"
            >
              Report Another Problem
            </button>
          </div>
        </BorderGlowCard>
      )}
    </div>
  );
};
