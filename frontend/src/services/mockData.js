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
    category: 'Wet / Organic Waste',
    points: 100,
    questions: [
      {
        id: 'q1_wet',
        type: 'MCQ',
        question: 'Where should vegetable pulp, fruit peels, and leftover kitchen scraps be disposed of?',
        options: [
          { id: 'A', text: 'Blue Bin (Dry / Recyclable Waste)' },
          { id: 'B', text: 'Green Bin (Wet / Organic Waste)' },
          { id: 'C', text: 'Black Bin (E-Waste Collection)' },
          { id: 'D', text: 'Red Bin (Hazardous Waste)' }
        ],
        correctAnswer: 'B',
        explanation: 'Kitchen food scraps and organic waste belong in the Green Bin for composting.',
        hint: 'Organic waste decomposes naturally.'
      },
      {
        id: 'q2_wet',
        type: 'Scenario-based',
        question: 'Scenario: You have tea leaves and eggshells from breakfast. What is the eco-friendly disposal method?',
        options: [
          { id: 'A', text: 'Mix with plastic wrappers in dry bin' },
          { id: 'B', text: 'Add to compost or wet organic bin' },
          { id: 'C', text: 'Flush down the sink' },
          { id: 'D', text: 'Burn with dry leaves' }
        ],
        correctAnswer: 'B',
        explanation: 'Tea leaves and eggshells are nutrient-rich organic materials suitable for composting.',
        hint: 'Composting creates healthy soil fertilizer.'
      },
      {
        id: 'q3_wet',
        type: 'MCQ',
        question: 'Which of the following items is NOT suitable for the wet/organic waste stream?',
        options: [
          { id: 'A', text: 'Banana peels' },
          { id: 'B', text: 'Stale bread' },
          { id: 'C', text: 'Plastic milk pouch' },
          { id: 'D', text: 'Spoiled vegetables' }
        ],
        correctAnswer: 'C',
        explanation: 'Plastic milk pouches do not decompose organically and must go to dry recycling.',
        hint: 'Plastics belong in dry recyclable streams.'
      }
    ]
  },
  {
    id: 'qz_102',
    title: 'Plastic Recycling & Circular Economy',
    description: 'Test your understanding of single-use plastics, microplastics, and high-density polyethylene (HDPE).',
    category: 'Dry / Recyclable Waste',
    points: 120,
    questions: [
      {
        id: 'q1_dry',
        type: 'MCQ',
        question: 'Which plastic identification code indicates PET commonly used for beverage bottles?',
        options: [
          { id: 'A', text: 'Resin Identification Code #1 (PET/PETE)' },
          { id: 'B', text: 'Resin Identification Code #3 (PVC)' },
          { id: 'C', text: 'Resin Identification Code #6 (PS)' },
          { id: 'D', text: 'Resin Identification Code #7 (OTHER)' }
        ],
        correctAnswer: 'A',
        explanation: 'Resin code #1 stands for Polyethylene Terephthalate (PET), highly recyclable.',
        hint: 'Look for code #1 on clean drinking bottles.'
      },
      {
        id: 'q2_dry',
        type: 'Scenario-based',
        question: 'Scenario: Before discarding clean cardboard packaging and plastic bottles, what should you do?',
        options: [
          { id: 'A', text: 'Soak them in water and food waste' },
          { id: 'B', text: 'Flatten cardboard and rinse clean plastic bottles' },
          { id: 'C', text: 'Burn them in outdoor pile' },
          { id: 'D', text: 'Throw them in wet compost bin' }
        ],
        correctAnswer: 'B',
        explanation: 'Rinsing plastics and flattening cardboard prevents contamination and saves recycling transport space.',
        hint: 'Rinsing prevents food contamination.'
      },
      {
        id: 'q3_dry',
        type: 'MCQ',
        question: 'Clean tin cans, glass bottles, and dry paper should be placed in which bin?',
        options: [
          { id: 'A', text: 'Green Bin (Wet Waste)' },
          { id: 'B', text: 'Blue Bin (Dry / Recyclable Waste)' },
          { id: 'C', text: 'Black Bin (E-Waste)' },
          { id: 'D', text: 'Red Bin (Hazardous)' }
        ],
        correctAnswer: 'B',
        explanation: 'Dry recyclables like metals, clean paper, and glass belong in the Blue Bin.',
        hint: 'Blue is the standard color for dry recyclables.'
      }
    ]
  },
  {
    id: 'qz_103',
    title: 'E-Waste & Electronics Safety',
    description: 'Learn safe recycling procedures for discarded electronics, batteries, and circuit components.',
    category: 'E-Waste & Electronics',
    points: 150,
    questions: [
      {
        id: 'q1_ewaste',
        type: 'Scenario-based',
        question: 'Scenario: You have old remote control lithium batteries and broken circuit boards. What is the correct action?',
        options: [
          { id: 'A', text: 'Throw them into kitchen wet bin' },
          { id: 'B', text: 'Burn them in backyard' },
          { id: 'C', text: 'Drop them at authorized E-Waste collection points' },
          { id: 'D', text: 'Flush down drain' }
        ],
        correctAnswer: 'C',
        explanation: 'Batteries and electronics contain heavy metals that require specialized e-waste collection.',
        hint: 'E-waste requires specialized recovery.'
      },
      {
        id: 'q2_ewaste',
        type: 'MCQ',
        question: 'Why is discarding electronic waste in municipal landfills hazardous?',
        options: [
          { id: 'A', text: 'It melts instantly' },
          { id: 'B', text: 'Toxic metals like lead and mercury leach into groundwater' },
          { id: 'C', text: 'It creates pleasant scents' },
          { id: 'D', text: 'It attracts earthworms' }
        ],
        correctAnswer: 'B',
        explanation: 'Heavy metals in e-waste poison soil and drinking water if dumped in landfills.',
        hint: 'Think about heavy metal toxicity.'
      }
    ]
  },
  {
    id: 'qz_104',
    title: 'Hazardous Waste Procedures',
    description: 'Understand safe handling for chemical cleaners, medical packaging, paint cans, and fluorescent tubes.',
    category: 'Hazardous Waste',
    points: 150,
    questions: [
      {
        id: 'q1_haz',
        type: 'MCQ',
        question: 'Where should chemical cleaning solvents, paint cans, and expired medicine packaging be disposed of?',
        options: [
          { id: 'A', text: 'Green Organic Bin' },
          { id: 'B', text: 'Blue Recycling Bin' },
          { id: 'C', text: 'Red Bin (Hazardous Waste Stream)' },
          { id: 'D', text: 'Regular street drain' }
        ],
        correctAnswer: 'C',
        explanation: 'Hazardous chemicals and medical packaging require designated Red Bins for safe incineration/disposal.',
        hint: 'Red signifies danger/hazardous waste.'
      },
      {
        id: 'q2_haz',
        type: 'Scenario-based',
        question: 'Scenario: A broken fluorescent tube lamp contains mercury vapor. How should it be handled?',
        options: [
          { id: 'A', text: 'Crush it by hand' },
          { id: 'B', text: 'Carefully seal in double plastic bag and hand over to hazardous waste handler' },
          { id: 'C', text: 'Throw into wet compost bin' },
          { id: 'D', text: 'Burn in open fireplace' }
        ],
        correctAnswer: 'B',
        explanation: 'Fluorescent tubes contain mercury vapor requiring sealed hazardous waste disposal.',
        hint: 'Mercury is toxic when inhaled.'
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
