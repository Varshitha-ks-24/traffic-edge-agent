import { c as createLucideIcon } from "./index-CKUeRL-6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode);
async function getSegments(actor) {
  return actor.getSegments();
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
  CircleCheck as C,
  getSegments as a,
  getEmergencyAlerts as b,
  computeOptimalRoute as c,
  acknowledgeEmergency as d,
  reportIncident as e,
  getSystemComponents as f,
  getRoutes as g,
  getWaitTimeEstimate as h,
  resolveAnomaly as r,
  triggerEmergencySimulation as t
};
