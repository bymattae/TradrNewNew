-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trading_accounts table in public schema
CREATE TABLE public.trading_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT UNIQUE NOT NULL CHECK (char_length(strategy_id) = 6),
    user_id UUID NOT NULL,
    login TEXT NOT NULL,
    server TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('mt4', 'mt5')),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trading_stats table in public schema
CREATE TABLE public.trading_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_strategy
        FOREIGN KEY (strategy_id)
        REFERENCES public.trading_accounts(strategy_id)
        ON DELETE CASCADE,
    CONSTRAINT trading_stats_strategy_id_unique UNIQUE (strategy_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_trading_accounts_user_id ON public.trading_accounts(user_id);
CREATE INDEX idx_trading_accounts_login ON public.trading_accounts(login);
CREATE INDEX idx_trading_stats_synced_at ON public.trading_stats(synced_at);

-- Add RLS policies
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for trading_accounts
CREATE POLICY "Users can view all trading accounts"
    ON public.trading_accounts FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own trading accounts"
    ON public.trading_accounts FOR ALL
    USING (auth.uid() = user_id);

-- Create policies for trading_stats
CREATE POLICY "Users can view all trading stats"
    ON public.trading_stats FOR SELECT
    USING (true);

CREATE POLICY "Users can update stats for their accounts"
    ON public.trading_stats FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trading_accounts
            WHERE trading_accounts.strategy_id = trading_stats.strategy_id
            AND trading_accounts.user_id = auth.uid()
        )
    ); 