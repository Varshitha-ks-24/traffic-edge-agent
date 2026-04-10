import { TrafficLevel } from "@/backend";
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

// ─── Fallback Segments ──────────────────────────────────────────────────────────
// Hardcoded city district segments — always available even when backend is down.

export const FALLBACK_SEGMENTS: TrafficSegment[] = [
  {
    id: "seg-001",
    name: "Main St Corridor",
    district: "Downtown Core",
    trafficLevel: TrafficLevel.Medium,
    vehicleCount: BigInt(42),
    avgSpeed: 28,
    waitTimeSeconds: BigInt(45),
    lat: 40.7128,
    lon: -74.006,
    congestionPct: BigInt(55),
  },
  {
    id: "seg-002",
    name: "Central Avenue",
    district: "Downtown Core",
    trafficLevel: TrafficLevel.Medium,
    vehicleCount: BigInt(38),
    avgSpeed: 32,
    waitTimeSeconds: BigInt(30),
    lat: 40.714,
    lon: -74.003,
    congestionPct: BigInt(48),
  },
  {
    id: "seg-003",
    name: "Business Park Blvd",
    district: "Westside Business District",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(21),
    avgSpeed: 45,
    waitTimeSeconds: BigInt(15),
    lat: 40.718,
    lon: -74.015,
    congestionPct: BigInt(22),
  },
  {
    id: "seg-004",
    name: "Commerce Ring Rd",
    district: "Westside Business District",
    trafficLevel: TrafficLevel.Medium,
    vehicleCount: BigInt(35),
    avgSpeed: 38,
    waitTimeSeconds: BigInt(25),
    lat: 40.715,
    lon: -74.019,
    congestionPct: BigInt(40),
  },
  {
    id: "seg-005",
    name: "Residential Lane North",
    district: "Eastside Residential",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(14),
    avgSpeed: 50,
    waitTimeSeconds: BigInt(10),
    lat: 40.72,
    lon: -73.998,
    congestionPct: BigInt(15),
  },
  {
    id: "seg-006",
    name: "Elm Street South",
    district: "Eastside Residential",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(18),
    avgSpeed: 47,
    waitTimeSeconds: BigInt(12),
    lat: 40.717,
    lon: -73.994,
    congestionPct: BigInt(18),
  },
  {
    id: "seg-007",
    name: "Industrial Parkway",
    district: "North Industrial Zone",
    trafficLevel: TrafficLevel.High,
    vehicleCount: BigInt(68),
    avgSpeed: 18,
    waitTimeSeconds: BigInt(90),
    lat: 40.728,
    lon: -74.008,
    congestionPct: BigInt(78),
  },
  {
    id: "seg-008",
    name: "Freight Terminal Rd",
    district: "North Industrial Zone",
    trafficLevel: TrafficLevel.High,
    vehicleCount: BigInt(55),
    avgSpeed: 22,
    waitTimeSeconds: BigInt(75),
    lat: 40.731,
    lon: -74.012,
    congestionPct: BigInt(70),
  },
  {
    id: "seg-009",
    name: "University Ave",
    district: "Midtown Campus",
    trafficLevel: TrafficLevel.Medium,
    vehicleCount: BigInt(44),
    avgSpeed: 30,
    waitTimeSeconds: BigInt(40),
    lat: 40.722,
    lon: -74.002,
    congestionPct: BigInt(50),
  },
  {
    id: "seg-010",
    name: "Scholar's Ring",
    district: "Midtown Campus",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(25),
    avgSpeed: 40,
    waitTimeSeconds: BigInt(20),
    lat: 40.724,
    lon: -73.999,
    congestionPct: BigInt(28),
  },
  {
    id: "seg-011",
    name: "Harbor View Rd",
    district: "Southport Harbor",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(16),
    avgSpeed: 48,
    waitTimeSeconds: BigInt(12),
    lat: 40.706,
    lon: -74.011,
    congestionPct: BigInt(20),
  },
  {
    id: "seg-012",
    name: "Dock Street",
    district: "Southport Harbor",
    trafficLevel: TrafficLevel.Medium,
    vehicleCount: BigInt(33),
    avgSpeed: 35,
    waitTimeSeconds: BigInt(28),
    lat: 40.703,
    lon: -74.009,
    congestionPct: BigInt(45),
  },
  {
    id: "seg-013",
    name: "Hillside Drive",
    district: "Uptown Heights",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(20),
    avgSpeed: 42,
    waitTimeSeconds: BigInt(18),
    lat: 40.726,
    lon: -74.001,
    congestionPct: BigInt(25),
  },
  {
    id: "seg-014",
    name: "Summit Blvd",
    district: "Uptown Heights",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(17),
    avgSpeed: 44,
    waitTimeSeconds: BigInt(15),
    lat: 40.729,
    lon: -73.998,
    congestionPct: BigInt(22),
  },
  {
    id: "seg-015",
    name: "Green Park Loop",
    district: "Suburban Outskirts",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(11),
    avgSpeed: 52,
    waitTimeSeconds: BigInt(8),
    lat: 40.734,
    lon: -74.022,
    congestionPct: BigInt(12),
  },
  {
    id: "seg-016",
    name: "Meadow Way",
    district: "Suburban Outskirts",
    trafficLevel: TrafficLevel.Low,
    vehicleCount: BigInt(9),
    avgSpeed: 55,
    waitTimeSeconds: BigInt(6),
    lat: 40.738,
    lon: -74.025,
    congestionPct: BigInt(10),
  },
];

