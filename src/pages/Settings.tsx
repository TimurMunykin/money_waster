import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material'

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Основные настройки
            </Typography>

            <Box component="form" sx={{ '& > :not(style)': { mb: 2 } }}>
              <FormControl fullWidth>
                <InputLabel>Валюта</InputLabel>
                <Select
                  defaultValue="RUB"
                  label="Валюта"
                >
                  <MenuItem value="RUB">Российский рубль (₽)</MenuItem>
                  <MenuItem value="USD">Доллар США ($)</MenuItem>
                  <MenuItem value="EUR">Евро (€)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Часовой пояс"
                defaultValue="Europe/Moscow"
                disabled
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Снимки данных
            </Typography>

            <Box component="form" sx={{ '& > :not(style)': { mb: 2 } }}>
              <FormControl fullWidth>
                <InputLabel>Частота снимков</InputLabel>
                <Select
                  defaultValue="daily"
                  label="Частота снимков"
                >
                  <MenuItem value="daily">Один раз в день</MenuItem>
                  <MenuItem value="twice_daily">Два раза в день</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Время утреннего снимка"
                type="time"
                defaultValue="09:00"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                label="Время вечернего снимка"
                type="time"
                defaultValue="21:00"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Категории по умолчанию
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Здесь вы можете управлять категориями доходов и расходов
            </Typography>

            <Button variant="outlined" sx={{ mr: 1 }}>
              Управление категориями
            </Button>
            <Button variant="outlined">
              Сбросить к стандартным
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined">
              Отменить
            </Button>
            <Button variant="contained">
              Сохранить настройки
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings
