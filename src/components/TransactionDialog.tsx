import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { Transaction } from '@/types'
import { useTransactions } from '@/hooks/useTransactions'

interface TransactionDialogProps {
  open: boolean
  onClose: () => void
  type: 'income' | 'expense'
  transaction?: Transaction
}

const TransactionDialog = ({ open, onClose, type, transaction }: TransactionDialogProps) => {
  const { categories, createTransaction, updateTransaction } = useTransactions()
  const [amount, setAmount] = useState(transaction?.amount.toString() || '')
  const [description, setDescription] = useState(transaction?.description || '')
  const [categoryId, setCategoryId] = useState(transaction?.category_id || '')
  const [date, setDate] = useState<Dayjs>(dayjs(transaction?.date || new Date()))
  const [isRegular, setIsRegular] = useState(transaction?.is_regular || false)
  const [intervalType, setIntervalType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(transaction?.regular_interval?.type || 'monthly')
  const [frequency, setFrequency] = useState(transaction?.regular_interval?.frequency.toString() || '1')

  const availableCategories = categories.filter(c => c.type === type && c.is_active)

  const handleSubmit = async () => {
    if (!amount || !description || !categoryId) return

    const transactionData = {
      amount: parseFloat(amount),
      description,
      category_id: categoryId,
      type,
      date: date.format('YYYY-MM-DD'),
      is_regular: isRegular,
      regular_interval: isRegular ? {
        type: intervalType,
        frequency: parseInt(frequency),
        next_occurrence: date.add(parseInt(frequency), intervalType as 'day' | 'week' | 'month' | 'year').format('YYYY-MM-DD'),
      } : undefined,
    }

    if (transaction) {
      await updateTransaction(transaction.id, transactionData)
    } else {
      await createTransaction(transactionData)
    }

    handleClose()
  }

  const handleClose = () => {
    setAmount('')
    setDescription('')
    setCategoryId('')
    setDate(dayjs())
    setIsRegular(false)
    setIntervalType('monthly')
    setFrequency('1')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {transaction ? 'Редактировать' : 'Добавить'} {type === 'income' ? 'доход' : 'расход'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Сумма"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{ endAdornment: '₽' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Дата"
              value={date}
              onChange={(newValue) => newValue && setDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                label="Категория"
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isRegular}
                  onChange={(e) => setIsRegular(e.target.checked)}
                />
              }
              label="Регулярная транзакция"
            />
          </Grid>

          {isRegular && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Период</InputLabel>
                  <Select
                    value={intervalType}
                    onChange={(e) => setIntervalType(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                    label="Период"
                  >
                    <MenuItem value="daily">Дни</MenuItem>
                    <MenuItem value="weekly">Недели</MenuItem>
                    <MenuItem value="monthly">Месяцы</MenuItem>
                    <MenuItem value="yearly">Годы</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Частота"
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          onClick={() => void handleSubmit()}
          variant="contained"
          disabled={!amount || !description || !categoryId}
        >
          {transaction ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionDialog
