// Re-export enums and interfaces from backend types
export {
  AlertSeverity,
  AnomalyType,
  IncidentStatus,
  SystemStatus,
  TrafficLevel,
  WeatherCondition,
} from "@/backend";

export type {
  Anomaly,
  EmergencyAlert,
  Incident,
  Route,
  SystemComponent,
  TrafficSegment,
  TrafficSnapshot,
  WeatherData,
} from "@/backend";
