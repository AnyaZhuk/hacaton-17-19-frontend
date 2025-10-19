// src/store/simulationStore.js
import { create } from 'zustand';
import { fetchSimulationStatus } from '../services/api';

const useSimulationStore = create((set) => ({
  isSimulationRunning: false,
  checkStatus: async () => {
    try {
      const status = await fetchSimulationStatus();
      set({ isSimulationRunning: status.is_running });
    } catch (error) {
      console.error("Failed to fetch simulation status:", error);
      set({ isSimulationRunning: false });
    }
  },
  start: () => set({ isSimulationRunning: true }),
  stop: () => set({ isSimulationRunning: false }),
}));

export default useSimulationStore;