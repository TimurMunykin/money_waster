import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Flag,
} from '@mui/icons-material'
import { useDailyBudget } from '@/hooks/useDailyBudget'
import { useGoalStore } from '@/stores/goalStore'
import DailyBudgetCard from '@/components/DailyBudgetCard'
import QuickActions from '@/components/QuickActions'
import RecentTransactions from '@/components/RecentTransactions'

const Dashboard = () => {
  const dailyBudget = useDailyBudget()
  const { goals } = useGoalStore()

  const activeGoals = goals.filter(g => g.is_active)

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'primary'
  }: {
    title: string
    value: string
    icon: typeof TrendingUp
    color?: 'primary' | 'secondary' | 'success' | 'error'
  }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Box>
          <Icon color={color} fontSize="large" />
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Главная панель
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DailyBudgetCard budget={dailyBudget} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Текущий баланс"
            value={`${dailyBudget.total_balance.toFixed(0)} ₽`}
            icon={AccountBalance}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ежедневный доход"
            value={`${dailyBudget.daily_income.toFixed(0)} ₽`}
            icon={TrendingUp}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ежедневные расходы"
            value={`${dailyBudget.daily_expenses.toFixed(0)} ₽`}
            icon={TrendingDown}
            color="error"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Активные цели"
            value={activeGoals.length.toString()}
            icon={Flag}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <QuickActions />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Активные цели
            </Typography>
            {activeGoals.length === 0 ? (
              <Typography color="textSecondary">
                Нет активных целей
              </Typography>
            ) : (
              <Box>
                {activeGoals.slice(0, 3).map((goal) => {
                  const progress = 30
                  return (
                    <Box key={goal.id} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{goal.name}</Typography>
                        <Typography variant="body2">
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {goal.target_amount.toFixed(0)} ₽ до {new Date(goal.target_date).toLocaleDateString('ru')}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <RecentTransactions />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
