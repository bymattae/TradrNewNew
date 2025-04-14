'use client';

import { createClient } from '@/app/lib/supabase/client';

interface CreateStrategyParams {
  title: string;
  description: string;
  hashtags: string[];
}

interface ConnectAccountParams {
  strategyId: string;
  login: string;
  password: string;
  server: string;
  platform: 'mt4' | 'mt5';
}

interface Metrics {
  gain: number;
  winRate: number;
  averageRiskReward: number;
  trades: number;
  maxDrawdown: number;
  duration: number;
}

/**
 * Creates a new strategy and returns the generated strategy_id
 */
export async function createStrategy(params: CreateStrategyParams): Promise<{
  success: boolean;
  strategy_id?: string;
  error?: string;
}> {
  try {
    console.log('Creating strategy with params:', params);
    const supabase = createClient();

    // Generate a unique 6-character strategy ID (uppercase letters and numbers)
    const generateStrategyId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('User data:', { user, userError });
    
    if (userError) {
      console.error('User error:', userError);
      throw new Error('Failed to get user');
    }
    
    if (!user) {
      console.error('No user found');
      throw new Error('Not authenticated');
    }

    // Generate a unique strategy ID
    const strategyId = generateStrategyId();
    console.log('Generated strategy ID:', strategyId);

    // Insert the new strategy
    const { data: insertData, error: insertError } = await supabase
      .from('strategies')
      .insert({
        strategy_id: strategyId,
        user_id: user.id,
        title: params.title,
        description: params.description,
        hashtags: params.hashtags,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    console.log('Strategy insert result:', { insertData, insertError });

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Check if the error is about the table not existing
      const errorMessage = insertError.message || insertError.toString();
      if (errorMessage.includes('relation "strategies" does not exist')) {
        console.error('Strategies table does not exist. Please create it in your Supabase dashboard.');
        throw new Error('Database not properly set up. Please contact support.');
      }
      
      throw new Error(errorMessage);
    }

    return {
      success: true,
      strategy_id: strategyId
    };

  } catch (error: any) {
    console.error('Create Strategy Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create strategy'
    };
  }
}

/**
 * Connects a trading account to a strategy using MetaApi
 */
export async function connectAccount(params: ConnectAccountParams): Promise<{
  success: boolean;
  account_id?: string;
  error?: string;
}> {
  try {
    const supabase = createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // First, save account details to Supabase with pending status
    const { error: accountError } = await supabase
      .from('trading_accounts')
      .insert({
        strategy_id: params.strategyId,
        login: params.login,
        server: params.server,
        platform: params.platform,
        status: 'pending',
        connected_at: new Date().toISOString()
      });

    if (accountError) throw accountError;

    // Call MetaApi provisioning endpoint
    const response = await fetch(
      'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts',
      {
        method: 'POST',
        headers: {
          'auth-token': process.env.METAAPI_TOKEN!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: params.strategyId, // Using strategy_id as the account name
          type: 'cloud',
          login: params.login,
          password: params.password,
          server: params.server,
          platform: params.platform,
          magic: 0
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to provision account with MetaApi');
    }

    const { id: accountId } = await response.json();

    // Update account status in Supabase
    const { error: updateError } = await supabase
      .from('trading_accounts')
      .update({
        metaapi_id: accountId,
        status: 'connected'
      })
      .eq('strategy_id', params.strategyId);

    if (updateError) throw updateError;

    return {
      success: true,
      account_id: accountId
    };

  } catch (error: any) {
    console.error('Connect Account Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect account'
    };
  }
}

/**
 * Fetches and updates metrics for a strategy
 */
export async function updateStrategyMetrics(strategyId: string, accountId: string): Promise<{
  success: boolean;
  metrics?: Metrics;
  error?: string;
}> {
  try {
    const supabase = createClient();
    
    const response = await fetch(
      `https://metastats-api-v1.new-york.agiliumtrade.ai/accounts/${accountId}/metrics`,
      {
        headers: {
          'auth-token': process.env.METAAPI_TOKEN!
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch metrics from MetaStats');
    }

    const metrics = await response.json();

    // Save metrics to Supabase
    const { error: updateError } = await supabase
      .from('strategy_stats')
      .upsert({
        strategy_id: strategyId,
        gain: metrics.gain,
        win_rate: metrics.winRate,
        risk_reward: metrics.averageRiskReward,
        total_trades: metrics.trades,
        max_drawdown: metrics.maxDrawdown,
        duration: metrics.duration,
        last_synced_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('Update metrics error:', updateError);
      throw new Error(updateError.message || 'Failed to save metrics');
    }

    return {
      success: true,
      metrics
    };

  } catch (error: any) {
    console.error('Update Metrics Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update metrics'
    };
  }
}