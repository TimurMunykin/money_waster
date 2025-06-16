import { create } from 'zustand'
import { Goal, GoalProgress } from '@/types'

interface GoalStore {
  goals: Goal[]
  goalsProgress: GoalProgress[]
  setGoals: (goals: Goal[]) => void
  setGoalsProgress: (progress: GoalProgress[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  toggleGoalActive: (id: string) => void
  toggleGoalInBudget: (id: string) => void
}

export const useGoalStore = create<GoalStore>((set) => ({
  goals: [],
  goalsProgress: [],
  setGoals: (goals) => set({ goals }),
  setGoalsProgress: (goalsProgress) => set({ goalsProgress }),
  addGoal: (goal) =>
    set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, goal) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...goal } : g
      ),
    })),
  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
  toggleGoalActive: (id) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, is_active: !g.is_active } : g
      ),
    })),
  toggleGoalInBudget: (id) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, include_in_budget: !g.include_in_budget } : g
      ),
    })),
}))
