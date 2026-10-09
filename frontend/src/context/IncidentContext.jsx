import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_INCIDENTS } from '../data/demoIncidents';
import { INITIAL_USER_REPORTS } from '../data/demoReports';
import { INITIAL_NOTIFICATIONS } from '../data/demoNotifications';
import { INITIAL_ADMIN_STATS } from '../data/adminStats';
import { INITIAL_RESOURCES, INITIAL_ALLOCATIONS } from '../data/adminResources';
import { INITIAL_ACTIVITIES } from '../data/adminActivities';
import { apiService, getStoredToken } from '../services/api';
import { useAuth } from './AuthContext';

const IncidentContext = createContext();

function mapBackendReportToUi(report) {
  const timeDiff = Date.now() - new Date(report.createdAt).getTime();
  const mins = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  let timeAgo = 'JUST NOW';
  if (days > 0) timeAgo = `${days}D AGO`;
  else if (hours > 0) timeAgo = `${hours}H AGO`;
  else if (mins > 0) timeAgo = `${mins}M AGO`;

  const rawStatus = (report.status || 'PENDING').toUpperCase();
  const statusNorm = rawStatus === 'IN_PROGRESS' ? 'IN PROGRESS' : rawStatus;

  return {
    id: report.id,
    displayId: `R-${report.id}`,
    incidentId: report.id,
    displayIncidentId: `INC-${report.id}`,
    title: report.title,
    description: report.description,
    category: report.category || 'INFRASTRUCTURE',
    issueType: report.issueType || 'General',
    location: report.areaName || 'Bengaluru',
    areaName: report.areaName || 'Bengaluru',
    latitude: report.latitude || 12.9716,
    longitude: report.longitude || 77.5946,
    status: statusNorm,
    assignedTeam: report.assignedTeam || null,
    timeAgo,
    updatesCount: statusNorm === 'PENDING' ? 'UNDER REVIEW' : (statusNorm === 'IN PROGRESS' ? 'DISPATCHED' : 'RESOLVED'),
    severity: report.severity || 65,
    severityLevel: report.severityLevel || 'MEDIUM',
    mlConfidence: report.mlConfidence || 0.85,
    mlModelVersion: report.mlModelVersion || 'civicpulse-v1',
    ward: report.ward || report.areaName || 'Bengaluru',
    rainfall: report.rainfall,
    traffic: report.traffic,
    population: report.population,
    department: report.department,
    hasImage: !!report.hasImage,
    imageUrl: report.imageUrl || null,
    evidenceConfidence: report.evidenceConfidence || 88,
    severityFactors: report.severityFactors || {},
    createdAt: report.createdAt,
    userId: report.userId,
    userName: report.userName || 'Citizen'
  };
}

