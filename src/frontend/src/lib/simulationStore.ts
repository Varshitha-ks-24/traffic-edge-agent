import type { backendInterface } from "@/backend";
import { WeatherCondition } from "@/backend";
import type { Anomaly, Incident, TrafficSnapshot } from "@/types/traffic";
import { create } from "zustand";

interface SimulationState {
  snapshot: TrafficSnapshot | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  actor: backendInterface | null;
  incidents: Incident[];
  setActor: (actor: backendInterface) => void;
  fetchSnapshot: () => Promise<void>;
  tick: () => Promise<void>;
  resetSim: () => Promise<void>;
  addAnomalyToSnapshot: (anomaly: Anomaly) => void;
  addIncident: (incident: Incident) => void;
  setIncidents: (incidents: Incident[]) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  snapshot: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  actor: null,
  incidents: [],

  setActor: (actor) => {
    set({ actor });
  },

  fetchSnapshot: async () => {
    const { actor } = get();
    if (!actor) return;
    set({ isLoading: true });
    try {
      const snapshot = await actor.getTrafficSnapshot();
      set({ snapshot, isLoading: false, lastUpdated: new Date() });
    } catch (err) {
      // Silently catch backend errors (e.g. IC0508 canister stopped) — fallback data is used instead
      console.warn(
        "[simulationStore] fetchSnapshot failed:",
        err instanceof Error ? err.message : err,
      );
      set({ isLoading: false });
    }
  },

  tick: async () => {
    const { actor, fetchSnapshot } = get();
    if (!actor) return;
    try {
      await actor.simulateTick();
      await fetchSnapshot();
    } catch (err) {
      console.warn(
        "[simulationStore] tick failed:",
        err instanceof Error ? err.message : err,
      );
    }
  },

  resetSim: async () => {
    const { actor, fetchSnapshot } = get();
    if (!actor) return;
    try {
      await actor.resetSimulation();
      await fetchSnapshot();
    } catch (err) {
      console.warn(
        "[simulationStore] resetSim failed:",
        err instanceof Error ? err.message : err,
      );
    }
  },

  addAnomalyToSnapshot: (anomaly: Anomaly) => {
    const { snapshot } = get();
    if (snapshot) {
      set({
        snapshot: {
          ...snapshot,
          activeAnomalies: [anomaly, ...snapshot.activeAnomalies],
        },
      });
    } else {
      // Backend not yet loaded — bootstrap a minimal snapshot so the anomaly is visible in Anomalies page
      const stub: TrafficSnapshot = {
        activeAnomalies: [anomaly],
        activeEmergencies: [],
        segments: [],
        timestamp: BigInt(Date.now() * 1_000_000),
        systemHealth: BigInt(100),
        weather: {
          temperature: 22,
          windSpeed: 10,
          visibility: BigInt(8),
          condition: WeatherCondition.Clear,
          affectedDistricts: [],
          recommendation: "Normal conditions",
          updatedAt: BigInt(Date.now() * 1_000_000),
        },
      };
      set({ snapshot: stub });
    }
  },

  addIncident: (incident: Incident) => {
    set((state) => ({ incidents: [incident, ...state.incidents] }));
  },

  setIncidents: (incidents: Incident[]) => {
    set({ incidents });
  },
}));
