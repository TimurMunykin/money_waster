import {
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material'
import { DailyBudgetCalculation } from '@/types'

interface DailyBudgetCardProps {
  budget: DailyBudgetCalculation
}

const DailyBudgetCard = ({ budget }: DailyBudgetCardProps) => {
  const theme = useTheme()

  const getBudgetColor = (amount: number) => {
    if (amount > 1000) return theme.palette.success.main
    if (amount > 500) return theme.palette.warning.main
    return theme.palette.error.main
  }

  const budgetColor = getBudgetColor(budget.available_daily)

  return (
    <Paper
      sx={{
        p: 3,
        background: `linear-gradient(45deg, ${budgetColor}15, ${budgetColor}05)`,
        border: `2px solid ${budgetColor}30`,
      }}
    >
      <Box textAlign="center">
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Доступно на сегодня
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: budgetColor,
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          {budget.available_daily.toFixed(0)} ₽
        </Typography>

        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
          <Chip
            label={`Баланс: ${budget.total_balance.toFixed(0)} ₽`}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`Доход/день: +${budget.daily_income.toFixed(0)} ₽`}
            variant="outlined"
            size="small"
            color="success"
          />
          <Chip
            label={`Расходы/день: -${budget.daily_expenses.toFixed(0)} ₽`}
            variant="outlined"
            size="small"
            color="error"
          />
          <Chip
            label={`На цели: -${budget.goals_allocation.toFixed(0)} ₽`}
            variant="outlined"
            size="small"
            color="secondary"
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default DailyBudgetCard
