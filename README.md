# Money Waster - Personal Finance Management App

A modern React TypeScript application for personal finance management with daily budget calculation, transaction tracking, and goal setting.

## Features

- **Daily Budget Calculation**: Automatically calculates available daily spending based on income, expenses, and financial goals
- **Transaction Management**: Add, edit, and track income and expenses with categories
- **Goal Setting**: Create and track financial goals with progress visualization
- **Analytics**: Visual charts and reports for financial insights
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Material-UI (MUI) + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Date Handling**: Day.js

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/money-waster.git
cd money-waster
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL from `supabase_migrations.sql` in your Supabase SQL editor
   - This will create all necessary tables, RLS policies, and default categories

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

## Database Schema

The application uses the following main tables:

- **categories**: Income and expense categories
- **transactions**: All financial transactions
- **goals**: Financial goals with targets and dates
- **snapshots**: Daily financial data snapshots
- **user_settings**: User preferences and settings

## Key Features

### Daily Budget Calculation
The app calculates your available daily spending based on:
- Current balance
- Regular income and expenses
- Active financial goals
- Time remaining until goal deadlines

### Transaction Management
- Add one-time or recurring transactions
- Categorize income and expenses
- Track transaction history
- Filter and search transactions

### Goal Setting
- Set financial goals with target amounts and dates
- Track progress with visual indicators
- Include/exclude goals from budget calculations
- Manage multiple goals simultaneously

### Analytics
- View spending trends over time
- Analyze expenses by category
- Track progress toward financial goals
- Visual charts and reports

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── stores/        # Zustand stores
├── types/         # TypeScript type definitions
├── lib/           # Utility libraries
└── theme.ts       # MUI theme configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.