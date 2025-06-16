import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useTransactionStore } from '@/stores/transactionStore'
import { useGoalStore } from '@/stores/goalStore'
import { DailyBudgetCalculation } from '@/types'

export const useDailyBudget = (): DailyBudgetCalculation => {
  const { transactions } = useTransactionStore()
  const { goals } = useGoalStore()

  return useMemo(() => {
    const today = dayjs()
    const currentMonth = today.format('YYYY-MM')

    const monthlyTransactions = transactions.filter(t =>
      dayjs(t.date).format('YYYY-MM') === currentMonth
    )

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = totalIncome - totalExpenses

    const regularIncomeDaily = transactions
      .filter(t => t.type === 'income' && t.is_regular)
      .reduce((sum, t) => {
        if (t.regular_interval?.type === 'daily') {
          return sum + (t.amount / t.regular_interval.frequency)
        }
        if (t.regular_interval?.type === 'monthly') {
          return sum + (t.amount / (t.regular_interval.frequency * 30))
        }
        return sum
      }, 0)

    const regularExpensesDaily = transactions
      .filter(t => t.type === 'expense' && t.is_regular)
      .reduce((sum, t) => {
        if (t.regular_interval?.type === 'daily') {
          return sum + (t.amount / t.regular_interval.frequency)
        }
        if (t.regular_interval?.type === 'monthly') {
          return sum + (t.amount / (t.regular_interval.frequency * 30))
        }
        return sum
      }, 0)

    const activeGoals = goals.filter(g => g.is_active && g.include_in_budget)
    const goalsAllocation = activeGoals.reduce((sum, goal) => {
      const daysUntilTarget = dayjs(goal.target_date).diff(today, 'day')
      if (daysUntilTarget > 0) {
        const currentProgress = goal.target_amount * 0.1
        const remaining = goal.target_amount - currentProgress
        return sum + (remaining / daysUntilTarget)
      }
      return sum
    }, 0)

    const availableDaily = Math.max(0,
      currentBalance / 30 + regularIncomeDaily - regularExpensesDaily - goalsAllocation
    )

    return {
      total_balance: currentBalance,
      daily_income: regularIncomeDaily,
      daily_expenses: regularExpensesDaily,
      goals_allocation: goalsAllocation,
      available_daily: availableDaily,
    }
  }, [transactions, goals])
}
