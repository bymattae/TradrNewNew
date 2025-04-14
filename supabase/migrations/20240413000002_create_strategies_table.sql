-- Create strategies table
CREATE TABLE IF NOT EXISTS public.strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT UNIQUE NOT NULL CHECK (char_length(strategy_id) = 6),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    hashtags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_strategy_id ON public.strategies(strategy_id);

-- Enable RLS
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view all strategies" ON public.strategies;
    DROP POLICY IF EXISTS "Users can manage their own strategies" ON public.strategies;
    
    -- Create new policies
    CREATE POLICY "Users can view all strategies"
        ON public.strategies FOR SELECT
        USING (true);

    CREATE POLICY "Users can manage their own strategies"
        ON public.strategies FOR ALL
        USING (auth.uid() = user_id);
END $$; 