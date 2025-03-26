
import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'

// Create a custom QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 3, // 3 hours
    },
  },
})

// Create wagmi config
export const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})
