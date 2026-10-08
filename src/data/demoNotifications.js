/**
 * Initial Demo Notifications
 */

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "NEW REPORT",
    title: "NEW REPORT",
    message: "A citizen reported road excavation near Koramangala 5th Block.",
    timestamp: "5 min ago",
    read: false,
    incidentId: "INC-2041",
    color: "#B7FF2A"
  },
  {
    id: "notif-2",
    type: "SEVERITY INCREASED",
    title: "SEVERITY INCREASED",
    message: "Incident #INC-2041 severity changed: 64 → 88 (CRITICAL)",
    timestamp: "12 min ago",
    read: false,
    incidentId: "INC-2041",
    color: "#FF4F87"
  },
  {
    id: "notif-3",
    type: "RESOURCE UPDATE",
    title: "RESOURCE UPDATE",
    message: "Response priority changed for Incident #INC-2041. Rapid Action Team deployed.",
    timestamp: "25 min ago",
    read: true,
    incidentId: "INC-2041",
    color: "#4C5CFF"
  },
  {
    id: "notif-4",
    type: "STATUS RESOLVED",
    title: "REPORT RESOLVED",
    message: "Your report #R-2031 (Garbage Not Collected) has been marked as RESOLVED by BBMP Sanitation.",
    timestamp: "2 hours ago",
    read: true,
    incidentId: "INC-2031",
    color: "#00D66B"
  }
];
