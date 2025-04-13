-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create strategies table
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT UNIQUE NOT NULL CHECK (char_length(strategy_id) = 6),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    hashtags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT strategies_strategy_id_unique UNIQUE (strategy_id)
);

-- Create linked_accounts table
CREATE TABLE linked_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT NOT NULL,
    login TEXT NOT NULL,
    server TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('mt4', 'mt5')),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_strategy
        FOREIGN KEY (strategy_id)
        REFERENCES strategies(strategy_id)
        ON DELETE CASCADE,
    CONSTRAINT linked_accounts_strategy_id_unique UNIQUE (strategy_id)
);

-- Create strategy_stats table
CREATE TABLE strategy_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_strategy
        FOREIGN KEY (strategy_id)
        REFERENCES strategies(strategy_id)
        ON DELETE CASCADE,
    CONSTRAINT strategy_stats_strategy_id_unique UNIQUE (strategy_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_strategies_user_id ON strategies(user_id);
CREATE INDEX idx_strategies_created_at ON strategies(created_at);
CREATE INDEX idx_linked_accounts_login ON linked_accounts(login);
CREATE INDEX idx_strategy_stats_synced_at ON strategy_stats(synced_at);

-- Add RLS policies
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for strategies
CREATE POLICY "Users can view all strategies"
    ON strategies FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own strategies"
    ON strategies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies"
    ON strategies FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies"
    ON strategies FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for linked_accounts
CREATE POLICY "Users can view all linked accounts"
    ON linked_accounts FOR SELECT
    USING (true);

CREATE POLICY "Users can manage linked accounts for their strategies"
    ON linked_accounts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM strategies
            WHERE strategies.strategy_id = linked_accounts.strategy_id
            AND strategies.user_id = auth.uid()
        )
    );

-- Create policies for strategy_stats
CREATE POLICY "Users can view all strategy stats"
    ON strategy_stats FOR SELECT
    USING (true);

CREATE POLICY "Users can update stats for their strategies"
    ON strategy_stats FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM strategies
            WHERE strategies.strategy_id = strategy_stats.strategy_id
            AND strategies.user_id = auth.uid()
        )
    ); 