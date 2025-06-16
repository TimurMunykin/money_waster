export interface Transaction {
  id: string
  amount: number
  description: string
  category_id: string
  type: 'income' | 'expense'
  date: string
  is_regular: boolean
  regular_interval?: RegularInterval
  created_at: string
  updated_at: string
}

export interface RegularInterval {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  frequency: number
  next_occurrence: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number | null
  target_date: string
  description?: string
  is_active: boolean
  include_in_budget: boolean
  category_filters: string[]
  created_at: string
  updated_at: string
}

export interface GoalContribution {
  id: string
  user_id: string
  goal_id: string
  transaction_id: string
  amount: number
  contribution_date: string
  created_at: string
  updated_at: string
}

export interface Snapshot {
  id: string
  date: string
  time: 'morning' | 'evening'
  current_balance: number
  daily_limit: number
  goals_progress: GoalProgress[]
  created_at: string
}

export interface GoalProgress {
  goal_id: string
  current_amount: number
  remaining_amount: number
  progress_percentage: number
}

export interface UserSettings {
  id: string
  currency: string
  snapshot_frequency: 'daily' | 'twice_daily'
  snapshot_times: string[]
  default_categories: boolean
  created_at: string
  updated_at: string
}

export interface DailyBudgetCalculation {
  total_balance: number
  daily_income: number
  daily_expenses: number
  goals_allocation: number
  available_daily: number
}
