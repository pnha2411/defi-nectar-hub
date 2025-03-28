
import { createClient } from '@supabase/supabase-js';
import type { TransactionDetails } from '@/lib/contractUtils';

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveTransaction(txDetails: TransactionDetails) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([txDetails])
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
