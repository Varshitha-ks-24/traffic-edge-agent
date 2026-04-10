async function getSegments(actor) {
  return actor.getSegments();
}
async function getAnomalies(actor, activeOnly) {
  return actor.getAnomalies(activeOnly);
}
async function getRoutes(actor) {
  return actor.getRoutes();
}
async function getSystemComponents(actor) {
  return actor.getSystemComponents();
}
async function getEmergencyAlerts(actor, activeOnly) {
  return actor.getEmergencyAlerts(activeOnly);
}
async function computeOptimalRoute(actor, from, to) {
  return actor.computeOptimalRoute(from, to);
}
async function getWaitTimeEstimate(actor, segmentId) {
  const result = await actor.getWaitTimeEstimate(segmentId);
  return Number(result);
}
async function reportIncident(actor, segmentId, incidentType, note) {
  return actor.reportIncident(segmentId, incidentType, note);
}
async function resolveAnomaly(actor, anomalyId) {
  return actor.resolveAnomaly(anomalyId);
}
async function acknowledgeEmergency(actor, alertId) {
  return actor.acknowledgeEmergency(alertId);
}
async function triggerEmergencySimulation(actor, segmentId, vehicleType) {
  return actor.triggerEmergencySimulation(segmentId, vehicleType);
}
export {
  getRoutes as a,
  getSegments as b,
  computeOptimalRoute as c,
  getEmergencyAlerts as d,
  acknowledgeEmergency as e,
  reportIncident as f,
  getAnomalies as g,
  getSystemComponents as h,
  getWaitTimeEstimate as i,
  resolveAnomaly as r,
  triggerEmergencySimulation as t
};