// ─── Unique districts derived from FALLBACK_SEGMENTS ───────────────────────────

export const ALL_DISTRICTS: string[] = Array.from(
  new Set(FALLBACK_SEGMENTS.map((s) => s.district)),
);

// ─── City graph for Dijkstra pathfinding ───────────────────────────────────────
// Edges connect adjacent districts. Weight = base km + congestion penalty.

const DISTRICT_ADJACENCY: Array<[string, string, number]> = [
  ["Downtown Core", "Westside Business District", 3.2],
  ["Downtown Core", "Eastside Residential", 2.8],
  ["Downtown Core", "Midtown Campus", 2.1],
  ["Downtown Core", "Southport Harbor", 4.0],
  ["Westside Business District", "North Industrial Zone", 3.8],
  ["Westside Business District", "Suburban Outskirts", 5.1],
  ["Eastside Residential", "Midtown Campus", 2.5],
  ["Eastside Residential", "Uptown Heights", 3.3],
  ["Midtown Campus", "Uptown Heights", 2.7],
  ["Midtown Campus", "North Industrial Zone", 4.4],
  ["North Industrial Zone", "Suburban Outskirts", 4.6],
  ["Uptown Heights", "Suburban Outskirts", 3.9],
  ["Southport Harbor", "Eastside Residential", 3.5],
  ["Southport Harbor", "Westside Business District", 4.2],
];

function buildGraph(
  segments: TrafficSegment[],
): Map<string, Array<{ to: string; dist: number; weight: number }>> {
  // Compute average congestion per district
  const districtCongestion = new Map<string, number>();
  const districtCount = new Map<string, number>();
  for (const seg of segments) {
    const prev = districtCongestion.get(seg.district) ?? 0;
    const count = districtCount.get(seg.district) ?? 0;
    districtCongestion.set(seg.district, prev + Number(seg.congestionPct));
    districtCount.set(seg.district, count + 1);
  }
  for (const [district, total] of districtCongestion) {
    districtCongestion.set(
      district,
      total / (districtCount.get(district) ?? 1),
    );
  }

  const graph = new Map<
    string,
    Array<{ to: string; dist: number; weight: number }>
  >();
  for (const [a, b, dist] of DISTRICT_ADJACENCY) {
    const congA = districtCongestion.get(a) ?? 30;
    const congB = districtCongestion.get(b) ?? 30;
    const avgCong = (congA + congB) / 2;
    // Weight = distance + congestion penalty (heavy traffic adds up to 3x time)
    const congestionFactor = 1 + (avgCong / 100) * 2;
    const weight = dist * congestionFactor;

    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a)!.push({ to: b, dist, weight });
    graph.get(b)!.push({ to: a, dist, weight });
  }
  return graph;
}

function dijkstra(
  graph: Map<string, Array<{ to: string; dist: number; weight: number }>>,
  from: string,
  to: string,
): { path: string[]; totalDist: number; totalWeight: number } | null {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const rawDist = new Map<string, number>();
  const unvisited = new Set<string>();

  const INF = Number.POSITIVE_INFINITY;

  for (const node of graph.keys()) {
    dist.set(node, INF);
    rawDist.set(node, INF);
    prev.set(node, null);
    unvisited.add(node);
  }
  dist.set(from, 0);
  rawDist.set(from, 0);

  while (unvisited.size > 0) {
    // Pick unvisited node with min dist
    let u: string | null = null;
    let minDist = INF;
    for (const node of unvisited) {
      const d = dist.get(node) ?? INF;
      if (d < minDist) {
        minDist = d;
        u = node;
      }
    }
    if (u === null || u === to) break;
    unvisited.delete(u);

    const neighbors = graph.get(u) ?? [];
    for (const { to: v, dist: vDist, weight } of neighbors) {
      if (!unvisited.has(v)) continue;
      const alt = (dist.get(u) ?? INF) + weight;
      if (alt < (dist.get(v) ?? INF)) {
        dist.set(v, alt);
        rawDist.set(v, (rawDist.get(u) ?? 0) + vDist);
        prev.set(v, u);
      }
    }
  }

  if ((dist.get(to) ?? INF) === INF) return null;

  // Reconstruct path
  const path: string[] = [];
  let cur: string | null = to;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev.get(cur) ?? null;
  }

  return {
    path,
    totalDist: rawDist.get(to) ?? 0,
    totalWeight: dist.get(to) ?? 0,
  };
}

