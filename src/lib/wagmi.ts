
import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { defineChain } from 'viem'

// Create a custom QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 3, // 3 hours
    },
  },
})

export const somnia_testnet = defineChain({
  id: 50312,
  name: 'Somnia',
  nativeCurrency: { name: 'Somnia', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://dream-rpc.somnia.network'] },
  },
  blockExplorers: {
    default: { name: 'Somnia', url: 'https://etherscan.io' },
  },  
})

// Create wagmi config
export const config = createConfig({
  chains: [base, mainnet, somnia_testnet],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [somnia_testnet.id]: http(),
  },
})
