/**
 * Municipal Command Center Initial Resource Units & Allocations
 */

export const INITIAL_RESOURCES = {
  AMBULANCE: { count: 3, unitName: 'EMERGENCY MED' },
  FIRE: { count: 2, unitName: 'HAZMAT / FIRE' },
  POLICE: { count: 5, unitName: 'TRAFFIC POLICE' },
  ELECTRICAL: { count: 4, unitName: 'BESCOM LINESMEN' },
  REPAIR: { count: 6, unitName: 'BBMP ROAD GANG' }
};

export const INITIAL_ALLOCATIONS = [
  {
    incidentId: 'INC-2041',
    incidentTitle: 'WATERLOGGING ON 5TH AVE',
    teams: ['BBMP Stormwater Unit A', 'BESCOM Electrical Unit 2', 'Traffic Police Squad 4'],
    status: 'DISPATCHED'
  },
  {
    incidentId: 'INC-2038',
    incidentTitle: 'MAJOR POTHOLE NEAR METRO',
    teams: ['BBMP Road Patching Unit 3'],
    status: 'DISPATCHED'
  },
  {
    incidentId: 'INC-2035',
    incidentTitle: 'OPEN SEWAGE OVERFLOW',
    teams: ['BWSSB Suction Tanker B', 'Health Safety Squad'],
    status: 'IN PROGRESS'
  },
  {
    incidentId: 'INC-2029',
    incidentTitle: 'UNCOVERED MANHOLE',
    teams: ['Civil Engineering Rapid Unit'],
    status: 'DISPATCHED'
  }
];
