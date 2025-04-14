import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { login, password, server, strategy_id, platform, hashtags, cta_title, cta_link } = await req.json();

    // Validate required fields
    if (!login || !password || !server || !strategy_id || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate login format (should be numeric)
    if (!/^\d+$/.test(login)) {
      return NextResponse.json(
        { error: 'Login must be a numeric value' },
        { status: 400 }
      );
    }

    // Validate server format
    if (!server.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid server format' },
        { status: 400 }
      );
    }

    // Get user_id from auth context
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update profile with hashtags and CTA
    if (hashtags || cta_title || cta_link) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          hashtags: hashtags || [],
          cta_title,
          cta_link,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;
    }

    // Update or create trading account
    const { error: accountError } = await supabase
      .from('trading_accounts')
      .upsert({
        strategy_id,
        user_id: user.id,
        login,
        server,
        platform,
        last_updated: new Date().toISOString()
      });

    if (accountError) throw accountError;

    // Get cached metrics
    const { data: cachedMetrics } = await supabase
      .from('trading_stats')
      .select('*')
      .eq('strategy_id', strategy_id)
      .single();

    return NextResponse.json({
      success: true,
      strategy_id,
      account: {
        login,
        server,
        platform
      },
      profile: {
        hashtags,
        cta_title,
        cta_link
      },
      metrics: {
        profitPercentage: cachedMetrics?.profit_percentage || 0,
        winRate: cachedMetrics?.win_rate || 0,
        totalTrades: cachedMetrics?.total_trades || 0
      }
    });

  } catch (error: any) {
    console.error('Validation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate credentials' },
      { status: 500 }
    );
  }
} 