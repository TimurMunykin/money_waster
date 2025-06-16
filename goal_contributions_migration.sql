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
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goal_contributions
CREATE POLICY "Users can manage own goal contributions" ON goal_contributions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goal contributions" ON goal_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_goal_contributions_goal_id ON goal_contributions(goal_id);
CREATE INDEX idx_goal_contributions_user_id ON goal_contributions(user_id);
CREATE INDEX idx_goal_contributions_transaction_id ON goal_contributions(transaction_id);

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
