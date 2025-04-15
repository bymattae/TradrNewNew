'use server';

import { createClient } from '../supabase/server'
import { StrategyInsert } from '@/lib/types/supabase'

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
export async function createStrategy(data: StrategyInsert) {
  const supabase = createClient()

  try {
    const { data: strategy, error } = await supabase
      .from('strategies')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return { strategy, error: null }
  } catch (error: any) {
    console.error('Error creating strategy:', error)
    return { strategy: null, error: error.message }
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