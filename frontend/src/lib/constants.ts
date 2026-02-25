import MockUSDCABI from './contracts/MockUSDC.json';
import NexusVaultABI from './contracts/NexusVault.json';
import NexusBillingABI from './contracts/NexusBilling.json';

// --- Fuji Testnet Deployed Contract Addresses ---
export const MOCK_USDC_ADDRESS = "0x0Ea1fc10a7Bd14231d41E7575aA00888ca5255dC" as const;
export const NEXUS_VAULT_ADDRESS = "0xeF49d4fCd8C452f09AfA76B3BaBbdA4b4190866B" as const;
export const NEXUS_BILLING_ADDRESS = "0xc6a24A2bA1435553F0CcC45020F45E3804e63871" as const;

// --- ABIs ---
export const MOCK_USDC_ABI = MockUSDCABI.abi;
export const NEXUS_VAULT_ABI = NexusVaultABI.abi;
export const NEXUS_BILLING_ABI = NexusBillingABI.abi;
