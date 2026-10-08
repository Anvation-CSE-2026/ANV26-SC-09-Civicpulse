/**
 * Helper utilities for severity levels, styling, and breakdown calculation
 */

export function getSeverityInfo(score) {
  if (score <= 30) {
    return {
      level: 'NORMAL',
      color: '#00D66B', // green
      badgeBg: 'bg-[#00D66B]',
      badgeText: 'text-[#050505]',
      border: 'border-[#050505]',
      dot: '🟢',
      markerBg: '#00D66B',
      markerText: '#050505',
      intensity: score / 100,
    };
  } else if (score <= 60) {
    return {
      level: 'MEDIUM',
      color: '#FFD83D', // yellow
      badgeBg: 'bg-[#FFD83D]',
      badgeText: 'text-[#050505]',
      border: 'border-[#050505]',
      dot: '🟡',
      markerBg: '#FFD83D',
      markerText: '#050505',
      intensity: score / 100,
    };
  } else if (score <= 80) {
    return {
      level: 'HIGH',
      color: '#FF9F1C', // orange
      badgeBg: 'bg-[#FF9F1C]',
      badgeText: 'text-white',
      border: 'border-[#050505]',
      dot: '🟠',
      markerBg: '#FF9F1C',
      markerText: '#FFFFFF',
      intensity: score / 100,
    };
  } else {
    return {
      level: 'CRITICAL',
      color: '#FF4F87', // red/pink
      badgeBg: 'bg-[#FF4F87]',
      badgeText: 'text-white',
      border: 'border-[#050505]',
      dot: '🔴',
      markerBg: '#FF4F87',
      markerText: '#FFFFFF',
      isPulsing: true,
      intensity: score / 100,
    };
  }
}

export function getStatusStyle(status) {
  const norm = (status || '').toUpperCase().replace('_', ' ');
  switch (norm) {
    case 'IN PROGRESS':
      return {
        bg: 'bg-[#4C5CFF]',
        text: 'text-white',
        border: 'border-[#050505]',
        label: 'IN PROGRESS'
      };
    case 'PENDING':
      return {
        bg: 'bg-[#FFD83D]',
        text: 'text-[#050505]',
        border: 'border-[#050505]',
        label: 'PENDING'
      };
    case 'RESOLVED':
      return {
        bg: 'bg-[#00D66B]',
        text: 'text-[#050505]',
        border: 'border-[#050505]',
        label: 'RESOLVED'
      };
    default:
      return {
        bg: 'bg-gray-200',
        text: 'text-black',
        border: 'border-black',
        label: status || 'UNKNOWN'
      };
  }
}

export function calculateSeverityBreakdown(incident) {
  const baseFactors = incident.severityFactors || {
    mlEvidence: Math.round((incident.severity || 50) * 0.32),
    citizenReports: Math.round((incident.reportCount || 1) * 1.5),
    locationConcentration: 15,
    rapidGrowth: Math.round(((incident.severity || 50) * 0.15)),
    publicImpact: Math.round(((incident.severity || 50) * 0.2)),
  };

  const total = 
    (baseFactors.mlEvidence || 28) + 
    (baseFactors.citizenReports || 18) + 
    (baseFactors.locationConcentration || 15) + 
    (baseFactors.rapidGrowth || 12) + 
    (baseFactors.publicImpact || 15);

  return {
    factors: [
      { label: 'ML visual evidence', score: baseFactors.mlEvidence || 28 },
      { label: 'Citizen reports', score: baseFactors.citizenReports || 18 },
      { label: 'Location concentration', score: baseFactors.locationConcentration || 15 },
      { label: 'Rapid report growth', score: baseFactors.rapidGrowth || 12 },
      { label: 'Public impact', score: baseFactors.publicImpact || 15 }
    ],
    total: Math.min(100, Math.max(10, total))
  };
}
