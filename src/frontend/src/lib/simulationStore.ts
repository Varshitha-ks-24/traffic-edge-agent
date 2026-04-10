import type { backendInterface } from "@/backend";
import type { TrafficSnapshot } from "@/types/traffic";
import { create } from "zustand";

interface SimulationState {
  snapshot: TrafficSnapshot | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  actor: backendInterface | null;
  setActor: (actor: backendInterface) => void;
  fetchSnapshot: () => Promise<void>;
  tick: () => Promise<void>;
  resetSim: () => Promise<void>;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  snapshot: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  actor: null,

  setActor: (actor) => {
    set({ actor });
  },

  fetchSnapshot: async () => {
    const { actor } = get();
    if (!actor) return;
    set({ isLoading: true, error: null });
    try {
      const snapshot = await actor.getTrafficSnapshot();
      set({ snapshot, isLoading: false, lastUpdated: new Date() });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fetch failed";
      set({ error: message, isLoading: false });
    }
  },

  tick: async () => {
    const { actor, fetchSnapshot } = get();
    if (!actor) return;
    try {
      await actor.simulateTick();
      await fetchSnapshot();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Tick failed";
      set({ error: message });
    }
  },

  resetSim: async () => {
    const { actor, fetchSnapshot } = get();
    if (!actor) return;
    try {
      await actor.resetSimulation();
      await fetchSnapshot();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed";
      set({ error: message });
    }
  },
}));
