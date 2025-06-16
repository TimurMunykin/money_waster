-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  currency VARCHAR(3) DEFAULT 'RUB',
  snapshot_frequency VARCHAR(20) DEFAULT 'daily' CHECK (snapshot_frequency IN ('daily', 'twice_daily')),
  snapshot_times TEXT[] DEFAULT ARRAY['09:00', '21:00'],
  default_categories BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  target_date DATE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  include_in_budget BOOLEAN DEFAULT true,
  category_filters UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category_id UUID REFERENCES categories(id),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  date Date NOT NULL,
  is_regular BOOLEAN DEFAULT false,
  regular_interval JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snapshots table
CREATE TABLE snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL CHECK (time IN ('morning', 'evening')),
  current_balance DECIMAL(15,2) NOT NULL,
  daily_limit DECIMAL(15,2) NOT NULL,
  goals_progress JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, time)
);

-- Goal contributions table to track money allocated to goals
CREATE TABLE goal_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  contribution_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add current_amount field to goals table to track progress
ALTER TABLE goals ADD COLUMN current_amount DECIMAL(15,2) DEFAULT 0 NOT NULL;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all categories" ON categories FOR SELECT USING (true);

CREATE POLICY "Users can view own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own snapshots" ON snapshots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshots" ON snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own goal contributions" ON goal_contributions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goal contributions" ON goal_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, type) VALUES
  ('Зарплата', 'income'),
  ('Фриланс', 'income'),
  ('Инвестиции', 'income'),
  ('Подарки', 'income'),
  ('Продажи', 'income'),
  ('Еда', 'expense'),
  ('Транспорт', 'expense'),
  ('Жилье', 'expense'),
  ('Здоровье', 'expense'),
  ('Развлечения', 'expense'),
  ('Одежда', 'expense'),
  ('Образование', 'expense'),
  ('Коммунальные услуги', 'expense'),
  ('Связь', 'expense'),
  ('Другое', 'expense');

-- Update goals trigger to recalculate current_amount when contributions change
CREATE OR REPLACE FUNCTION update_goal_current_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE goals
    SET current_amount = COALESCE((
      SELECT SUM(amount)
      FROM goal_contributions
      WHERE goal_id = OLD.goal_id
    ), 0)
    WHERE id = OLD.goal_id;
    RETURN OLD;
  ELSE
    UPDATE goals
    SET current_amount = COALESCE((
      SELECT SUM(amount)
      FROM goal_contributions
      WHERE goal_id = NEW.goal_id
    ), 0)
    WHERE id = NEW.goal_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_goal_current_amount
  AFTER INSERT OR UPDATE OR DELETE ON goal_contributions
  FOR EACH ROW EXECUTE FUNCTION update_goal_current_amount();

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_goals_user_active ON goals(user_id, is_active);
CREATE INDEX idx_snapshots_user_date ON snapshots(user_id, date DESC);
CREATE INDEX idx_goal_contributions_goal_id ON goal_contributions(goal_id);
CREATE INDEX idx_goal_contributions_user_id ON goal_contributions(user_id);
CREATE INDEX idx_goal_contributions_transaction_id ON goal_contributions(transaction_id);
