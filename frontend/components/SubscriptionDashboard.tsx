"use client";

import React, { useState, useEffect } from "react";
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { toast, Toaster } from "react-hot-toast";

// Ensure you replace these with your deployed contract addresses on Fuji
const MOCK_USDC_ADDRESS = "0xYourMockUSDCDeplyedAddress";
const NEXUS_VAULT_ADDRESS = "0xYourNexusVaultDeployedAddress";

// Minimal ERC20 ABI required for balanceOf and approve
const erc20Abi = [
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "balance", type: "uint256" }],
    },
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "success", type: "bool" }],
    }
] as const;

export default function SubscriptionDashboard() {
    const { address, isConnected } = useAccount();
    const [isClient, setIsClient] = useState(false);

    // Prevent hydration errors
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 1. Read the user's USDC Balance
    const {
        data: usdcBalanceData,
        refetch: refetchBalance
    } = useReadContract({
        address: MOCK_USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // 2. Prepare the write contract hook for Approval
    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract();

    // 3. Wait for the transaction receipt
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed
    } = useWaitForTransactionReceipt({
        hash,
    });

    // Listen for confirmation
    useEffect(() => {
        if (isConfirmed) {
            toast.success("Nexus Vault Approved Successfully! 🌌", {
                style: {
                    background: '#0f172a',
                    color: '#10b981',
                    border: '1px solid #10b981'
                },
            });
            refetchBalance();
        }
    }, [isConfirmed, refetchBalance]);

    const handleApprove = () => {
        if (!address) {
            toast.error("Please connect your wallet first");
            return;
        }

        toast.loading("Approving Nexus Vault...", { id: "approve-toast" });

        // Assuming we want to approve a virtually infinite amount for recurring payments
        // or a large number (e.g. 10,000 mUSDC). MockUSDC uses 6 decimals.
        const amountToApprove = parseUnits("10000", 6);

        writeContract({
            address: MOCK_USDC_ADDRESS,
            abi: erc20Abi,
            functionName: "approve",
            args: [NEXUS_VAULT_ADDRESS, amountToApprove],
        }, {
            onSuccess: () => {
                toast.dismiss("approve-toast");
                toast.success("Transaction submitted...");
            },
            onError: (error) => {
                toast.dismiss("approve-toast");
                toast.error(`Approval failed: ${error.message.substring(0, 50)}`);
            }
        });
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Sleek Cyberpunk/Enterprise Card */}
            <div className="w-full max-w-md relative">
                {/* Glow effect behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 animate-pulse"></div>

                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            NEXUS COMMAND
                        </h1>
                        <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"}`}></div>
                    </div>

                    {!isConnected ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>Connect your wallet to access the Nexus.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Balance Display */}
                            <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/50 flex flex-col items-center justify-center">
                                <span className="text-sm text-cyan-500/80 uppercase tracking-widest font-semibold mb-2">Available Vault Balance</span>
                                <div className="text-4xl font-light text-slate-100 tracking-tight">
                                    {usdcBalanceData ? (
                                        <>
                                            {formatUnits(usdcBalanceData, 6)}
                                            <span className="text-xl text-slate-500 ml-2 font-medium">mUSDC</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-600">0.00 <span className="text-xl">mUSDC</span></span>
                                    )}
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="pt-4">
                                <p className="text-sm text-slate-400 mb-4 text-center">
                                    Authorize NexusVault to automate your cross-chain Subnet subscriptions.
                                </p>
                                <button
                                    onClick={handleApprove}
                                    disabled={isPending || isConfirming}
                                    className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-800 border border-transparent rounded-xl hover:bg-slate-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-cyan-500 rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
                                    <span className="relative flex items-center gap-2">
                                        {isPending || isConfirming ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Initializing Uplink...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Approve Nexus Vault
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>

                            {/* Status hints */}
                            <div className="text-xs text-center text-slate-600 mt-4 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 blur-[1px]"></div>
                                Secured by Avalanche C-Chain
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
