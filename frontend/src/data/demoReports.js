/**
 * Demo User "My Reports" Data matching the user specification
 */

export const INITIAL_USER_REPORTS = [
  {
    id: "R-2041",
    incidentId: "INC-2041",
    title: "WATERLOGGING ON 5TH AVE",
    description: "Heavy rain caused waterlogging near the junction. Vehicles stuck.",
    category: "INFRASTRUCTURE",
    issueType: "Waterlogging",
    location: "Koramangala 5th Block Junction",
    status: "IN PROGRESS",
    timeAgo: "2H AGO",
    updatesCount: "3 UPDATES",
    severity: 88,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-08T14:10:00Z"
  },
  {
    id: "R-2038",
    incidentId: "INC-2038",
    title: "BROKEN STREETLIGHT",
    description: "Streetlight out for 3 days. Very dark and unsafe at night.",
    category: "UTILITIES",
    issueType: "Broken streetlight",
    location: "Indiranagar 100ft Road",
    status: "PENDING",
    timeAgo: "1D AGO",
    updatesCount: "UNDER REVIEW",
    severity: 45,
    imageUrl: null,
    createdAt: "2026-10-07T11:30:00Z"
  },
  {
    id: "R-2031",
    incidentId: "INC-2031",
    title: "GARBAGE NOT COLLECTED",
    description: "Garbage piling up on Maple St. Foul smell and health hazard.",
    category: "UTILITIES",
    issueType: "Garbage not collected",
    location: "HSR Layout Sector 1",
    status: "RESOLVED",
    timeAgo: "5D AGO",
    updatesCount: "RESOLVED",
    severity: 54,
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-03T16:00:00Z"
  }
];
