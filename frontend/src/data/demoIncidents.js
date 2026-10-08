/**
 * Bengaluru Demo Incidents Data
 * Realistic coordinates, categories, severity scores, and status values.
 */

export const INITIAL_INCIDENTS = [
  {
    id: "INC-2041",
    title: "WATERLOGGING ON 5TH AVE JUNCTION",
    description: "Heavy rain caused severe waterlogging near the Koramangala 5th Block signal. Multiple two-wheelers and sedans are stranded in 2ft deep water.",
    category: "INFRASTRUCTURE",
    issueType: "Waterlogging",
    areaName: "Koramangala 5th Block",
    latitude: 12.9352,
    longitude: 77.6245,
    severity: 88, // CRITICAL
    status: "IN PROGRESS",
    reportCount: 14,
    createdAt: "2026-10-08T14:10:00Z",
    updatedAt: "2 min ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 94,
    severityFactors: {
      mlEvidence: 28,
      citizenReports: 18,
      locationConcentration: 15,
      rapidGrowth: 12,
      publicImpact: 15
    },
    timeline: [
      { time: "14:10", text: "Citizen report received via Mobile App" },
      { time: "14:12", text: "Similar 4 reports detected in 150m radius" },
      { time: "14:18", text: "Image evidence uploaded & AI classified as Waterlogging" },
      { time: "14:19", text: "Severity auto-escalated from 64 to 88 (CRITICAL)" },
      { time: "14:20", text: "Dispatched Stormwater Drain Rapid Action Team" }
    ]
  },
  {
    id: "INC-2038",
    title: "MAJOR POTHOLE NEAR METRO STATION",
    description: "Deep 8-inch trench-like pothole under Indiranagar Metro Station pillar 42. High risk for commuters at night.",
    category: "INFRASTRUCTURE",
    issueType: "Pothole",
    areaName: "Indiranagar 100ft Road",
    latitude: 12.9784,
    longitude: 77.6408,
    severity: 76, // HIGH
    status: "PENDING",
    reportCount: 9,
    createdAt: "2026-10-08T11:30:00Z",
    updatedAt: "15 min ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 91,
    severityFactors: {
      mlEvidence: 26,
      citizenReports: 14,
      locationConcentration: 16,
      rapidGrowth: 8,
      publicImpact: 12
    },
    timeline: [
      { time: "11:30", text: "First citizen report submitted" },
      { time: "12:15", text: "AI verified high road surface degradation score" },
      { time: "13:00", text: "BBMP Road Inspection ticket #TK-883 created" }
    ]
  },
  {
    id: "INC-2035",
    title: "OPEN SEWAGE OVERFLOW NEAR BUS STAND",
    description: "Main drain clogged resulting in stinking black water flooding sidewalk in front of Kempegowda Bus Station.",
    category: "UTILITIES",
    issueType: "Sewage overflow",
    areaName: "Majestic / City Railway Station",
    latitude: 12.9774,
    longitude: 77.5709,
    severity: 92, // CRITICAL
    status: "IN PROGRESS",
    reportCount: 22,
    createdAt: "2026-10-08T09:00:00Z",
    updatedAt: "1 hour ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 97,
    severityFactors: {
      mlEvidence: 30,
      citizenReports: 20,
      locationConcentration: 16,
      rapidGrowth: 11,
      publicImpact: 15
    },
    timeline: [
      { time: "09:00", text: "Multiple citizen calls logged" },
      { time: "09:30", text: "Health safety hazard flagged automatically" },
      { time: "10:15", text: "BWSSB maintenance team assigned suction tanker" }
    ]
  },
  {
    id: "INC-2031",
    title: "GARBAGE DUMPING ON MAIN ROAD",
    description: "Uncollected municipal waste piling up outside HSR Layout Sector 1 park entrance. Foul odor affecting nearby residents.",
    category: "UTILITIES",
    issueType: "Garbage not collected",
    areaName: "HSR Layout Sector 1",
    latitude: 12.9116,
    longitude: 77.6476,
    severity: 54, // MEDIUM
    status: "RESOLVED",
    reportCount: 5,
    createdAt: "2026-10-07T16:00:00Z",
    updatedAt: "3 hours ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 89,
    severityFactors: {
      mlEvidence: 18,
      citizenReports: 10,
      locationConcentration: 12,
      rapidGrowth: 4,
      publicImpact: 10
    },
    timeline: [
      { time: "Oct 7 16:00", text: "Report submitted by resident association" },
      { time: "Oct 8 08:00", text: "Sanitation truck deployed to location" },
      { time: "Oct 8 13:00", text: "Waste cleared and area disinfected. Ticket closed." }
    ]
  },
  {
    id: "INC-2029",
    title: "UNCOVERED MANHOLE ON SIDEWALK",
    description: "Missing concrete manhole cover on busy pedestrian walkway near Commercial Street entrance.",
    category: "PUBLIC SAFETY",
    issueType: "Open manhole",
    areaName: "MG Road / Commercial St",
    latitude: 12.9756,
    longitude: 77.6068,
    severity: 89, // CRITICAL
    status: "IN PROGRESS",
    reportCount: 18,
    createdAt: "2026-10-08T08:15:00Z",
    updatedAt: "8 min ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 96,
    severityFactors: {
      mlEvidence: 29,
      citizenReports: 19,
      locationConcentration: 15,
      rapidGrowth: 11,
      publicImpact: 15
    },
    timeline: [
      { time: "08:15", text: "Pedestrian reported open pit" },
      { time: "08:20", text: "Traffic police placed temporary barricade" },
      { time: "08:45", text: "Civil engineering crew dispatched with new iron cover" }
    ]
  },
  {
    id: "INC-2025",
    title: "BROKEN STREETLIGHT ON 27TH MAIN",
    description: "Series of 4 streetlights out along BTM 2nd Stage 27th Main. Road is completely dark at night.",
    category: "UTILITIES",
    issueType: "Broken streetlight",
    areaName: "BTM Layout 2nd Stage",
    latitude: 12.9166,
    longitude: 77.6101,
    severity: 45, // MEDIUM
    status: "PENDING",
    reportCount: 4,
    createdAt: "2026-10-07T20:30:00Z",
    updatedAt: "1 day ago",
    hasImage: false,
    evidenceConfidence: 75,
    severityFactors: {
      mlEvidence: 12,
      citizenReports: 8,
      locationConcentration: 10,
      rapidGrowth: 5,
      publicImpact: 10
    },
    timeline: [
      { time: "Oct 7 20:30", text: "Report submitted by night commuter" },
      { time: "Oct 8 09:00", text: "BESCOM Electrical Division notified" }
    ]
  },
  {
    id: "INC-2022",
    title: "HIGH-PRESSURE PIPE LEAKAGE",
    description: "Clean drinking water bursting out of main pipeline on Outer Ring Road near Bellandur flyover.",
    category: "UTILITIES",
    issueType: "Water leakage",
    areaName: "Bellandur ORR",
    latitude: 12.9279,
    longitude: 77.6784,
    severity: 82, // CRITICAL
    status: "IN PROGRESS",
    reportCount: 16,
    createdAt: "2026-10-08T12:00:00Z",
    updatedAt: "30 min ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 93,
    severityFactors: {
      mlEvidence: 27,
      citizenReports: 17,
      locationConcentration: 14,
      rapidGrowth: 10,
      publicImpact: 14
    },
    timeline: [
      { time: "12:00", text: "Water gushing reported on social and citizen app" },
      { time: "12:15", text: "Main control valve isolated by BWSSB engineer" }
    ]
  },
  {
    id: "INC-2019",
    title: "UNAUTHORIZED ROAD EXCAVATION",
    description: "Contractors dug up 200 meters of freshly laid asphalt without warning signs or proper lane management.",
    category: "INFRASTRUCTURE",
    issueType: "Road excavation",
    areaName: "Whitefield Main Road",
    latitude: 12.9698,
    longitude: 77.7499,
    severity: 68, // HIGH
    status: "IN PROGRESS",
    reportCount: 11,
    createdAt: "2026-10-08T07:45:00Z",
    updatedAt: "4 hours ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 88,
    severityFactors: {
      mlEvidence: 22,
      citizenReports: 14,
      locationConcentration: 14,
      rapidGrowth: 8,
      publicImpact: 10
    },
    timeline: [
      { time: "07:45", text: "Citizen report registered" },
      { time: "09:30", text: "BBMP Ward officer requested work permit validation" }
    ]
  },
  {
    id: "INC-2015",
    title: "FALLEN TREE BRANCH BLOCKING LANE",
    description: "Large banyan branch snapped during thunderstorm blocking left lane of Marathahalli bridge access road.",
    category: "PUBLIC SAFETY",
    issueType: "Dangerous obstruction",
    areaName: "Marathahalli Bridge",
    latitude: 12.9591,
    longitude: 77.6974,
    severity: 72, // HIGH
    status: "RESOLVED",
    reportCount: 8,
    createdAt: "2026-10-07T18:20:00Z",
    updatedAt: "Yesterday",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 95,
    severityFactors: {
      mlEvidence: 25,
      citizenReports: 12,
      locationConcentration: 15,
      rapidGrowth: 8,
      publicImpact: 12
    },
    timeline: [
      { time: "Oct 7 18:20", text: "Reported by commuters" },
      { time: "Oct 7 19:10", text: "Forestry chainsaw crew removed timber and cleared traffic" }
    ]
  },
  {
    id: "INC-2012",
    title: "TRANSFORMER SPARKING & POWER OUTAGE",
    description: "BESCOM electric distribution transformer emitting loud sparks and smoke near Yelahanka New Town 4th Phase.",
    category: "UTILITIES",
    issueType: "Power issue",
    areaName: "Yelahanka New Town",
    latitude: 13.0998,
    longitude: 77.5968,
    severity: 85, // CRITICAL
    status: "IN PROGRESS",
    reportCount: 19,
    createdAt: "2026-10-08T13:45:00Z",
    updatedAt: "25 min ago",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
    evidenceConfidence: 96,
    severityFactors: {
      mlEvidence: 28,
      citizenReports: 18,
      locationConcentration: 15,
      rapidGrowth: 10,
      publicImpact: 14
    },
    timeline: [
      { time: "13:45", text: "Urgent power hazard reported" },
      { time: "13:50", text: "BESCOM Substation trip initiated remotely" },
      { time: "14:05", text: "Linesman crew on-site performing transformer repairs" }
    ]
  },
  {
    id: "INC-2008",
    title: "COLLAPSED FOOTPATH PAVERS",
    description: "Walker path cracked and sunken near Hebbal Flyover loop road.",
    category: "INFRASTRUCTURE",
    issueType: "Broken footpath",
    areaName: "Hebbal Lake Park",
    latitude: 13.0358,
    longitude: 77.5970,
    severity: 38, // MEDIUM
    status: "PENDING",
    reportCount: 3,
    createdAt: "2026-10-06T10:00:00Z",
    updatedAt: "2 days ago",
    hasImage: true,
    evidenceConfidence: 82,
    severityFactors: {
      mlEvidence: 12,
      citizenReports: 6,
      locationConcentration: 8,
      rapidGrowth: 4,
      publicImpact: 8
    },
    timeline: [
      { time: "Oct 6 10:00", text: "Registered by morning jogger" }
    ]
  },
  {
    id: "INC-2005",
    title: "ROAD CRACK ON 4TH BLOCK OVERPASS",
    description: "Fissure appeared along asphalt expansion joint on Jayanagar 4th Block flyover.",
    category: "INFRASTRUCTURE",
    issueType: "Road crack",
    areaName: "Jayanagar 4th Block",
    latitude: 12.9299,
    longitude: 77.5824,
    severity: 58, // MEDIUM
    status: "PENDING",
    reportCount: 6,
    createdAt: "2026-10-07T14:00:00Z",
    updatedAt: "1 day ago",
    hasImage: true,
    evidenceConfidence: 86,
    severityFactors: {
      mlEvidence: 18,
      citizenReports: 10,
      locationConcentration: 12,
      rapidGrowth: 8,
      publicImpact: 10
    },
    timeline: [
      { time: "Oct 7 14:00", text: "Structural engineer inspection queued" }
    ]
  },
  {
    id: "INC-2001",
    title: "TRAFFIC SIGNAL FAILURE AT 15TH CROSS",
    description: "4-way intersection traffic lights powered off creating chaos near JP Nagar Metro.",
    category: "PUBLIC SAFETY",
    issueType: "Dangerous obstruction",
    areaName: "JP Nagar 2nd Phase",
    latitude: 12.9077,
    longitude: 77.5855,
    severity: 78, // HIGH
    status: "IN PROGRESS",
    reportCount: 13,
    createdAt: "2026-10-08T13:00:00Z",
    updatedAt: "40 min ago",
    hasImage: false,
    evidenceConfidence: 80,
    severityFactors: {
      mlEvidence: 20,
      citizenReports: 16,
      locationConcentration: 16,
      rapidGrowth: 12,
      publicImpact: 14
    },
    timeline: [
      { time: "13:00", text: "Traffic gridlock reported" },
      { time: "13:15", text: "Traffic Constable assigned for manual control" }
    ]
  },
  {
    id: "INC-1998",
    title: "BROKEN BENCH IN PUBLIC PARK",
    description: "Concrete seating bench vandalized inside Rajajinagar 1st Block playground.",
    category: "INFRASTRUCTURE",
    issueType: "Broken footpath",
    areaName: "Rajajinagar 1st Block",
    latitude: 12.9982,
    longitude: 77.5530,
    severity: 22, // NORMAL
    status: "RESOLVED",
    reportCount: 2,
    createdAt: "2026-10-05T11:00:00Z",
    updatedAt: "3 days ago",
    hasImage: false,
    evidenceConfidence: 78,
    severityFactors: {
      mlEvidence: 8,
      citizenReports: 4,
      locationConcentration: 4,
      rapidGrowth: 2,
      publicImpact: 4
    },
    timeline: [
      { time: "Oct 5 11:00", text: "Park committee report registered" },
      { time: "Oct 6 15:00", text: "Bench repaired by horticulture dept" }
    ]
  },
  {
    id: "INC-1994",
    title: "FADED PEDESTRIAN CROSSWALK MARKS",
    description: "Zebra crossing paint fully worn out near Malleshwaram 8th Main school zone.",
    category: "PUBLIC SAFETY",
    issueType: "Dangerous obstruction",
    areaName: "Malleshwaram 8th Main",
    latitude: 13.0031,
    longitude: 77.5694,
    severity: 28, // NORMAL
    status: "PENDING",
    reportCount: 3,
    createdAt: "2026-10-06T14:30:00Z",
    updatedAt: "2 days ago",
    hasImage: true,
    evidenceConfidence: 84,
    severityFactors: {
      mlEvidence: 10,
      citizenReports: 6,
      locationConcentration: 4,
      rapidGrowth: 3,
      publicImpact: 5
    },
    timeline: [
      { time: "Oct 6 14:30", text: "School PTA submitted safety request" }
    ]
  },
  {
    id: "INC-1990",
    title: "SMALL ROAD RUT NEAR TEMPLE GATE",
    description: "Minor asphalt depression on Banashankari 2nd Stage main entrance road.",
    category: "INFRASTRUCTURE",
    issueType: "Road crack",
    areaName: "Banashankari 2nd Stage",
    latitude: 12.9254,
    longitude: 77.5658,
    severity: 18, // NORMAL
    status: "RESOLVED",
    reportCount: 1,
    createdAt: "2026-10-04T09:00:00Z",
    updatedAt: "4 days ago",
    hasImage: false,
    evidenceConfidence: 70,
    severityFactors: {
      mlEvidence: 5,
      citizenReports: 3,
      locationConcentration: 4,
      rapidGrowth: 2,
      publicImpact: 4
    },
    timeline: [
      { time: "Oct 4 09:00", text: "Cold patch applied by local road gang" }
    ]
  },
  {
    id: "INC-1985",
    title: "CONSTRUCTION MATERIAL DUMPED ON ROAD",
    description: "Sand and gravel left unattended occupying half the street near Electronic City Phase 1 gate.",
    category: "PUBLIC SAFETY",
    issueType: "Dangerous obstruction",
    areaName: "Electronic City Phase 1",
    latitude: 12.8452,
    longitude: 77.6602,
    severity: 64, // HIGH
    status: "IN PROGRESS",
    reportCount: 7,
    createdAt: "2026-10-08T10:00:00Z",
    updatedAt: "2 hours ago",
    hasImage: true,
    evidenceConfidence: 89,
    severityFactors: {
      mlEvidence: 20,
      citizenReports: 12,
      locationConcentration: 14,
      rapidGrowth: 8,
      publicImpact: 10
    },
    timeline: [
      { time: "10:00", text: "Commuter alert registered" },
      { time: "11:30", text: "Notice served to builder to clear debris within 4 hours" }
    ]
  },
  {
    id: "INC-1980",
    title: "LOW OVERHEAD ELECTRIC CABLE",
    description: "Sagging fiber optical and power line hanging just 6 feet above road in Ulsoor village road.",
    category: "UTILITIES",
    issueType: "Power issue",
    areaName: "Ulsoor / Halasuru",
    latitude: 12.9817,
    longitude: 77.6200,
    severity: 74, // HIGH
    status: "PENDING",
    reportCount: 8,
    createdAt: "2026-10-08T06:30:00Z",
    updatedAt: "5 hours ago",
    hasImage: true,
    evidenceConfidence: 92,
    severityFactors: {
      mlEvidence: 24,
      citizenReports: 14,
      locationConcentration: 14,
      rapidGrowth: 8,
      publicImpact: 14
    },
    timeline: [
      { time: "06:30", text: "Early morning report logged" }
    ]
  },
  {
    id: "INC-1975",
    title: "SLIGHT DRAIN BLOCKAGE NEAR CORNER SHOP",
    description: "Dry leaves clogging storm grate on Frazer Town Coles Road.",
    category: "INFRASTRUCTURE",
    issueType: "Waterlogging",
    areaName: "Frazer Town",
    latitude: 12.9968,
    longitude: 77.6130,
    severity: 25, // NORMAL
    status: "RESOLVED",
    reportCount: 2,
    createdAt: "2026-10-06T08:00:00Z",
    updatedAt: "2 days ago",
    hasImage: false,
    evidenceConfidence: 75,
    severityFactors: {
      mlEvidence: 8,
      citizenReports: 5,
      locationConcentration: 4,
      rapidGrowth: 3,
      publicImpact: 5
    },
    timeline: [
      { time: "Oct 6 08:00", text: "Grate manually cleared by shopkeeper and civic worker" }
    ]
  }
];
