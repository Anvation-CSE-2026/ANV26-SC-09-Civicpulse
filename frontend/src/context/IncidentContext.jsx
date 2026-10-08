import React, { createContext, useContext, useState } from 'react';
import { INITIAL_INCIDENTS } from '../data/demoIncidents';
import { INITIAL_USER_REPORTS } from '../data/demoReports';
import { INITIAL_NOTIFICATIONS } from '../data/demoNotifications';
import { INITIAL_ADMIN_STATS } from '../data/adminStats';
import { INITIAL_RESOURCES, INITIAL_ALLOCATIONS } from '../data/adminResources';
import { INITIAL_ACTIVITIES } from '../data/adminActivities';

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [userReports, setUserReports] = useState(INITIAL_USER_REPORTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [adminStats, setAdminStats] = useState(INITIAL_ADMIN_STATS);

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

  // Citizen submits new report
  const addReport = (reportData, userName = 'Citizen User') => {
    const incidentId = `INC-${Math.floor(2050 + Math.random() * 100)}`;
    const reportId = `R-${Math.floor(2050 + Math.random() * 100)}`;

    const newIncident = {
      id: incidentId,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: 'Just now',
      timeline: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `Report submitted by ${userName} via Citizen Portal` }
      ]
    };

    const newUserReport = {
      id: reportId,
      incidentId: incidentId,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      issueType: reportData.issueType,
      location: reportData.areaName,
      status: 'PENDING',
      timeAgo: 'JUST NOW',
      updatesCount: '1 UPDATE',
      severity: reportData.severity,
      imageUrl: reportData.imageUrl,
      createdAt: new Date().toISOString()
    };

    setIncidents(prev => [newIncident, ...prev]);
    setUserReports(prev => [newUserReport, ...prev]);

    // Recalculate stats
    setAdminStats(prev => ({
      ...prev,
      reportsToday: prev.reportsToday + 1,
      activeCases: prev.activeCases + 1,
      criticalIncidents: reportData.severity > 80 ? prev.criticalIncidents + 1 : prev.criticalIncidents
    }));

    // Add activity & notifications
    addActivity(`New report registered: "${reportData.title}" (${reportData.areaName})`, 'CITIZEN REPORTS', '#B7FF2A');
    addNotification('NEW REPORT', 'REPORT SUBMITTED', `New issue reported in ${reportData.areaName}. Severity: ${reportData.severity}`, incidentId, '#B7FF2A');

    return { incidentId, reportId };
  };

  // Dispatch incident team
  const dispatchIncident = (incidentId, teamName = 'BBMP Rapid Action Team') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'IN PROGRESS',
          updatedAt: 'Just now',
          timeline: [
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `${teamName} dispatched to location` },
            ...(inc.timeline || [])
          ]
        };
      }
      return inc;
    }));

    setUserReports(prev => prev.map(rep => {
      if (rep.incidentId === incidentId || rep.id === incidentId) {
        return { ...rep, status: 'IN PROGRESS', updatesCount: 'DISPATCHED' };
      }
      return rep;
    }));

    addActivity(`${teamName} dispatched to Incident #${incidentId}`, 'ADMIN ACTION', '#4C5CFF');
    addNotification('RESOURCE UPDATE', 'TEAM DISPATCHED', `${teamName} assigned to Incident #${incidentId}`, incidentId, '#4C5CFF');
  };

  // Resolve incident
  const resolveIncident = (incidentId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
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

    setUserReports(prev => prev.map(rep => {
      if (rep.incidentId === incidentId || rep.id === incidentId) {
        return { ...rep, status: 'RESOLVED', updatesCount: 'RESOLVED' };
      }
      return rep;
    }));

    setAdminStats(prev => ({
      ...prev,
      activeCases: Math.max(0, prev.activeCases - 1),
      resolutionRate: Math.min(100, prev.resolutionRate + 1)
    }));

    addActivity(`Incident #${incidentId} marked as RESOLVED by Field Team`, 'FIELD TEAM', '#00D66B');
    addNotification('STATUS RESOLVED', 'REPORT RESOLVED', `Incident #${incidentId} has been resolved successfully.`, incidentId, '#00D66B');
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

  // Simulate new severe citizen report (Live Reprioritization demo requirement)
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
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `+5 new severe reports registered. Severity escalated: ${oldSev} → ${newSev} (CRITICAL)` },
          ...(target.timeline || [])
        ]
      };

      const newArr = [...prev];
      newArr[targetIndex] = updated;

      addActivity(`Incident #${target.id} (${target.title}) escalated to CRITICAL: ${oldSev} → ${newSev}`, 'AI ENGINE', '#FF4F87');
      addNotification('CRITICAL ESCALATION', 'SEVERITY INCREASED', `Incident #${target.id} severity changed: ${oldSev} → ${newSev} (CRITICAL)`, target.id, '#FF4F87');

      return newArr;
    });

    recalculatePriorities();
  };

  const clearNotifications = () => setNotifications([]);

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
        updateResourceQuantity,
        recalculatePriorities,
        simulateNewSevereReport,
        addNotification,
        addActivity,
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
