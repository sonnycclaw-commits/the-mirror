import { create } from 'zustand'

interface SimulationState {
  chaos: number
  suction: number
  setChaos: (value: number) => void
  setSuction: (value: number) => void
  reset: () => void
}

export const useSimulation = create<SimulationState>((set) => ({
  chaos: 0,
  suction: 0,
  setChaos: (value) => set({ chaos: value }),
  setSuction: (value) => set({ suction: value }),
  reset: () => set({ chaos: 0, suction: 0 })
}))
