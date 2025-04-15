import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import https from 'https';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const METAAPI_URL = 'https://mt-provisioning-api-v1.agiliumtrade.ai';
const METASTATS_URL = 'https://metastats-api-v1.agiliumtrade.ai';
const METAAPI_TOKEN = process.env.METAAPI_TOKEN;

if (!METAAPI_TOKEN) {
  throw new Error('Missing required environment variable: METAAPI_TOKEN');
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 60000
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: strategy_id } = params;

    // 1. Get strategy details from Supabase using strategy_id
    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .select('*')
      .eq('strategy_id', strategy_id)
      .single();

    if (strategyError) throw strategyError;

    // 2. Get linked trading account from Supabase using strategy_id
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('strategy_id', strategy_id)
      .single();

    if (accountError) throw accountError;

    // 3. Get cached metrics from Supabase using strategy_id
    const { data: cachedMetrics, error: metricsError } = await supabase
      .from('strategy_stats')
      .select('*')
      .eq('strategy_id', strategy_id)
      .single();

    // 4. Get account state from MetaApi
    const headers = {
      'auth-token': METAAPI_TOKEN as string
    };

    const stateResponse = await fetch(
      `${METAAPI_URL}/users/current/accounts/${account.metaapi_id}`,
      {
        headers,
        agent: httpsAgent as any
      }
    );

    if (!stateResponse.ok) {
      throw new Error('Failed to fetch account state');
    }

    const accountState = await stateResponse.json();

    // 5. If account is deployed, fetch fresh metrics from MetaStats
    let metrics = {
      profitPercentage: cachedMetrics?.profit_percentage || 0,
      winRate: cachedMetrics?.win_rate || 0,
      totalTrades: cachedMetrics?.total_trades || 0
    };

    if (accountState.state === 'DEPLOYED') {
      const metricsResponse = await fetch(
        `${METASTATS_URL}/users/current/accounts/${account.login}/metrics`,
        {
          headers,
          agent: httpsAgent as any
        }
      );

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        metrics = {
          profitPercentage: metricsData.profitFactor || 0,
          winRate: metricsData.winRate || 0,
          totalTrades: metricsData.trades || 0
        };

        // Update cached metrics in Supabase
        await supabase
          .from('strategy_stats')
          .upsert({
            strategy_id,
            profit_percentage: metrics.profitPercentage,
            win_rate: metrics.winRate,
            total_trades: metrics.totalTrades,
            last_updated: new Date().toISOString()
          });
      }
    }

    // 6. Return combined strategy preview data
    return NextResponse.json({
      id: strategy.strategy_id,
      title: strategy.title,
      description: strategy.description,
      hashtags: strategy.hashtags,
      theme: strategy.theme,
      accountState: accountState.state,
      metrics
    });

  } catch (error: any) {
    console.error('Strategy Preview Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch strategy preview' },
      { status: 500 }
    );
  }
} 