import { useState } from 'react'
import {
  Paper,
  Typography,
  Button,
  Grid,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Flag,
} from '@mui/icons-material'
import TransactionDialog from '@/components/TransactionDialog'
import GoalDialog from '@/components/GoalDialog'

const QuickActions = () => {
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)

  const handleAddIncome = () => {
    setTransactionType('income')
    setTransactionDialogOpen(true)
  }

  const handleAddExpense = () => {
    setTransactionType('expense')
    setTransactionDialogOpen(true)
  }

  const handleAddGoal = () => {
    setGoalDialogOpen(true)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Быстрые действия
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<TrendingUp />}
            onClick={handleAddIncome}
            sx={{ py: 2 }}
          >
            Добавить доход
          </Button>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<TrendingDown />}
            onClick={handleAddExpense}
            sx={{ py: 2 }}
          >
            Добавить расход
          </Button>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<Flag />}
            onClick={handleAddGoal}
            sx={{ py: 2 }}
          >
            Новая цель
          </Button>
        </Grid>
      </Grid>

      <TransactionDialog
        open={transactionDialogOpen}
        onClose={() => setTransactionDialogOpen(false)}
        type={transactionType}
      />

      <GoalDialog
        open={goalDialogOpen}
        onClose={() => setGoalDialogOpen(false)}
      />
    </Paper>
  )
}

export default QuickActions
