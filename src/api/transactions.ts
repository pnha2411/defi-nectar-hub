
import { createClient } from '@supabase/supabase-js';
import type { TransactionDetails } from '@/lib/contractUtils';

// Initialize Supabase client with environment variables
// This should be replaced with your actual Supabase URL and key
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveTransaction(txDetails: TransactionDetails) {
  // Make sure we're not trying to save undefined or null values
  const sanitizedDetails = {
    ...txDetails,
    args: typeof txDetails.args === 'string' ? txDetails.args : JSON.stringify(txDetails.args || []),
    timestamp: txDetails.timestamp || new Date().toISOString(),
    status: txDetails.status || 'pending'
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert([sanitizedDetails])
    .select();

  if (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }

  return data;
}

export async function getTransactions(address: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('from', address)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data;
}
