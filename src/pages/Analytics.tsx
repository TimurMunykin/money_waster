import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useTransactionStore } from '@/stores/transactionStore'
import dayjs from 'dayjs'

const Analytics = () => {
  const { transactions, categories } = useTransactionStore()

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = dayjs().subtract(29 - i, 'day')
    const dayTransactions = transactions.filter(t =>
      dayjs(t.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    )

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      date: date.format('DD.MM'),
      income,
      expenses,
      balance: income - expenses,
    }
  })

  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const categoryExpenses = transactions
        .filter(t => t.type === 'expense' && t.category_id === category.id)
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        name: category.name,
        value: categoryExpenses,
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Аналитика
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Общая статистика
            </Typography>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Общий доход
              </Typography>
              <Typography variant="h6" color="success.main" gutterBottom>
                +{totalIncome.toFixed(0)} ₽
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Общие расходы
              </Typography>
              <Typography variant="h6" color="error.main" gutterBottom>
                -{totalExpenses.toFixed(0)} ₽
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Баланс
              </Typography>
              <Typography
                variant="h6"
                color={totalIncome - totalExpenses >= 0 ? 'success.main' : 'error.main'}
              >
                {(totalIncome - totalExpenses >= 0 ? '+' : '')}{(totalIncome - totalExpenses).toFixed(0)} ₽
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Динамика за последние 30 дней
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(0)} ₽`} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#4caf50"
                  name="Доходы"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f44336"
                  name="Расходы"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#2196f3"
                  name="Баланс"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Расходы по категориям
            </Typography>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(0)} ₽`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary">
                Нет данных для отображения
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Топ категорий расходов
            </Typography>
            {expensesByCategory.length > 0 ? (
              <Box>
                {expensesByCategory.slice(0, 5).map((category, index) => (
                  <Box key={category.name} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: COLORS[index % COLORS.length],
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">{category.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {category.value.toFixed(0)} ₽
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">
                Нет данных для отображения
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
