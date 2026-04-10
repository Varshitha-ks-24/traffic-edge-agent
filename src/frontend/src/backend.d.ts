import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmergencyAlert {
    id: string;
    vehicleType: string;
    segmentId: string;
    description: string;
    isActive: boolean;
    triggeredAt: bigint;
    recommendedAction: string;
    priority: bigint;
}
export interface Anomaly {
    id: string;
    segmentId: string;
    anomalyType: AnomalyType;
    detectedAt: bigint;
    description: string;
    isActive: boolean;
    reasoning: string;
    severity: AlertSeverity;
}
export interface TrafficSegment {
    id: string;
    lat: number;
    lon: number;
    avgSpeed: number;
    waitTimeSeconds: bigint;
    congestionPct: bigint;
    name: string;
    district: string;
    trafficLevel: TrafficLevel;
    vehicleCount: bigint;
}
export interface WeatherData {
    temperature: number;
    affectedDistricts: Array<string>;
    windSpeed: number;
    updatedAt: bigint;
    recommendation: string;
    visibility: bigint;
    condition: WeatherCondition;
}
export interface Incident {
    id: string;
    status: IncidentStatus;
    segmentId: string;
    validationScore: bigint;
    reporterNote: string;
    reportedAt: bigint;
    validatedAt?: bigint;
    incidentType: string;
}
export interface SystemComponent {
    id: string;
    status: SystemStatus;
    uptimePct: number;
    name: string;
    lastChecked: bigint;
    failureCount: bigint;
    componentType: string;
}
export interface TrafficSnapshot {
    activeEmergencies: Array<EmergencyAlert>;
    segments: Array<TrafficSegment>;
    activeAnomalies: Array<Anomaly>;
    timestamp: bigint;
    weather: WeatherData;
    systemHealth: bigint;
}
export interface Route {
    id: string;
    fromDistrict: string;
    name: string;
    segments: Array<string>;
    reasoning: string;
    totalDistance: number;
    alternateOf?: string;
    isOptimal: boolean;
    toDistrict: string;
    estimatedMinutes: bigint;
}
export enum AlertSeverity {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
}
export enum AnomalyType {
    EmergencyVehicle = "EmergencyVehicle",
    Pedestrian = "Pedestrian",
    Obstacle = "Obstacle",
    Animal = "Animal",
    Accident = "Accident",
    VehicleBreakdown = "VehicleBreakdown"
}
export enum IncidentStatus {
    Rejected = "Rejected",
    Validated = "Validated",
    Resolved = "Resolved",
    Pending = "Pending"
}
export enum SystemStatus {
    Failed = "Failed",
    Operational = "Operational",
    Maintenance = "Maintenance",
    Degraded = "Degraded"
}
export enum TrafficLevel {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    NoTraffic = "NoTraffic"
}
export enum WeatherCondition {
    Fog = "Fog",
    Storm = "Storm",
    Rain = "Rain",
    Snow = "Snow",
    Clear = "Clear"
}
export interface backendInterface {
    acknowledgeEmergency(alertId: string): Promise<boolean>;
    computeOptimalRoute(fromDistrict: string, toDistrict: string): Promise<Route | null>;
    getAnomalies(activeOnly: boolean): Promise<Array<Anomaly>>;
    getEmergencyAlerts(activeOnly: boolean): Promise<Array<EmergencyAlert>>;
    getIncidents(): Promise<Array<Incident>>;
    getRoutes(): Promise<Array<Route>>;
    getSegments(): Promise<Array<TrafficSegment>>;
    getSystemComponents(): Promise<Array<SystemComponent>>;
    getTrafficSnapshot(): Promise<TrafficSnapshot>;
    getWaitTimeEstimate(segmentId: string): Promise<bigint>;
    getWeather(): Promise<WeatherData>;
    reportIncident(segmentId: string, incidentType: string, reporterNote: string): Promise<Incident>;
    resetSimulation(): Promise<void>;
    resolveAnomaly(anomalyId: string): Promise<boolean>;
    simulateTick(): Promise<void>;
    triggerEmergencySimulation(segmentId: string, vehicleType: string): Promise<EmergencyAlert>;
}