// ─── AI Reasoning Generator ────────────────────────────────────────────────────

function generateReasoning(
  path: string[],
  totalDist: number,
  estimatedMinutes: number,
  segments: TrafficSegment[],
  from: string,
  to: string,
): string {
  const districtCongestion = new Map<string, number>();
  const districtCount = new Map<string, number>();
  for (const seg of segments) {
    districtCongestion.set(
      seg.district,
      (districtCongestion.get(seg.district) ?? 0) + Number(seg.congestionPct),
    );
    districtCount.set(seg.district, (districtCount.get(seg.district) ?? 0) + 1);
  }
  const avgForDistrict = (d: string) => {
    const total = districtCongestion.get(d) ?? 0;
    const count = districtCount.get(d) ?? 1;
    return total / count;
  };

  const overallCong =
    path.reduce((acc, d) => acc + avgForDistrict(d), 0) / path.length;
  const congDesc =
    overallCong >= 70 ? "heavy" : overallCong >= 40 ? "moderate" : "light";
  const hops = path.length - 1;
  const via = path.slice(1, -1);
  const viaStr = via.length > 0 ? ` via ${via.join(" → ")}` : " direct";

  const avoidedDistricts = ALL_DISTRICTS.filter(
    (d) => !path.includes(d) && avgForDistrict(d) > 60,
  );
  const avoidedStr =
    avoidedDistricts.length > 0
      ? ` Congested zones ${avoidedDistricts.slice(0, 2).join(" and ")} were avoided.`
      : "";

  return `Optimal path from ${from} to ${to}${viaStr} covers ${totalDist.toFixed(1)} km across ${hops} transit corridor${hops !== 1 ? "s" : ""}. Overall congestion along this route is ${congDesc} (avg ${overallCong.toFixed(0)}%), yielding an estimated travel time of ${estimatedMinutes} minutes.${avoidedStr} Pathfinding selected this corridor using Dijkstra's algorithm with real-time congestion weighting.`;
}

// ─── Local Dijkstra Route Computation ─────────────────────────────────────────
// Computes optimal route entirely on the frontend — no backend needed.

export function computeLocalOptimalRoute(
  from: string,
  to: string,
  segments: TrafficSegment[] = FALLBACK_SEGMENTS,
): Route {
  const graph = buildGraph(segments);
  const result = dijkstra(graph, from, to);

  if (!result) {
    // Fallback: direct two-segment route
    const fromSeg = segments.find((s) => s.district === from);
    const toSeg = segments.find((s) => s.district === to);
    const waypoints = [fromSeg?.name ?? from, toSeg?.name ?? to];
    const dist = 6.5;
    const mins = Math.round(dist / 0.5);
    return {
      id: `local-route-${Date.now()}`,
      name: `${from} → ${to} Express`,
      fromDistrict: from,
      toDistrict: to,
      segments: waypoints,
      totalDistance: dist,
      estimatedMinutes: BigInt(mins),
      isOptimal: true,
      reasoning: `Direct corridor from ${from} to ${to}. No intermediate districts. Estimated ${mins} minutes under current conditions.`,
    };
  }

  const { path, totalDist } = result;

  // Map district waypoints to segment names for display
  const waypointNames: string[] = path.map((district) => {
    const segsForDistrict = segments.filter((s) => s.district === district);
    if (!segsForDistrict.length) return district;
    // Pick the segment with lowest congestion
    const best = segsForDistrict.reduce((a, b) =>
      Number(a.congestionPct) <= Number(b.congestionPct) ? a : b,
    );
    return best.name;
  });

  // Estimate travel time: base time from distance + congestion delays
  const avgCong =
    path.reduce((acc, d) => {
      const segs = segments.filter((s) => s.district === d);
      if (!segs.length) return acc + 40;
      const avg =
        segs.reduce((s, seg) => s + Number(seg.congestionPct), 0) / segs.length;
      return acc + avg;
    }, 0) / path.length;

  // ~40 km/h base speed, congestion slows to 15 km/h at 100% congestion
  const effectiveSpeed = 40 - (avgCong / 100) * 25;
  const estimatedMinutes = Math.max(
    3,
    Math.round((totalDist / effectiveSpeed) * 60),
  );

  const reasoning = generateReasoning(
    path,
    totalDist,
    estimatedMinutes,
    segments,
    from,
    to,
  );

  return {
    id: `local-route-${Date.now()}`,
    name: `${from} → ${to} Optimal`,
    fromDistrict: from,
    toDistrict: to,
    segments: waypointNames,
    totalDistance: Math.round(totalDist * 10) / 10,
    estimatedMinutes: BigInt(estimatedMinutes),
    isOptimal: true,
    reasoning,
  };
}

