import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { login, password, server, platform } = await req.json();

    // Validate required fields
    if (!login || !password || !server || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate platform
    if (platform !== 'mt4' && platform !== 'mt5') {
      return NextResponse.json(
        { error: 'Invalid platform. Must be mt4 or mt5' },
        { status: 400 }
      );
    }

    // Get MetaAPI token from environment variables
    const token = process.env.METAAPI_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'MetaAPI token not configured' },
        { status: 500 }
      );
    }

    // Call MetaAPI to validate the account
    const response = await fetch('https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        name: `${platform.toUpperCase()} Account`,
        type: 'cloud',
        login,
        password,
        server,
        platform,
        magic: 0,
        connectionStatus: 'disconnected'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to validate account' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      account: {
        id: data._id,
        login,
        server,
        platform
      }
    });

  } catch (error: any) {
    console.error('Error validating MetaAPI account:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 