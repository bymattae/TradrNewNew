-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create trading_accounts table
CREATE TABLE IF NOT EXISTS public.trading_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT NOT NULL REFERENCES public.strategies(strategy_id) ON DELETE CASCADE,
    metaapi_id TEXT,
    login TEXT NOT NULL,
    server TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('mt4', 'mt5')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'connected', 'error')),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create strategy_stats table
CREATE TABLE IF NOT EXISTS public.strategy_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT NOT NULL REFERENCES public.strategies(strategy_id) ON DELETE CASCADE,
    gain DECIMAL,
    win_rate DECIMAL,
    risk_reward DECIMAL,
    total_trades INTEGER,
    max_drawdown DECIMAL,
    duration INTEGER,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_strategy_id ON public.strategies(strategy_id);
CREATE INDEX IF NOT EXISTS idx_trading_accounts_strategy_id ON public.trading_accounts(strategy_id);
CREATE INDEX IF NOT EXISTS idx_strategy_stats_strategy_id ON public.strategy_stats(strategy_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Strategies policies
CREATE POLICY "Users can view all strategies"
    ON public.strategies FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own strategies"
    ON public.strategies FOR ALL
    USING (auth.uid() = user_id);

-- Trading accounts policies
CREATE POLICY "Users can view accounts for strategies they own"
    ON public.trading_accounts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.strategies 
        WHERE strategies.strategy_id = trading_accounts.strategy_id 
        AND strategies.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage accounts for strategies they own"
    ON public.trading_accounts FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.strategies 
        WHERE strategies.strategy_id = trading_accounts.strategy_id 
        AND strategies.user_id = auth.uid()
    ));

-- Strategy stats policies
CREATE POLICY "Users can view stats for strategies they own"
    ON public.strategy_stats FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.strategies 
        WHERE strategies.strategy_id = strategy_stats.strategy_id 
        AND strategies.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage stats for strategies they own"
    ON public.strategy_stats FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.strategies 
        WHERE strategies.strategy_id = strategy_stats.strategy_id 
        AND strategies.user_id = auth.uid()
    )); 