import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Common MetaTrader 5 demo servers
    const commonServers = [
      {
        name: "MetaQuotes-Demo",
        value: "MetaQuotes-Demo"
      },
      {
        name: "ICMarketsSC-Demo",
        value: "ICMarketsSC-Demo"
      },
      {
        name: "ICMarkets-Demo01",
        value: "ICMarkets-Demo01"
      },
      {
        name: "ICMarkets-Demo02",
        value: "ICMarkets-Demo02"
      },
      {
        name: "ICMarkets-Demo03",
        value: "ICMarkets-Demo03"
      }
    ];

    return NextResponse.json({
      success: true,
      servers: commonServers
    });

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch servers' },
      { status: 500 }
    );
  }
}