import { http, createConfig } from 'wagmi'
import { avalancheFuji, avalanche } from 'wagmi/chains'

export const config = createConfig({
    chains: [avalancheFuji, avalanche],
    transports: {
        [avalancheFuji.id]: http(),
        [avalanche.id]: http(),
    },
})
