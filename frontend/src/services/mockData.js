export const MOCK_USER = {
  id: 'usr_101',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  role: 'citizen',
  phone: '+91 9876543210',
  points: 240,
  qualifyingComplaints: 4, // Bronze badge earned!
  recognition: 'Bronze',
  certificateEligible: true,
  certificateIssued: true,
  certificateId: 'WS-2026-88492',
  certificateIssueDate: '2026-09-25'
};

export const MOCK_ADMIN = {
  id: 'adm_501',
  name: 'Officer Rajesh Kumar',
  email: 'admin@wastesphere.gov.in',
  role: 'admin',
  phone: '+91 9123456789',
  verificationStatus: 'approved', // 'pending', 'approved', 'rejected'
  officerIdUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
};

export const MOCK_COMPLAINTS = [
  {
    id: 'CMP-8091',
    userId: 'usr_101',
    userName: 'Aarav Sharma',
    userPhone: '+91 9876543210',
    wasteType: 'Plastic Waste',
    aiSuggestedWasteType: 'Plastic Waste',
    issueType: 'Overflowing Garbage Bin',
    description: 'Main street community bin overflowing with single-use plastic containers and water bottles.',
    location: '12-B Park Street, Sector 4, New Delhi',
    coordinates: { lat: 28.6139, lng: 77.209 },
    landmark: 'Opposite City Metro Gate 3',
    severity: 'High',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress', // Pending, Under Review, Assigned, In Progress, Resolved, Rejected
    resolutionNotes: 'Municipal collection team assigned with Truck #ND-04.',
    reportedAt: '2026-09-28T10:30:00Z',
    updatedAt: '2026-09-29T14:15:00Z',
    qualifiesForBadge: true,
    smsSent: true
  },
  {
    id: 'CMP-8092',
    userId: 'usr_101',
    userName: 'Aarav Sharma',
    userPhone: '+91 9876543210',
    wasteType: 'Organic / Wet Waste',
    aiSuggestedWasteType: 'Organic / Wet Waste',
    issueType: 'Uncollected Waste',
    description: 'Food leftovers and kitchen waste dumped near residential alleyway creating foul smell.',
    location: '45 Green Park Extension, New Delhi',
    coordinates: { lat: 28.5562, lng: 77.201 },
    landmark: 'Near Community Center',
    severity: 'Medium',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    resolutionNotes: 'Composting crew cleared the waste and disinfected the area.',
    reportedAt: '2026-09-20T08:15:00Z',
    updatedAt: '2026-09-21T11:00:00Z',
    qualifiesForBadge: true,
    smsSent: true
  },
  {
    id: 'CMP-8093',
    userId: 'usr_101',
    userName: 'Aarav Sharma',
    userPhone: '+91 9876543210',
    wasteType: 'E-Waste',
    aiSuggestedWasteType: 'E-Waste',
    issueType: 'Illegal Dumping',
    description: 'Broken monitors, old circuit boards and battery casings discarded behind the shopping complex.',
    location: 'Block C Market, Vasant Kunj, New Delhi',
    coordinates: { lat: 28.5293, lng: 77.1524 },
    landmark: 'Behind Bank ATM',
    severity: 'High',
    photoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    resolutionNotes: 'Handed over to authorized e-waste recycler SafaiTech.',
    reportedAt: '2026-09-15T16:40:00Z',
    updatedAt: '2026-09-16T18:20:00Z',
    qualifiesForBadge: true,
    smsSent: true
  },
  {
    id: 'CMP-8094',
    userId: 'usr_101',
    userName: 'Aarav Sharma',
    userPhone: '+91 9876543210',
    wasteType: 'Paper / Cardboard',
    aiSuggestedWasteType: 'Paper / Cardboard',
    issueType: 'Garbage on Road / Public Area',
    description: 'Cardboard packing boxes scattered across sidewalk blocking pedestrian path.',
    location: '18 Connaught Place Inner Circle',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    landmark: 'Near Central Park',
    severity: 'Low',
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    resolutionNotes: 'Recycling truck collected packaging material.',
    reportedAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-11T09:30:00Z',
    qualifiesForBadge: true,
    smsSent: true
  },
  {
    id: 'CMP-8095',
    userId: 'usr_999',
    userName: 'Priya Verma',
    userPhone: '+91 9988776655',
    wasteType: 'Glass Waste',
    aiSuggestedWasteType: 'Glass Waste',
    issueType: 'Open Waste Burning',
    description: 'Locals burning plastic and glass bottles near vacant plot.',
    location: 'Rohini Sector 7, Delhi',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    landmark: 'Behind Public School',
    severity: 'High',
    photoUrl: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    resolutionNotes: '',
    reportedAt: '2026-09-30T09:00:00Z',
    updatedAt: '2026-09-30T09:00:00Z',
    qualifiesForBadge: false,
    smsSent: false
  }
];

export const MOCK_PICKUPS = [
  {
    id: 'PU-401',
    userId: 'usr_101',
    userName: 'Aarav Sharma',
    wasteType: 'E-Waste',
    location: '12-B Park Street, Sector 4, New Delhi',
    address: 'Flat 302, Sunrise Apartments, Park Street',
    preferredDate: '2026-10-02',
    preferredTime: '10:00 AM - 01:00 PM',
    additionalDetails: '3 old desktop computers and 2 printer cartridges.',
    status: 'Scheduled', // Pending, Accepted, Scheduled, Collected
    createdAt: '2026-09-29T15:20:00Z',
    scheduledDate: '2026-10-02T11:00:00Z'
  },
  {
    id: 'PU-402',
    userId: 'usr_101',
    userName: 'Aarav Sharma',
    wasteType: 'Paper / Cardboard',
    location: '12-B Park Street, Sector 4, New Delhi',
    address: 'Flat 302, Sunrise Apartments, Park Street',
    preferredDate: '2026-09-24',
    preferredTime: '02:00 PM - 05:00 PM',
    additionalDetails: 'Bulk newspapers and moving boxes.',
    status: 'Collected',
    createdAt: '2026-09-22T11:00:00Z',
    scheduledDate: '2026-09-24T14:30:00Z'
  }
];

