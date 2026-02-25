import { create } from 'zustand';

export interface Subscription {
    id: string;
    name: string;
    tier: string;
    price: number;
    status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

interface EcosystemState {
    mUsdcBalance: number;
    vaultApproved: boolean;
    activeSubscriptions: Subscription[];
    setBalance: (balance: number) => void;
    setVaultApproved: (approved: boolean) => void;
    addSubscription: (sub: Subscription) => void;
    simulateTeleport: (callback: () => void) => Promise<void>;
}

export const useEcosystemStore = create<EcosystemState>((set) => ({
    mUsdcBalance: 1420.50, // Mock healthy balance for the demo
    vaultApproved: true, // Default to true so Subnets show up normally if we mock them, or false if we want them to approve first. Let's make it true for immediate visual feedback of the "ecosystem"
    activeSubscriptions: [
        {
            id: 'NX-GAM-729',
            name: 'Web3 Gaming Subnet',
            tier: 'VIP PASS',
            price: 49.99,
            status: 'ACTIVE',
        },
        {
            id: 'NX-FIN-104',
            name: 'DeFi Subnet',
            tier: 'PRO ANALYTICS',
            price: 120.00,
            status: 'ACTIVE',
        }
    ],
    setBalance: (balance) => set({ mUsdcBalance: balance }),
    setVaultApproved: (approved) => set({ vaultApproved: approved }),
    addSubscription: (sub) => set((state) => ({
        activeSubscriptions: [...state.activeSubscriptions, sub],
        mUsdcBalance: state.mUsdcBalance - sub.price // Deduct price immediately as a mock transaction
    })),
    simulateTeleport: async (callback) => {
        // A helper to simulate a 3-second cross-chain delay
        return new Promise((resolve) => {
            setTimeout(() => {
                callback();
                resolve();
            }, 3000);
        });
    }
}));
