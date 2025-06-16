import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'
import { useTransactionStore } from '@/stores/transactionStore'
import dayjs from 'dayjs'

const RecentTransactions = () => {
  const { transactions, categories } = useTransactionStore()

  const recentTransactions = transactions
    .slice(0, 5)
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Без категории'
  }

  if (recentTransactions.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Последние транзакции
        </Typography>
        <Typography color="textSecondary">
          Транзакций пока нет
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Последние транзакции
      </Typography>

      <List>
        {recentTransactions.map((transaction) => (
          <ListItem key={transaction.id} divider>
            <ListItemIcon>
              {transaction.type === 'income' ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1">
                    {transaction.description}
                  </Typography>
                  {transaction.is_regular && (
                    <Chip
                      label="Регулярная"
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                </Box>
              }
              secondary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    {getCategoryName(transaction.category_id)} • {dayjs(transaction.date).format('DD.MM.YYYY')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(0)} ₽
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default RecentTransactions
