
import { NextRequest, NextResponse } from 'next/server';
import { TransactionDetails } from '@/lib/contractUtils';
import { saveTransaction, getTransactions } from './transactions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    // Ensure the body conforms to TransactionDetails interface
    const txDetails: TransactionDetails = {
      hash: body.hash || '',
      from: body.from || '',
      to: body.to || '',
      functionName: body.functionName || '',
      args: typeof body.args === 'string' ? body.args : JSON.stringify(body.args || []),
      value: body.value || '0',
      status: body.status || 'pending',
      timestamp: body.timestamp || new Date().toISOString(),
      type: body.type || 'send',
      amount: body.amount,
      token: body.token,
      toToken: body.toToken
    };
    
    const data = await saveTransaction(txDetails);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    
    const data = await getTransactions(address, limit);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