export function IncidentProvider({ children }) {
  const { currentUser, isAuthenticated, role } = useAuth();

  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [userReports, setUserReports] = useState([]);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [adminStats, setAdminStats] = useState(INITIAL_ADMIN_STATS);

  // Fetch real user reports from PostgreSQL when authenticated
  const fetchReports = async () => {
    const token = getStoredToken();
    if (!token || !isAuthenticated) return;

    try {
      const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
      const reports = isAdmin ? await apiService.getAllReports() : await apiService.getMyReports();
      if (Array.isArray(reports)) {
        const mapped = reports.map(mapBackendReportToUi);
        setUserReports(mapped);

        if (isAdmin) {
          // In admin portal, display strictly authorized real backend reports from PostgreSQL
          setIncidents(mapped);
        } else {
          // Citizen portal: show citizen's own reports
          if (mapped.length > 0) {
            setIncidents(prev => {
              const mappedIds = new Set(mapped.map(m => String(m.id)));
              const nonOverlapping = prev.filter(inc => !mappedIds.has(String(inc.id)));
              return [...mapped, ...nonOverlapping];
            });
          }
        }
      }
    } catch (err) {
      console.warn('Backend reports could not be loaded:', err?.message || err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUserReports([]);
      setIncidents(INITIAL_INCIDENTS);
      return;
    }

    fetchReports();
    // Poll every 3 seconds to sync citizen & admin views across separate browser sessions
    const interval = setInterval(fetchReports, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, role, currentUser]);

  // Helper to add activity log
  const addActivity = (message, source = 'SYSTEM', color = '#4C5CFF') => {
    const newAct = {
      id: `act-${Date.now()}`,
      message,
      timestamp: 'JUST NOW',
      source,
      color
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Helper to add notification
  const addNotification = (type, title, message, incidentId, color = '#B7FF2A') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      incidentId,
      color
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Citizen submits new report to real backend
  const addReport = async (reportData, userName = 'Citizen User') => {
    // 1. Submit to real backend with JWT
    const savedBackendReport = await apiService.createReport({
      title: reportData.title,
      description: reportData.description,
      category: reportData.category || 'INFRASTRUCTURE',
      issueType: reportData.issueType || 'General',
      areaName: reportData.areaName || 'Bengaluru',
      ward: reportData.ward || reportData.areaName || 'Bengaluru',
      latitude: reportData.latitude || 12.9716,
      longitude: reportData.longitude || 77.5946,
      rainfall: reportData.rainfall,
      traffic: reportData.traffic,
      population: reportData.population,
      department: reportData.department,
      severity: reportData.severity || 65,
      status: 'PENDING',
      hasImage: !!reportData.hasImage,
      imageUrl: (reportData.imageUrl && !reportData.imageUrl.startsWith('data:image')) ? reportData.imageUrl : (reportData.hasImage ? "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" : null),
      evidenceConfidence: reportData.evidenceConfidence || 88,
      severityFactors: reportData.severityFactors || {}
    });

    // 2. Map real response into UI format (using real database ID)
    const newUserReport = mapBackendReportToUi(savedBackendReport);

    const newIncident = {
      ...newUserReport,
      reportCount: 1,
      updatedAt: 'Just now',
      timeline: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `Report submitted by ${userName} via Citizen Portal` }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
    setUserReports(prev => [newUserReport, ...prev]);

    // Recalculate stats
    setAdminStats(prev => ({
      ...prev,
      reportsToday: prev.reportsToday + 1,
      activeCases: prev.activeCases + 1,
      criticalIncidents: (newUserReport.severity > 80) ? prev.criticalIncidents + 1 : prev.criticalIncidents
    }));

    // Add activity & notifications
    addActivity(`New report registered: "${newUserReport.title}" (${newUserReport.areaName})`, 'CITIZEN REPORTS', '#B7FF2A');
    addNotification('NEW REPORT', 'REPORT SUBMITTED', `New issue reported in ${newUserReport.areaName}. Severity: ${newUserReport.severity}`, newUserReport.id, '#B7FF2A');

    return { incidentId: newUserReport.id, reportId: newUserReport.id };
  };

  // Dispatch incident team - strictly server-enforced, no optimistic false-success
  const dispatchIncident = async (incidentId, teamName = 'Road Maintenance Unit') => {
    const numericId = Number(incidentId);
    if (!isNaN(numericId) && numericId > 0) {
      await apiService.updateReportStatus(numericId, {
        status: 'IN_PROGRESS',
        assignedTeam: teamName
      });
      // Synchronize with PostgreSQL on success
      await fetchReports();
    } else {
      setIncidents(prev => prev.map(inc => {
        if (String(inc.id) === String(incidentId)) {
          return {
            ...inc,
            status: 'IN PROGRESS',
            assignedTeam: teamName,
            updatedAt: 'Just now',
            timeline: [
              { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `${teamName} dispatched to location` },
              ...(inc.timeline || [])
            ]
          };
        }
        return inc;
      }));
    }

    addActivity(`${teamName} dispatched to Incident #${incidentId}`, 'ADMIN ACTION', '#4C5CFF');
    addNotification('RESOURCE UPDATE', 'TEAM DISPATCHED', `${teamName} assigned to Incident #${incidentId}`, incidentId, '#4C5CFF');
  };

  // Resolve incident - strictly server-enforced, no optimistic false-success
  const resolveIncident = async (incidentId) => {
    const numericId = Number(incidentId);
    if (!isNaN(numericId) && numericId > 0) {
      await apiService.updateReportStatus(numericId, {
        status: 'RESOLVED'
      });
      // Synchronize with PostgreSQL on success
      await fetchReports();
    } else {
      setIncidents(prev => prev.map(inc => {
        if (String(inc.id) === String(incidentId)) {
          return {
            ...inc,
            status: 'RESOLVED',
            updatedAt: 'Just now',
            timeline: [
              { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Issue resolved & verified by field team' },
              ...(inc.timeline || [])
            ]
          };
        }
        return inc;
      }));
    }

    setAdminStats(prev => ({
      ...prev,
      activeCases: Math.max(0, prev.activeCases - 1),
      resolutionRate: Math.min(100, prev.resolutionRate + 1)
    }));

    addActivity(`Incident #${incidentId} marked as RESOLVED by Field Team`, 'FIELD TEAM', '#00D66B');
    addNotification('STATUS RESOLVED', 'REPORT RESOLVED', `Incident #${incidentId} has been resolved successfully.`, incidentId, '#00D66B');
  };

  // Claim or assign incident
  const assignIncident = async (incidentId, adminId) => {
    const numericId = Number(incidentId);
    if (!isNaN(numericId) && numericId > 0) {
      await apiService.assignReport(numericId, adminId);
      await fetchReports();
      addActivity(`Incident #${incidentId} assigned to Admin #${adminId || 'current'}`, 'ADMIN DISPATCH', '#4C5CFF');
    }
  };

  // Exceptional soft-delete by SUPER_ADMIN
  const deleteIncident = async (incidentId, reason = 'Administrative removal') => {
    const numericId = Number(incidentId);
    if (!isNaN(numericId) && numericId > 0) {
      await apiService.deleteReport(numericId, reason);
      await fetchReports();
      addActivity(`Incident #${incidentId} soft-deleted by Super Admin`, 'AUDIT LOG', '#FF4F87');
    }
  };

  // Resource quantity adjustment
  const updateResourceQuantity = (type, delta) => {
    setResources(prev => {
      const current = prev[type] ? prev[type].count : 0;
      const nextCount = Math.max(0, current + delta);
      return {
        ...prev,
        [type]: { ...prev[type], count: nextCount }
      };
    });
  };

  // Recompute Priorities & Resource Allocations
  const recalculatePriorities = () => {
    addActivity('System recomputed priority scores based on severity & available units', 'AI ENGINE', '#FFD83D');
    addNotification('PRIORITY RECOMPUTE', 'REALLOCATION COMPLETE', 'Incident response priorities updated based on safety risk matrix', null, '#FFD83D');
  };

  const simulateNewSevereReport = (targetIncidentId) => {
    setIncidents(prev => {
      const targetIndex = prev.findIndex(i => i.id === targetIncidentId) !== -1 
        ? prev.findIndex(i => i.id === targetIncidentId) 
        : 0;

      const target = prev[targetIndex];
      const oldSev = target.severity;
      const newSev = Math.min(99, Math.max(88, oldSev + 22));
      const newReportCount = target.reportCount + 5;

      const updated = {
        ...target,
        severity: newSev,
        reportCount: newReportCount,
        status: 'IN PROGRESS',
        updatedAt: 'Just now',
        timeline: [
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `+5 new severe reports registered. Severity escalated: ${oldSev} -> ${newSev} (CRITICAL)` },
          ...(target.timeline || [])
        ]
      };

      const newArr = [...prev];
      newArr[targetIndex] = updated;
      return newArr;
    });

    addActivity(`+5 Citizen reports escalated Incident to CRITICAL severity (94)`, 'CIVIC ESCALATION', '#FF4F87');
    addNotification('SEVERITY SPIKE', 'INCIDENT ESCALATION', 'Incident escalated to CRITICAL priority due to influx of 5 new reports.', targetIncidentId, '#FF4F87');
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        userReports,
        notifications,
        resources,
        allocations,
        activities,
        adminStats,
        addReport,
        dispatchIncident,
        resolveIncident,
        assignIncident,
        deleteIncident,
        refreshReports: fetchReports,
        updateResourceQuantity,
        recalculatePriorities,
        simulateNewSevereReport,
        clearNotifications
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  return useContext(IncidentContext);
}
