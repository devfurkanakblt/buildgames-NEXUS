"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useConnect
} from "wagmi";
import { injected } from "wagmi/connectors";
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
    const { connect } = useConnect();
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
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-dashboard-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 md:px-10 py-4 bg-dashboard-dark/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-4 text-primary">
                        <Link href="/" className="size-6">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                            </svg>
                        </Link>
                        <h2 className="text-slate-100 text-xl font-black leading-tight tracking-tighter uppercase">NEXUS COMMAND</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-6">
                            <Link className="text-primary text-sm font-bold uppercase tracking-widest" href="/dashboard">Dashboard</Link>
                            <Link className="text-slate-400 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors" href="/demo-service">Subnets</Link>
                            <Link className="text-slate-400 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors" href="/admin">Vault</Link>
                        </nav>

                        {!isConnected ? (
                            <button
                                onClick={() => connect({ connector: injected() })}
                                className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-[0_0_15px_rgba(231,64,64,0.4)] hover:shadow-[0_0_25px_rgba(231,64,64,0.6)] transition-all">
                                <span className="truncate">Connect Wallet</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-primary font-mono">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/50" aria-label="Cyberpunk user profile avatar graphic" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuFh6mLhvzXmmDMcgMChflSefUrBZ4BWovXH31KbPbvPllzxXDu6XOJfmIf3Odw3jcjeG88cKqNGeegfdvdEeG2BMS-ZtntyjtPNEZX_obECZ7CFX63Fe_ug8aX7zrORDprr9XuwnLFkoLQd8kIzyB-2mfoTFuEJpxX1wa0rnYRp96SO2tIOVrVCL98Mw7Rq-yLGldE_pLhVsMX3bk-7qqMx6AxEka3IrIGLXqJ0gDsxb0D2aOVPJCskmjFcHrlAS1RJL4VPRDsZY")' }}></div>
                            </div>
                        )}

                    </div>
                </header>

                <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em] uppercase italic">Terminal Dashboard</h1>
                        <p className="text-slate-400 text-base font-normal leading-normal">Operational status: <span className="text-emerald-500 font-mono">ENCRYPTED_ONLINE</span></p>
                    </div>

                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                        {/* Wallet Overview Card */}
                        <div className="flex flex-col rounded-xl overflow-hidden border border-border-dark bg-neutral-dark shadow-xl group transition-all hover:border-primary/50">
                            <div className="h-1 bg-gradient-to-r from-primary to-transparent"></div>
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/3 bg-center bg-no-repeat aspect-square bg-cover rounded-lg border border-border-dark" aria-label="Digital representation of blockchain data blocks" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjyLETQhI-AnxfNhI6fgQLhp18fzFqTmdX60K3a1DmilpgFX0UMGuIAoyzykQI_vgKpb-ay9YfnkgF5L-DB2ei7OEi9YNI-_MCW8krEJJp5SInrNbKXRy-8klIqAoQKrofikNmv8WGAw-l5IUzR020zDSwUCEpvSBR0OJxTAmmeuyHzH8xaeo3HYKhC1Mb3gduoZGqXzx2XD-FJF3lH55jOeNsgR9kLJRJ14000T2mZKhZyidimgAwrt1iwKACaX9POfzdKlMj-3Y")' }}></div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-xs text-primary">sensors</span>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Network: Fuji C-Chain</p>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium mb-1">mUSDC Balance</p>
                                        <div className="text-white text-4xl font-black leading-tight tracking-tight flex items-baseline gap-1">
                                            {usdcBalanceData ? (
                                                <>
                                                    {formatUnits(usdcBalanceData, 6)} <span className="text-sm font-medium text-slate-500">mUSDC</span>
                                                </>
                                            ) : (
                                                <>
                                                    0.00 <span className="text-sm font-medium text-slate-500">mUSDC</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button className="w-full md:w-auto flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary/10 border border-primary text-primary text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                            Add Funds
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Global Vault Authorization Card */}
                        <div className="flex flex-col rounded-xl overflow-hidden border border-border-dark bg-neutral-dark shadow-xl transition-all hover:border-emerald-500/50">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                            <div className="p-6 flex flex-col h-full justify-between gap-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-xl font-bold leading-tight">Vault Authorization</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="size-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                                            <p className="text-emerald-500 font-mono text-sm uppercase font-bold">Status: Ready to Approve</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                                        <span className="material-symbols-outlined text-emerald-500 text-3xl">verified_user</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-dashboard-dark/50 rounded-lg border border-border-dark">
                                    <p className="text-slate-400 text-xs leading-relaxed">Your account is linked to the Nexus Secure Vault. This allows for automated subnet subscription renewals and encrypted data transfers across the network.</p>
                                </div>
                                <button
                                    onClick={handleApprove}
                                    disabled={isPending || isConfirming}
                                    className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-primary text-white text-sm font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all disabled:opacity-50">
                                    {isPending || isConfirming ? "Processing..." : "Approve Vault Allocation"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscriptions List */}
                    <div className="rounded-xl border border-border-dark bg-neutral-dark overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-border-dark flex justify-between items-center bg-dashboard-dark/30">
                            <h3 className="text-white text-lg font-bold">Active Subscriptions</h3>
                            <span className="text-slate-500 text-xs font-mono uppercase">2 total active units</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dashboard-dark/20">
                                        <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Subnet Entity</th>
                                        <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Tier</th>
                                        <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Billing Rate</th>
                                        <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Operational Status</th>
                                        <th className="px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark">
                                    {/* Subscription Row 1 */}
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                                    <span className="material-symbols-outlined">sports_esports</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">Web3 Gaming Subnet</p>
                                                    <p className="text-slate-500 text-xs">ID: NX-GAM-729</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-black uppercase border border-slate-700">VIP Pass</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-white font-mono">$49.99<span className="text-slate-500 text-[10px]">/mo</span></p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                                                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                ACTIVE
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Subscription Row 2 */}
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                                    <span className="material-symbols-outlined">analytics</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">DeFi Subnet</p>
                                                    <p className="text-slate-500 text-xs">ID: NX-FIN-104</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-black uppercase border border-slate-700">Pro Analytics</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-white font-mono">$120.00<span className="text-slate-500 text-[10px]">/mo</span></p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                                                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                ACTIVE
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-border-dark p-8 bg-dashboard-dark text-center mt-auto">
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">NEXUS COMMAND v4.0.2 © 2024 Terminal Protocol Inc.</p>
                </footer>
            </div>
        </div>
    );
}
