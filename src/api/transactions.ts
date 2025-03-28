
import { createClient } from '@supabase/supabase-js';
import type { TransactionDetails } from '@/lib/contractUtils';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory fallback storage when Supabase is not available
let localTransactionCache: TransactionDetails[] = [];

export async function saveTransaction(txDetails: TransactionDetails) {
  // Make sure we're not trying to save undefined or null values
  const sanitizedDetails = {
    ...txDetails,
    args: typeof txDetails.args === 'string' ? txDetails.args : JSON.stringify(txDetails.args || []),
    timestamp: txDetails.timestamp || new Date().toISOString(),
    status: txDetails.status || 'pending'
  };

  try {
    // Try to save to Supabase first
    const { data, error } = await supabase
      .from('transactions')
      .insert([sanitizedDetails])
      .select();

    if (error) {
      console.warn('Supabase error, using local storage fallback:', error);
      // Save to local cache as fallback
      localTransactionCache.push(sanitizedDetails);
      return [sanitizedDetails];
    }

    return data;
  } catch (error) {
    console.warn('Network error, using local storage fallback:', error);
    // Save to local cache as fallback
    localTransactionCache.push(sanitizedDetails);
    return [sanitizedDetails];
  }
}

export async function getTransactions(address: string, limit: number = 10) {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('from', address)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Supabase error, using local cache fallback:', error);
      // Fall back to local cache
      return localTransactionCache
        .filter(tx => tx.from.toLowerCase() === address.toLowerCase())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }

    return data;
  } catch (error) {
    console.warn('Network error, using local cache fallback:', error);
    // Fall back to local cache
    return localTransactionCache
      .filter(tx => tx.from.toLowerCase() === address.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}
