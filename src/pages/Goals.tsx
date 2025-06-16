import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow,
  Pause,
} from '@mui/icons-material'
import { Goal } from '@/types'
import { useGoals } from '@/hooks/useGoals'
import GoalDialog from '@/components/GoalDialog'
import dayjs from 'dayjs'

const Goals = () => {
  const { goals, updateGoal, deleteGoal } = useGoals()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const handleAddGoal = () => {
    setEditingGoal(null)
    setDialogOpen(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setDialogOpen(true)
  }

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Удалить эту цель?')) {
      await deleteGoal(id)
    }
  }

  const handleToggleActive = async (goal: Goal) => {
    await updateGoal(goal.id, { is_active: !goal.is_active })
  }

  const getGoalProgress = (goal: Goal) => {
    if (goal.target_amount <= 0) return 0
    const currentAmount = goal.current_amount || 0
    const progress = Math.min(100, (currentAmount / goal.target_amount) * 100)
    return Math.round(progress)
  }

  const getDaysRemaining = (targetDate: string) => {
    const days = dayjs(targetDate).diff(dayjs(), 'day')
    return Math.max(0, days)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Финансовые цели</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddGoal}
        >
          Новая цель
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                У вас пока нет финансовых целей
              </Typography>
              <Typography color="textSecondary" mb={2}>
                Создайте свою первую цель, чтобы начать планировать финансы
              </Typography>
              <Button variant="contained" onClick={handleAddGoal}>
                Создать первую цель
              </Button>
            </Paper>
          </Grid>
        ) : (
          goals.map((goal) => {
            const progress = getGoalProgress(goal)
            const daysRemaining = getDaysRemaining(goal.target_date)
            const currentAmount = goal.current_amount || 0
            const remainingAmount = goal.target_amount - currentAmount

            return (
              <Grid item xs={12} md={6} lg={4} key={goal.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: goal.is_active ? 1 : 0.7,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" component="div">
                        {goal.name}
                      </Typography>
                      <Box display="flex" gap={0.5}>
                        {!goal.is_active && (
                          <Chip label="Неактивная" size="small" color="default" />
                        )}
                        {goal.include_in_budget && (
                          <Chip label="В бюджете" size="small" color="primary" />
                        )}
                      </Box>
                    </Box>

                    {goal.description && (
                      <Typography variant="body2" color="textSecondary" mb={2}>
                        {goal.description}
                      </Typography>
                    )}

                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          {currentAmount.toFixed(0)} ₽ из {goal.target_amount.toFixed(0)} ₽
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="textSecondary">
                        {daysRemaining} дней осталось
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        до {dayjs(goal.target_date).format('DD.MM.YYYY')}
                      </Typography>
                    </Box>

                    {remainingAmount > 0 && (
                      <Typography variant="body2" color="primary" mt={1}>
                        Осталось накопить: {remainingAmount.toFixed(0)} ₽
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => void handleToggleActive(goal)}
                      startIcon={goal.is_active ? <Pause /> : <PlayArrow />}
                    >
                      {goal.is_active ? 'Приостановить' : 'Активировать'}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => void handleDeleteGoal(goal.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            )
          })
        )}
      </Grid>

      <GoalDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        goal={editingGoal || undefined}
      />
    </Box>
  )
}

export default Goals