// ─── API Wrappers ───────────────────────────────────────────────────────────────

export async function getTrafficSnapshot(
  actor: BackendActor,
): Promise<TrafficSnapshot> {
  return actor.getTrafficSnapshot();
}

export async function getSegments(
  actor: BackendActor | null,
): Promise<TrafficSegment[]> {
  if (!actor) return FALLBACK_SEGMENTS;
  try {
    const result = await actor.getSegments();
    if (result && result.length > 0) return result;
    console.warn("getSegments: empty result, using fallback segments");
    return FALLBACK_SEGMENTS;
  } catch (err) {
    console.warn(
      "getSegments: backend unavailable, using fallback segments",
      err,
    );
    return FALLBACK_SEGMENTS;
  }
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
  actor: BackendActor | null,
  from: string,
  to: string,
  segments: TrafficSegment[] = FALLBACK_SEGMENTS,
): Promise<Route> {
  // Try backend first; always fall back to local Dijkstra
  if (actor) {
    try {
      const result = await actor.computeOptimalRoute(from, to);
      if (result) return result;
      console.warn(
        "computeOptimalRoute: backend returned null, using local fallback",
      );
    } catch (err) {
      console.warn(
        "computeOptimalRoute: backend unavailable, using local Dijkstra",
        err,
      );
    }
  }
  return computeLocalOptimalRoute(from, to, segments);
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

// ─── Local Simulation Helper ────────────────────────────────────────────────────
// Creates a realistic EmergencyAlert entirely on the frontend — no backend needed.
// Call this first for instant UI feedback, then optionally sync to backend.

const VEHICLE_PRIORITIES: Record<string, number> = {
  Ambulance: 9,
  "Fire Truck": 8,
  Police: 7,
  Hazmat: 10,
};

const VEHICLE_DESCRIPTIONS: Record<string, (segmentName: string) => string> = {
  Ambulance: (s) =>
    `Emergency medical unit responding to a critical incident on ${s}. All cross-traffic suspended. AI-guided corridor cleared for priority passage.`,
  "Fire Truck": (s) =>
    `Fire apparatus dispatched to active emergency on ${s}. Signal preemption active. Intersection clearance in progress along response corridor.`,
  Police: (s) =>
    `Law enforcement unit responding at high speed through ${s}. Traffic control adjusted. Bystanders advised to yield immediately.`,
  Hazmat: (s) =>
    `Hazardous materials vehicle detected on ${s}. Maximum priority corridor engaged. Civilian traffic rerouted to secondary streets.`,
};

const VEHICLE_ACTIONS: Record<string, string> = {
  Ambulance:
    "Clear all lanes on primary corridor immediately. Activate preemptive green wave. Dispatch traffic control officers to manual override positions.",
  "Fire Truck":
    "Suspend all opposing signals for 90 seconds. Broadcast public alert via city PA system. Prepare secondary access route as fallback.",
  Police:
    "Enable dynamic signal override mode. Restrict civilian access to affected blocks. Coordinate with central dispatch for route clearance.",
  Hazmat:
    "Activate full perimeter containment protocol. Reroute all civilian traffic minimum 3 blocks. Alert hazmat response team for standing by.",
};

export function createLocalEmergencyAlert(
  segmentId: string,
  vehicleType: string,
  segmentName?: string,
): EmergencyAlert {
  const name = segmentName ?? segmentId;
  const priority = VEHICLE_PRIORITIES[vehicleType] ?? 7;
  const descFn =
    VEHICLE_DESCRIPTIONS[vehicleType] ??
    ((s: string) =>
      `Emergency vehicle deployed to ${s}. Priority corridor active.`);
  const action =
    VEHICLE_ACTIONS[vehicleType] ??
    "Clear affected corridor and coordinate with emergency services immediately.";

  return {
    id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    segmentId,
    vehicleType,
    priority: BigInt(priority),
    description: descFn(name),
    triggeredAt: BigInt(Date.now()),
    isActive: true,
    recommendedAction: action,
  };
}

export async function resetSimulation(actor: BackendActor): Promise<void> {
  return actor.resetSimulation();
}
