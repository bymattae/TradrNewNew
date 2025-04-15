import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import https from 'https';

const METAAPI_URL = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai';
const METAAPI_TOKEN = process.env.METAAPI_TOKEN;

if (!METAAPI_TOKEN) {
  throw new Error('Missing required environment variable: METAAPI_TOKEN');
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 60000
});

export async function POST(req: Request) {
  try {
    const { strategy_id, login, password, server, platform, title } = await req.json();

    // Validate required fields
    if (!strategy_id || !login || !password || !server || !platform || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate platform type
    if (platform !== 'mt4' && platform !== 'mt5') {
      return NextResponse.json(
        { error: 'Platform must be either mt4 or mt5' },
        { status: 400 }
      );
    }

    const headers = {
      'auth-token': METAAPI_TOKEN as string,
      'Content-Type': 'application/json'
    };

    // Create MetaAPI trading account
    const response = await fetch(`${METAAPI_URL}/users/current/accounts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: title,
        type: 'cloud',
        login,
        password,
        server,
        platform,
        magic: 0
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create MetaAPI account' },
        { status: response.status }
      );
    }

    const account = await response.json();

    // Store account details in Supabase
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from('accounts')
      .insert({
        strategy_id,
        login,
        server,
        platform,
        metaapi_id: account.id,
        status: 'pending'
      });

    if (dbError) {
      // Try to delete the MetaAPI account if database insertion fails
      await fetch(`${METAAPI_URL}/users/current/accounts/${account.id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': METAAPI_TOKEN as string
        }
      });

      throw dbError;
    }

    return NextResponse.json({
      success: true,
      account_id: account.id
    });

  } catch (error: any) {
    console.error('Connect Account Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect account' },
      { status: 500 }
    );
  }
} 