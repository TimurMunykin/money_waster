import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'
import { Transaction } from '@/types'
import { useTransactions } from '@/hooks/useTransactions'
import TransactionDialog from '@/components/TransactionDialog'
import dayjs from 'dayjs'

const Transactions = () => {
  const { transactions, categories, deleteTransaction } = useTransactions()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Без категории'
  }

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setTransactionType(type)
    setEditingTransaction(null)
    setDialogOpen(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setTransactionType(transaction.type)
    setDialogOpen(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Удалить эту транзакцию?')) {
      await deleteTransaction(id)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                         getCategoryName(transaction.category_id).toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || transaction.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Транзакции</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="success"
            startIcon={<TrendingUp />}
            onClick={() => handleAddTransaction('income')}
          >
            Доход
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<TrendingDown />}
            onClick={() => handleAddTransaction('expense')}
          >
            Расход
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Тип</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Тип"
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="income">Доходы</MenuItem>
              <MenuItem value="expense">Расходы</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell align="right">Сумма</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {dayjs(transaction.date).format('DD.MM.YYYY')}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {transaction.description}
                    {transaction.is_regular && (
                      <Chip
                        label="Регулярная"
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{getCategoryName(transaction.category_id)}</TableCell>
                <TableCell>
                  <Chip
                    icon={transaction.type === 'income' ? <TrendingUp /> : <TrendingDown />}
                    label={transaction.type === 'income' ? 'Доход' : 'Расход'}
                    color={transaction.type === 'income' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(0)} ₽
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => void handleDeleteTransaction(transaction.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        type={transactionType}
        transaction={editingTransaction || undefined}
      />
    </Box>
  )
}

export default Transactions
