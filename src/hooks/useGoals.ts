import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Goal } from '@/types'
import { useGoalStore } from '@/stores/goalStore'

export const useGoals = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { goals, setGoals } = useGoalStore()

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      setError(error.message)
    } else {
      setGoals((data as Goal[]) || [])
    }
    setLoading(false)
  }, [setGoals])

  const createGoal = async (goal: Omit<Goal, 'id' | 'current_amount' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('goals')
      .insert({
        ...goal,
        current_amount: 0,
        user_id: '00000000-0000-0000-0000-000000000000'
      })
      .select()

    if (error) {
      setError(error.message)
    } else if (data?.[0]) {
      useGoalStore.getState().addGoal(data[0] as Goal)
    }
    setLoading(false)
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    setLoading(true)
    const { error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      useGoalStore.getState().updateGoal(id, updates)
    }
    setLoading(false)
  }

  const deleteGoal = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      useGoalStore.getState().deleteGoal(id)
    }
    setLoading(false)
  }

  useEffect(() => {
    void fetchGoals()
  }, [fetchGoals])

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  }
}
