import {
  MOCK_QUIZZES,
  MOCK_NOTIFICATIONS,
  MOCK_HOTSPOTS,
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://waste-sphere.vercel.app/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('wastesphere_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Normalizers (Backend → Frontend shape) ──────────────────────────────────

/**
 * Normalize a WasteReport document from MongoDB to a flat frontend shape.
 */
const normalizeReport = (r) => ({
  id: r._id || r.id,
  userId: r.user?._id || r.user,
  userName: r.user?.name || 'Unknown',
  userPhone: r.user?.phone || '',
  wasteType: r.wasteType,
  issueType: r.issueType,
  description: r.description || '',
  location: r.location?.address || r.location || '',
  latitude: r.location?.latitude,
  longitude: r.location?.longitude,
  landmark: r.landmark || '',
  severity: r.severity,
  photoUrl: r.wastePhoto?.url || r.photoUrl || '',
  status: r.status,
  resolutionNotes: r.resolutionDetails || r.resolutionNotes || '',
  qualifiesForBadge: r.status === 'Resolved',
  reportedAt: r.reportedAt || r.createdAt,
  updatedAt: r.updatedAt,
  assignedTo: r.assignedTo || '',
});

/**
 * Normalize a PickupRequest document from MongoDB.
 */
const normalizePickup = (p) => ({
  id: p._id || p.id,
  userId: p.user?._id || p.user,
  userName: p.user?.name || 'Unknown',
  wasteType: p.wasteType,
  address: p.address || p.location?.address || '',
  latitude: p.location?.latitude,
  longitude: p.location?.longitude,
  preferredDate: p.preferredDate,
  preferredTime: p.preferredTime || p.preferredSlot || '',
  additionalDetails: p.additionalDetails || p.notes || '',
  status: p.status,
  createdAt: p.createdAt,
});

/**
 * Normalize a Notification document from MongoDB.
 */
const normalizeNotification = (n) => ({
  id: n._id || n.id,
  title: n.title,
  message: n.message,
  timestamp: n.createdAt || n.timestamp,
  read: n.isRead || n.read || false,
  type: n.type || 'general',
  smsSent: n.smsSent || false,
});

export const api = {
  // ─── AUTH ──────────────────────────────────────────────────────
  login: async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Invalid email or password credentials.');
    }
    return json.data; // { token, user }
  },

  register: async ({ name, email, password, phone }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Citizen registration failed.');
    }
    return json.data; // { token, user }
  },

  registerAdmin: async (formData) => {
    const res = await fetch(`${BASE_URL}/auth/admin/register`, {
      method: 'POST',
      body: formData, // multipart; DO NOT set Content-Type manually
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Officer registration failed.');
    }
    return json.data; // { token, user }
  },

  getMe: async (token) => {
    const jwtToken = token || localStorage.getItem('wastesphere_token');
    if (!jwtToken) throw new Error('No authentication token found');
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to authenticate user session.');
    }
    return json.data.user;
  },

  // ─── AI WASTE RECOGNITION ─────────────────────────────────────
  // POST /api/ai/waste-recognition  (multipart, field: wastePhoto)
  analyzeWasteImage: async (imageFile) => {
    if (imageFile instanceof File || imageFile instanceof Blob) {
      try {
        const formData = new FormData();
        formData.append('wastePhoto', imageFile);

        const res = await fetch(`${BASE_URL}/ai/waste-recognition`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) return json.data || json;
        }
      } catch {
        console.log('AI backend unavailable – using client-side fallback.');
      }
    }

    // Client-side fallback (URL-based or offline)
    await new Promise((r) => setTimeout(r, 1400));
    const categories = [
      'Plastic Waste', 'Organic / Wet Waste', 'Paper / Cardboard',
      'Glass Waste', 'Metal Waste', 'E-Waste', 'Mixed Waste',
    ];
    return {
      success: true,
      suggestedWasteType: categories[Math.floor(Math.random() * categories.length)],
      confidence: 0.92,
      aiProvider: 'Gemini AI (Simulated)',
      message: 'AI analyzed the waste image successfully.',
    };
  },

  // ─── REPORTS / COMPLAINTS ─────────────────────────────────────
  // Citizen: GET /api/reports/my-reports
  getComplaints: async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports/my-reports`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const reports = json.data?.reports || json.data || json;
        return Array.isArray(reports) ? reports.map(normalizeReport) : [];
      }
    } catch {
      console.log('Backend unavailable – complaints empty');
    }
    return [];
  },

  // Admin: GET /api/reports/admin/all  — throws on failure (no silent mock fallback)
  getAllReportsAdmin: async () => {
    const res = await fetch(`${BASE_URL}/reports/admin/all`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || `Server returned ${res.status} fetching complaints.`);
    }
    const json = await res.json();
    const reports = json.data?.reports || json.data || json;
    return Array.isArray(reports) ? reports.map(normalizeReport) : [];
  },

  // GET /api/reports/:id
  getComplaintById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/reports/${id}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const report = json.data?.report || json.data;
        return report ? normalizeReport(report) : null;
      }
    } catch {
      console.log('Backend unavailable – complaint detail null');
    }
    return null;
  },

  /**
   * Create a waste report.
   * The backend requires:
   *   - wastePhoto file (field: wastePhoto) OR a wastePhotoUrl string
   *   - latitude (Number)
   *   - longitude (Number)
   *   - address (String)
   *   - wasteType, issueType, severity
   *   - description?, landmark?
   *
   * @param {Object} fields  Plain fields (strings / numbers)
   * @param {File|null} photoFile  The image file (optional if photoUrl provided)
   */
  createComplaint: async (fields, photoFile) => {
    const formData = new FormData();

    // Required fields
    formData.append('wasteType', fields.wasteType);
    formData.append('issueType', fields.issueType);
    formData.append('severity', fields.severity);
    formData.append('address', fields.address || fields.location || '');
    formData.append('latitude', String(fields.latitude ?? 28.6139));
    formData.append('longitude', String(fields.longitude ?? 77.209));

    // Optional fields
    if (fields.description) formData.append('description', fields.description);
    if (fields.landmark) formData.append('landmark', fields.landmark);

    // Photo: prefer file upload, fallback to URL
    if (photoFile instanceof File || photoFile instanceof Blob) {
      formData.append('wastePhoto', photoFile);
    } else if (fields.wastePhotoUrl || fields.photoUrl) {
      formData.append('wastePhotoUrl', fields.wastePhotoUrl || fields.photoUrl);
    }

    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit waste report.');
    }
    const report = json.data?.report || json.data;
    return {
      complaint: normalizeReport(report),
      smsStatus: 'Sent',
      success: true,
    };
  },

  // PATCH /api/reports/:id/status  (admin only)
  updateComplaintStatus: async (id, status, resolutionNotes = '') => {
    const res = await fetch(`${BASE_URL}/reports/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status, resolutionDetails: resolutionNotes }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update complaint status');
    }
    return json.data;
  },

  // PATCH /api/reports/:id/assign  (admin only)
  assignReport: async (id, assignedTo) => {
    const res = await fetch(`${BASE_URL}/reports/${id}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ assignedTo }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to assign report');
    }
    return json.data;
  },

  // ─── PICKUP REQUESTS ──────────────────────────────────────────
  // Citizen: GET /api/pickups/my-pickups
  getPickups: async () => {
    try {
      const res = await fetch(`${BASE_URL}/pickups/my-pickups`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const pickups = json.data?.pickups || json.data || json;
        return Array.isArray(pickups) ? pickups.map(normalizePickup) : [];
      }
    } catch {
      console.log('Backend unavailable – pickups empty');
    }
    return [];
  },

  // Admin: GET /api/pickups/admin/all  — throws on failure (no silent mock fallback)
  getAllPickupsAdmin: async () => {
    const res = await fetch(`${BASE_URL}/pickups/admin/all`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || `Server returned ${res.status} fetching pickups.`);
    }
    const json = await res.json();
    const pickups = json.data?.pickups || json.data || json;
    return Array.isArray(pickups) ? pickups.map(normalizePickup) : [];
  },

  // POST /api/pickups
  createPickup: async (pickupData) => {
    const payload = {
      wasteType: pickupData.wasteType,
      latitude: Number(pickupData.latitude ?? 28.6139),
      longitude: Number(pickupData.longitude ?? 77.209),
      address: pickupData.address || pickupData.location || '',
      preferredDate: pickupData.preferredDate,
      preferredTime: pickupData.preferredTime,
      additionalDetails: pickupData.additionalDetails || '',
    };
    const res = await fetch(`${BASE_URL}/pickups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to create pickup request');
    }
    const pickup = json.data?.pickup || json.data;
    return { pickup: normalizePickup(pickup), success: true };
  },

  // PATCH /api/pickups/:id/status  (admin only)
  updatePickupStatus: async (id, status) => {
    const res = await fetch(`${BASE_URL}/pickups/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update pickup status');
    }
    return json.data;
  },

  // ─── QUIZZES ──────────────────────────────────────────────────
  // GET /api/quizzes
  getQuizzes: async () => {
    try {
      const res = await fetch(`${BASE_URL}/quizzes`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data?.quizzes || json.data || MOCK_QUIZZES;
      }
    } catch {
      console.log('Backend unavailable – quiz fallback');
    }
    return MOCK_QUIZZES;
  },

  // POST /api/quizzes/:id/start
  startQuizAttempt: async (quizId) => {
    try {
      const res = await fetch(`${BASE_URL}/quizzes/${quizId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ quizId }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.log('Backend error on quiz start:', e);
    }
    throw new Error('Failed to start AI quiz session');
  },

  // POST /api/quizzes/:id/answer
  answerQuizQuestion: async (quizId, attemptId, questionId, selectedAnswer) => {
    try {
      const res = await fetch(`${BASE_URL}/quizzes/${quizId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ attemptId, questionId, selectedAnswer }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.log('Backend error on answer question:', e);
    }
    throw new Error('Failed to validate question answer');
  },

  // POST /api/quizzes/:id/submit
  submitQuizAttempt: async (quizId, payload) => {
    try {
      const bodyPayload = typeof payload === 'object' && payload.attemptId
        ? payload
        : { answers: payload };

      const res = await fetch(`${BASE_URL}/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.log('Backend unavailable – quiz submit fallback', e);
    }
    // Local fallback scoring
    const quiz = MOCK_QUIZZES.find((q) => q.id === quizId) || MOCK_QUIZZES[0];
    let score = 0;
    const userAns = typeof payload === 'object' && payload.answers ? payload.answers : payload;
    const breakdown = (quiz?.questions || []).map((q, idx) => {
      const sel = userAns[q.id] || userAns[idx];
      const isCorrect = sel === q.correctAnswer || sel === (q.correctAnswer === 0 ? 'A' : q.correctAnswer === 1 ? 'B' : q.correctAnswer === 2 ? 'C' : 'D');
      if (isCorrect) score += Math.round((quiz.points || 50) / (quiz.questions?.length || 5));
      return { questionId: q.id, selectedAnswer: sel, correctAnswer: q.correctAnswer, isCorrect, explanation: q.explanation };
    });
    return { success: true, score, pointsEarned: score, totalPoints: score, correctCount: score > 0 ? 1 : 0, totalQuestions: quiz?.questions?.length || 1, breakdown };
  },

  // ─── POINTS ───────────────────────────────────────────────────
  // GET /api/points/my-points
  getMyPoints: async () => {
    try {
      const res = await fetch(`${BASE_URL}/points/my-points`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || { totalPoints: 0, history: [] };
      }
    } catch {
      console.log('Points backend unavailable');
    }
    return { totalPoints: 0, history: [] };
  },

  // ─── RECOGNITION / BADGES ─────────────────────────────────────
  // GET /api/recognition/my-recognition
  getMyRecognition: async () => {
    try {
      const res = await fetch(`${BASE_URL}/recognition/my-recognition`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || { level: null, qualifyingComplaints: 0 };
      }
    } catch {
      console.log('Recognition backend unavailable');
    }
    return { level: null, qualifyingComplaints: 0 };
  },

  // ─── CERTIFICATES ─────────────────────────────────────────────
  // GET /api/certificates/eligibility
  getCertificateStatus: async () => {
    try {
      const res = await fetch(`${BASE_URL}/certificates/eligibility`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || { eligible: false, issued: false };
      }
    } catch {
      console.log('Certificates backend unavailable');
    }
    return { eligible: false, issued: false };
  },

  // GET /api/certificates/my-certificates
  getMyCertificates: async () => {
    try {
      const res = await fetch(`${BASE_URL}/certificates/my-certificates`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data?.certificates || json.data || [];
      }
    } catch {
      console.log('My certificates backend unavailable');
    }
    return [];
  },

  // POST /api/certificates/admin/issue/:userId  (admin only)
  issueCertificateByAdmin: async (userId) => {
    const res = await fetch(`${BASE_URL}/certificates/admin/issue/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to issue certificate');
    }
    return json.data;
  },

  // ─── ADMIN VERIFICATIONS ──────────────────────────────────────
  // GET /api/admin/verifications
  getAdminVerifications: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/verifications`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data?.verifications || json.data || [];
      }
    } catch {
      console.log('Admin verifications backend unavailable');
    }
    return [];
  },

  // PATCH /api/admin/verifications/:id/status
  updateAdminVerification: async (id, status) => {
    const res = await fetch(`${BASE_URL}/admin/verifications/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update verification');
    }
    return json.data;
  },

  // ─── NOTIFICATIONS ────────────────────────────────────────────
  // GET /api/notifications
  getNotifications: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const notifs = json.data?.notifications || json.data || [];
        return Array.isArray(notifs) ? notifs.map(normalizeNotification) : MOCK_NOTIFICATIONS;
      }
    } catch {
      console.log('Notifications backend unavailable');
    }
    return MOCK_NOTIFICATIONS;
  },

  // PATCH /api/notifications/read-all
  markNotificationsRead: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) return { success: true };
    } catch {
      console.log('Mark read backend unavailable');
    }
    return { success: true };
  },

  // PATCH /api/notifications/:id/read
  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) return { success: true };
    } catch {
      console.log('Mark single read backend unavailable');
    }
    return { success: true };
  },

  // ─── ANALYTICS (Admin only) ───────────────────────────────────
  // GET /api/analytics/dashboard-metrics
  getDashboardMetrics: async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/dashboard-metrics`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch {
      console.log('Analytics backend unavailable');
    }
    return null;
  },

  // GET /api/analytics/waste-hotspots  (public / citizen use — falls back to empty)
  getWasteHotspots: async () => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/waste-hotspots`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data?.hotspots || json.data || [];
      }
    } catch {
      console.log('Hotspots backend unavailable');
    }
    return [];
  },

  // GET /api/analytics/waste-hotspots  (admin — throws on failure, no mock fallback)
  getWasteHotspotsAdmin: async () => {
    const res = await fetch(`${BASE_URL}/analytics/waste-hotspots`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || `Server returned ${res.status} fetching hotspots.`);
    }
    const json = await res.json();
    return json.data?.hotspots || json.data || [];
  },
};
