import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { Goal } from '@/types'
import { useGoals } from '@/hooks/useGoals'

interface GoalDialogProps {
  open: boolean
  onClose: () => void
  goal?: Goal
}

const GoalDialog = ({ open, onClose, goal }: GoalDialogProps) => {
  const { createGoal, updateGoal } = useGoals()
  const [name, setName] = useState(goal?.name || '')
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() || '')
  const [targetDate, setTargetDate] = useState<Dayjs>(dayjs(goal?.target_date || new Date()).add(1, 'month'))
  const [description, setDescription] = useState(goal?.description || '')
  const [isActive, setIsActive] = useState(goal?.is_active ?? true)
  const [includeInBudget, setIncludeInBudget] = useState(goal?.include_in_budget ?? true)

  const handleSubmit = async () => {
    if (!name || !targetAmount || !targetDate) return

    const goalData = {
      name,
      target_amount: parseFloat(targetAmount),
      target_date: targetDate.format('YYYY-MM-DD'),
      description,
      is_active: isActive,
      include_in_budget: includeInBudget,
      category_filters: [],
    }

    if (goal) {
      await updateGoal(goal.id, goalData)
    } else {
      await createGoal(goalData)
    }

    handleClose()
  }

  const handleClose = () => {
    setName('')
    setTargetAmount('')
    setTargetDate(dayjs().add(1, 'month'))
    setDescription('')
    setIsActive(true)
    setIncludeInBudget(true)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {goal ? 'Редактировать цель' : 'Новая финансовая цель'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Название цели"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Поездка в Италию"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Целевая сумма"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              InputProps={{ endAdornment: '₽' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Дата достижения"
              value={targetDate}
              onChange={(newValue) => newValue && setTargetDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              minDate={dayjs().add(1, 'day')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание (необязательно)"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительная информация о цели"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Активная цель"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={includeInBudget}
                  onChange={(e) => setIncludeInBudget(e.target.checked)}
                />
              }
              label="Учитывать при расчёте ежедневного бюджета"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          onClick={() => void handleSubmit()}
          variant="contained"
          disabled={!name || !targetAmount || !targetDate}
        >
          {goal ? 'Сохранить' : 'Создать цель'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GoalDialog