export const MOCK_QUIZZES = [
  {
    id: 'qz_101',
    title: 'Waste Segregation Masterclass',
    description: 'Master the fundamentals of Wet vs Dry waste segregation and learn proper disposal practices.',
    category: 'Segregation',
    points: 100,
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        question: 'Where should banana peels, vegetable scraps, and leftover cooked food be disposed of?',
        options: [
          'Green Bin (Wet / Organic Waste)',
          'Blue Bin (Dry / Recyclable Waste)',
          'Black Bin (E-Waste)',
          'Red Bin (Hazardous Waste)'
        ],
        correctAnswer: 0,
        explanation: 'Organic and wet kitchen waste goes into the Green Bin for composting.'
      },
      {
        id: 'q2',
        type: 'Image-based',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
        question: 'Identify the primary waste category shown in this image.',
        options: [
          'Organic Waste',
          'E-Waste (Electronic Waste)',
          'Hazardous Waste',
          'Cardboard Waste'
        ],
        correctAnswer: 1,
        explanation: 'Circuit boards, wires, and old electronics belong to the E-Waste category and require specialized recycling.'
      },
      {
        id: 'q3',
        type: 'Scenario-based',
        question: 'Scenario: You have spent lithium batteries from your remote control. What is the environmentally safe way to dispose of them?',
        options: [
          'Burn them in open waste heap',
          'Throw them in regular street garbage bin',
          'Drop them off at authorized E-Waste / Hazardous collection points',
          'Flush them down the drain'
        ],
        correctAnswer: 2,
        explanation: 'Batteries contain heavy metals and toxic chemicals that contaminate soil and groundwater if improperly discarded.'
      }
    ]
  },
  {
    id: 'qz_102',
    title: 'Plastic Recycling & Circular Economy',
    description: 'Test your understanding of single-use plastics, microplastics, and high-density polyethylene (HDPE).',
    category: 'Recycling',
    points: 120,
    questions: [
      {
        id: 'q21',
        type: 'MCQ',
        question: 'Which plastic code indicates PET / PETE commonly used for beverage bottles?',
        options: ['Resin Code #1', 'Resin Code #3', 'Resin Code #6', 'Resin Code #7'],
        correctAnswer: 0,
        explanation: 'Resin identification code #1 stands for Polyethylene Terephthalate (PETE).'
      },
      {
        id: 'q22',
        type: 'Scenario-based',
        question: 'Scenario: Your local neighborhood has uncollected plastic waste accumulating. What is the most effective immediate action?',
        options: [
          'Ignore it until monsoon',
          'Report it with photo & location on WasteSphere',
          'Set fire to the plastic pile',
          'Throw it into nearest river'
        ],
        correctAnswer: 1,
        explanation: 'Reporting via WasteSphere alerts municipal officers and qualifies you for civic recognition badges.'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Complaint Update',
    message: 'Your complaint CMP-8091 status changed to "In Progress". Municipal team assigned.',
    timestamp: '2026-09-29T14:15:00Z',
    read: false,
    type: 'complaint'
  },
  {
    id: 'notif_2',
    title: 'Bronze Badge Unlocked! 🥉',
    message: 'Congratulations! You reached 4 qualifying waste reports and unlocked the Bronze Citizen Badge.',
    timestamp: '2026-09-28T10:35:00Z',
    read: true,
    type: 'badge'
  },
  {
    id: 'notif_3',
    title: 'Pickup Scheduled 🚛',
    message: 'Your E-Waste pickup request PU-401 is scheduled for 2026-10-02 (10:00 AM - 01:00 PM).',
    timestamp: '2026-09-29T15:25:00Z',
    read: true,
    type: 'pickup'
  }
];

export const MOCK_HOTSPOTS = [
  {
    area: 'Sector 4, Park Street Axis',
    complaintCount: 14,
    primaryIssue: 'Overflowing Bins',
    severity: 'High',
    coordinates: { lat: 28.6139, lng: 77.209 }
  },
  {
    area: 'Rohini Sector 7 Commercial Belt',
    complaintCount: 9,
    primaryIssue: 'Open Waste Burning',
    severity: 'High',
    coordinates: { lat: 28.7041, lng: 77.1025 }
  },
  {
    area: 'Vasant Kunj Market Rear Alley',
    complaintCount: 7,
    primaryIssue: 'Illegal Dumping',
    severity: 'Medium',
    coordinates: { lat: 28.5293, lng: 77.1524 }
  }
];

export const MOCK_ADMIN_VERIFICATIONS = [
  {
    id: 'ver_901',
    name: 'Officer Rajesh Kumar',
    email: 'admin@wastesphere.gov.in',
    phone: '+91 9123456789',
    officerIdPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    status: 'approved',
    submittedAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'ver_902',
    name: 'Officer Sunita Rao',
    email: 'sunita.rao@wastesphere.gov.in',
    phone: '+91 9811223344',
    officerIdPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    status: 'pending',
    submittedAt: '2026-09-29T16:30:00Z'
  }
];
