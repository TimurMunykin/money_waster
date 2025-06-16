import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { GoalContribution } from '@/types'

export const useGoalContributions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addContribution = async (
    goalId: string,
    transactionId: string,
    amount: number,
    contributionDate: string
  ) => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('goal_contributions')
      .insert({
        goal_id: goalId,
        transaction_id: transactionId,
        amount,
        contribution_date: contributionDate,
        user_id: '00000000-0000-0000-0000-000000000000'
      })
      .select()

    setLoading(false)

    if (error) {
      setError(error.message)
      return null
    }

    return data?.[0] as GoalContribution
  }

  const removeContribution = async (contributionId: string) => {
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('goal_contributions')
      .delete()
      .eq('id', contributionId)

    setLoading(false)

    if (error) {
      setError(error.message)
      return false
    }

    return true
  }

  const getGoalContributions = async (goalId: string) => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('goal_contributions')
      .select('*')
      .eq('goal_id', goalId)
      .order('contribution_date', { ascending: false })

    setLoading(false)

    if (error) {
      setError(error.message)
      return []
    }

    return data as GoalContribution[]
  }

  return {
    loading,
    error,
    addContribution,
    removeContribution,
    getGoalContributions,
  }
}
