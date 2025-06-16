import { create } from 'zustand'
import { UserSettings, Snapshot, DailyBudgetCalculation } from '@/types'

interface AppStore {
  userSettings: UserSettings | null
  snapshots: Snapshot[]
  dailyBudget: DailyBudgetCalculation | null
  setUserSettings: (settings: UserSettings) => void
  setSnapshots: (snapshots: Snapshot[]) => void
  setDailyBudget: (budget: DailyBudgetCalculation) => void
  addSnapshot: (snapshot: Snapshot) => void
}

export const useAppStore = create<AppStore>((set) => ({
  userSettings: null,
  snapshots: [],
  dailyBudget: null,
  setUserSettings: (userSettings) => set({ userSettings }),
  setSnapshots: (snapshots) => set({ snapshots }),
  setDailyBudget: (dailyBudget) => set({ dailyBudget }),
  addSnapshot: (snapshot) =>
    set((state) => ({ snapshots: [...state.snapshots, snapshot] })),
}))
