import type { backendInterface } from "@/backend";
import type {
  Anomaly,
  EmergencyAlert,
  Incident,
  Route,
  SystemComponent,
  TrafficSegment,
  TrafficSnapshot,
  WeatherData,
} from "@/types/traffic";

export type BackendActor = backendInterface;

export async function getTrafficSnapshot(
  actor: BackendActor,
): Promise<TrafficSnapshot> {
  return actor.getTrafficSnapshot();
}

export async function getSegments(
  actor: BackendActor,
): Promise<TrafficSegment[]> {
  return actor.getSegments();
}

export async function getAnomalies(
  actor: BackendActor,
  activeOnly: boolean,
): Promise<Anomaly[]> {
  return actor.getAnomalies(activeOnly);
}

export async function getRoutes(actor: BackendActor): Promise<Route[]> {
  return actor.getRoutes();
}

export async function getIncidents(actor: BackendActor): Promise<Incident[]> {
  return actor.getIncidents();
}

export async function getWeather(actor: BackendActor): Promise<WeatherData> {
  return actor.getWeather();
}

export async function getSystemComponents(
  actor: BackendActor,
): Promise<SystemComponent[]> {
  return actor.getSystemComponents();
}

export async function getEmergencyAlerts(
  actor: BackendActor,
  activeOnly: boolean,
): Promise<EmergencyAlert[]> {
  return actor.getEmergencyAlerts(activeOnly);
}

export async function computeOptimalRoute(
  actor: BackendActor,
  from: string,
  to: string,
): Promise<Route | null> {
  return actor.computeOptimalRoute(from, to);
}

export async function getWaitTimeEstimate(
  actor: BackendActor,
  segmentId: string,
): Promise<number> {
  const result = await actor.getWaitTimeEstimate(segmentId);
  return Number(result);
}

export async function simulateTick(actor: BackendActor): Promise<void> {
  return actor.simulateTick();
}

export async function reportIncident(
  actor: BackendActor,
  segmentId: string,
  incidentType: string,
  note: string,
): Promise<Incident> {
  return actor.reportIncident(segmentId, incidentType, note);
}

export async function resolveAnomaly(
  actor: BackendActor,
  anomalyId: string,
): Promise<boolean> {
  return actor.resolveAnomaly(anomalyId);
}

export async function acknowledgeEmergency(
  actor: BackendActor,
  alertId: string,
): Promise<boolean> {
  return actor.acknowledgeEmergency(alertId);
}

export async function triggerEmergencySimulation(
  actor: BackendActor,
  segmentId: string,
  vehicleType: string,
): Promise<EmergencyAlert> {
  return actor.triggerEmergencySimulation(segmentId, vehicleType);
}

export async function resetSimulation(actor: BackendActor): Promise<void> {
  return actor.resetSimulation();
}
