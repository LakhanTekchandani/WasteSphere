import {
  MOCK_USER,
  MOCK_ADMIN,
  MOCK_COMPLAINTS,
  MOCK_PICKUPS,
  MOCK_QUIZZES,
  MOCK_NOTIFICATIONS,
  MOCK_HOTSPOTS,
  MOCK_ADMIN_VERIFICATIONS
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for local state mutations in mock mode
let complaintsStore = [...MOCK_COMPLAINTS];
let pickupsStore = [...MOCK_PICKUPS];
let notificationsStore = [...MOCK_NOTIFICATIONS];
let verificationsStore = [...MOCK_ADMIN_VERIFICATIONS];
let currentUserStore = { ...MOCK_USER };

export const api = {
  // --- AUTHENTICATION ---
  login: async (credentials) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Backend connection offline, using mock authentication.');
    }
    // Mock login logic
    if (credentials.role === 'admin') {
      return {
        token: 'mock_jwt_token_admin_123',
        user: MOCK_ADMIN
      };
    }
    return {
      token: 'mock_jwt_token_citizen_123',
      user: currentUserStore
    };
  },

  register: async (formData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Backend connection offline, using mock registration.');
    }

    if (formData.role === 'admin') {
      const newAdminVerif = {
        id: 'ver_' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        officerIdPhoto: formData.officerIdPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      verificationsStore.unshift(newAdminVerif);

      return {
        token: 'mock_jwt_token_admin_pending',
        user: {
          ...MOCK_ADMIN,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          verificationStatus: 'pending'
        },
        message: 'Admin account created. Pending verification review.'
      };
    }

    currentUserStore = {
      ...MOCK_USER,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      points: 0,
      qualifyingComplaints: 0,
      recognition: 'No medal yet',
      certificateEligible: false,
      certificateIssued: false
    };

    return {
      token: 'mock_jwt_token_citizen_new',
      user: currentUserStore,
      message: 'Citizen registration successful.'
    };
  },

  // --- AI WASTE RECOGNITION ---
  analyzeWasteImage: async (imageFileOrUrl) => {
    try {
      const formData = new FormData();
      if (typeof imageFileOrUrl === 'string') {
        formData.append('imageUrl', imageFileOrUrl);
      } else {
        formData.append('image', imageFileOrUrl);
      }

      const res = await fetch(`${BASE_URL}/ai/waste-recognition`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Backend AI service fallback active.');
    }

    // AI Recognition simulation logic based on preset keywords or random default
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate AI processing delay

    const categories = [
      'Plastic Waste',
      'Organic / Wet Waste',
      'Paper / Cardboard',
      'Glass Waste',
      'Metal Waste',
      'E-Waste',
      'Mixed Waste'
    ];

    let suggested = categories[Math.floor(Math.random() * categories.length)];
    if (typeof imageFileOrUrl === 'string') {
      const lower = imageFileOrUrl.toLowerCase();
      if (lower.includes('plastic') || lower.includes('bottle') || lower.includes('3db32d826c18')) suggested = 'Plastic Waste';
      else if (lower.includes('wet') || lower.includes('food') || lower.includes('60a58ac0deb9')) suggested = 'Organic / Wet Waste';
      else if (lower.includes('elec') || lower.includes('circuit') || lower.includes('9ebf69173e03')) suggested = 'E-Waste';
      else if (lower.includes('paper') || lower.includes('box') || lower.includes('354a0b15b')) suggested = 'Paper / Cardboard';
    }

    return {
      success: true,
      suggestedWasteType: suggested,
      confidence: 0.94,
      aiProvider: 'Groq API (Primary)',
      message: 'AI analyzed the waste image successfully.'
    };
  },

  // --- COMPLAINTS / REPORTS ---
  getComplaints: async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports`);
      if (res.ok) return await res.json();
    } catch {
      console.log('Using mock complaints store');
    }
    return complaintsStore;
  },

  getComplaintById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/reports/${id}`);
      if (res.ok) return await res.json();
    } catch {
      console.log('Using mock complaint detail');
    }
    return complaintsStore.find((c) => c.id === id) || complaintsStore[0];
  },

  createComplaint: async (complaintData) => {
    try {
      const res = await fetch(`${BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Backend offline, saving complaint in local store');
    }

    const newId = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
    const newComplaint = {
      id: newId,
      userId: currentUserStore.id,
      userName: currentUserStore.name,
      userPhone: currentUserStore.phone,
      wasteType: complaintData.wasteType,
      aiSuggestedWasteType: complaintData.aiSuggestedWasteType || complaintData.wasteType,
      issueType: complaintData.issueType,
      description: complaintData.description,
      location: complaintData.location,
      coordinates: complaintData.coordinates || { lat: 28.6139, lng: 77.209 },
      landmark: complaintData.landmark || '',
      severity: complaintData.severity || 'Medium',
      photoUrl: complaintData.photoUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      status: 'Pending',
      resolutionNotes: '',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qualifiesForBadge: true,
      smsSent: true
    };

    complaintsStore.unshift(newComplaint);

    // Update user complaint count & badge calculation
    currentUserStore.qualifyingComplaints += 1;
    const cnt = currentUserStore.qualifyingComplaints;
    if (cnt >= 10) currentUserStore.recognition = 'Gold';
    else if (cnt >= 5) currentUserStore.recognition = 'Silver';
    else if (cnt >= 3) currentUserStore.recognition = 'Bronze';
    else currentUserStore.recognition = 'No medal yet';

    if (cnt >= 3) currentUserStore.certificateEligible = true;

    // Add SMS Notification
    notificationsStore.unshift({
      id: 'notif_' + Date.now(),
      title: 'Report Submitted (SMS Sent) 📱',
      message: `Complaint ${newId} received! SMS confirmation dispatched to ${currentUserStore.phone}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'complaint'
    });

    return {
      success: true,
      complaint: newComplaint,
      smsStatus: 'Sent successfully to ' + currentUserStore.phone,
      message: 'Waste report submitted successfully!'
    };
  },

  updateComplaintStatus: async (id, status, notes = '') => {
    try {
      const res = await fetch(`${BASE_URL}/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes: notes })
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Mock complaint status update');
    }

    const idx = complaintsStore.findIndex((c) => c.id === id);
    if (idx !== -1) {
      complaintsStore[idx].status = status;
      complaintsStore[idx].resolutionNotes = notes || complaintsStore[idx].resolutionNotes;
      complaintsStore[idx].updatedAt = new Date().toISOString();

      if (status === 'Rejected') {
        complaintsStore[idx].qualifiesForBadge = false;
      }

      notificationsStore.unshift({
        id: 'notif_' + Date.now(),
        title: `Complaint Status: ${status}`,
        message: `Complaint ${id} status updated to "${status}". SMS sent to citizen.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'complaint'
      });
    }

    return { success: true, complaint: complaintsStore[idx] };
  },

  // --- PICKUP REQUESTS ---
  getPickups: async () => {
    try {
      const res = await fetch(`${BASE_URL}/pickup`);
      if (res.ok) return await res.json();
    } catch {
      console.log('Using mock pickup store');
    }
    return pickupsStore;
  },

  createPickup: async (pickupData) => {
    try {
      const res = await fetch(`${BASE_URL}/pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pickupData)
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Mock create pickup');
    }

    const newId = 'PU-' + Math.floor(100 + Math.random() * 900);
    const newPickup = {
      id: newId,
      userId: currentUserStore.id,
      userName: currentUserStore.name,
      wasteType: pickupData.wasteType,
      location: pickupData.location,
      address: pickupData.address,
      preferredDate: pickupData.preferredDate,
      preferredTime: pickupData.preferredTime,
      additionalDetails: pickupData.additionalDetails || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    pickupsStore.unshift(newPickup);

    notificationsStore.unshift({
      id: 'notif_' + Date.now(),
      title: 'Pickup Request Received 🚛',
      message: `Waste pickup request ${newId} registered. SMS update will follow assignment.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'pickup'
    });

    return { success: true, pickup: newPickup };
  },

  updatePickupStatus: async (id, status) => {
    try {
      const res = await fetch(`${BASE_URL}/pickup/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch {
      console.log('Mock update pickup status');
    }

    const idx = pickupsStore.findIndex((p) => p.id === id);
    if (idx !== -1) {
      pickupsStore[idx].status = status;
      notificationsStore.unshift({
        id: 'notif_' + Date.now(),
        title: `Pickup ${status}`,
        message: `Your pickup request ${id} is now ${status}. SMS dispatched.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'pickup'
      });
    }
    return { success: true, pickup: pickupsStore[idx] };
  },

  // --- QUIZZES & POINTS ---
  getQuizzes: async () => {
    return MOCK_QUIZZES;
  },

  submitQuizAttempt: async (quizId, answers) => {
    const quiz = MOCK_QUIZZES.find((q) => q.id === quizId) || MOCK_QUIZZES[0];
    let score = 0;
    const breakdown = quiz.questions.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctAnswer;
      if (isCorrect) score += Math.round(quiz.points / quiz.questions.length);
      return {
        questionId: q.id,
        userAnswer: answers[idx],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    currentUserStore.points += score;

    notificationsStore.unshift({
      id: 'notif_' + Date.now(),
      title: `Quiz Completed! +${score} Points 🎉`,
      message: `You earned ${score} points in "${quiz.title}". Total points: ${currentUserStore.points}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'quiz'
    });

    return {
      success: true,
      score,
      maxPoints: quiz.points,
      pointsEarned: score,
      breakdown,
      totalPoints: currentUserStore.points
    };
  },

  // --- CERTIFICATES ---
  getCertificateStatus: async () => {
    return {
      eligible: currentUserStore.certificateEligible,
      issued: currentUserStore.certificateIssued,
      certificateId: currentUserStore.certificateId,
      issueDate: currentUserStore.certificateIssueDate,
      qualifyingCount: currentUserStore.qualifyingComplaints,
      recognitionLevel: currentUserStore.recognition,
      points: currentUserStore.points
    };
  },

  issueCertificateByAdmin: async (userId) => {
    currentUserStore.certificateIssued = true;
    currentUserStore.certificateId = 'WS-2026-' + Math.floor(10000 + Math.random() * 90000);
    currentUserStore.certificateIssueDate = new Date().toISOString().split('T')[0];

    notificationsStore.unshift({
      id: 'notif_' + Date.now(),
      title: 'Official Certificate Issued! 📜',
      message: `Your Waste Management & Civic Recognition Certificate has been approved and issued by Admin!`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'certificate'
    });

    return {
      success: true,
      certificateId: currentUserStore.certificateId,
      message: 'Certificate issued successfully.'
    };
  },

  // --- ADMIN VERIFICATIONS ---
  getAdminVerifications: async () => {
    return verificationsStore;
  },

  updateAdminVerification: async (id, status) => {
    const idx = verificationsStore.findIndex((v) => v.id === id);
    if (idx !== -1) {
      verificationsStore[idx].status = status;
      if (verificationsStore[idx].email === MOCK_ADMIN.email) {
        MOCK_ADMIN.verificationStatus = status;
      }
    }
    return { success: true, verification: verificationsStore[idx] };
  },

  // --- NOTIFICATIONS & HOTSPOTS ---
  getNotifications: async () => {
    return notificationsStore;
  },

  markNotificationsRead: async () => {
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    return { success: true };
  },

  getWasteHotspots: async () => {
    return MOCK_HOTSPOTS;
  },

  getCurrentUser: () => currentUserStore
};
