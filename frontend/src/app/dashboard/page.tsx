"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    useAccount,
    useConnect,
    useBalance
} from "wagmi";
import { formatUnits } from "viem";
import { injected } from "wagmi/connectors";
import { toast, Toaster } from "react-hot-toast";
import { useEcosystemStore } from "@/store/useEcosystemStore";

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const { data: balanceData } = useBalance({ address });
    const { connect } = useConnect();
    const [isClient, setIsClient] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const { mUsdcBalance, vaultApproved, setVaultApproved, activeSubscriptions, simulateTeleport } = useEcosystemStore();

    // eslint-disable-next-line
    useEffect(() => { setIsClient(true); }, []);

    const handleApprove = async () => {
        if (!isConnected) { toast.error("Please connect your wallet first."); return; }
        if (vaultApproved) { toast("Vault is already approved.", { icon: '✅' }); return; }

        setIsApproving(true);
        const approvePromise = simulateTeleport(() => {
            setVaultApproved(true);
            setIsApproving(false);
        });

        toast.promise(approvePromise, {
            loading: 'Initiating cross-chain message to C-Chain...',
            success: 'Vault Authorization Confirmed!',
            error: 'Failed to authorize.',
        }, {
            style: { background: '#120a0a', color: '#4ade80', border: '1px solid #4ade80' },
        });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display text-slate-100" style={{ backgroundColor: '#120a0a' }}>
            <Toaster position="bottom-right" />

            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 md:px-10 py-4 bg-dashboard-dark/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-6">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <Link href="/">
                            <h2 className="text-slate-100 text-xl font-black leading-tight tracking-tighter uppercase cursor-pointer hover:text-primary transition-colors">NEXUS COMMAND</h2>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-primary text-sm font-bold uppercase tracking-widest" href="#">Dashboard</a>
                            <Link className="text-slate-400 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors" href="/demo-service">Subnets</Link>
                            <a className="text-slate-400 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors" href="#">Vault</a>
                        </nav>
                        {!isConnected ? (
                            <button
                                onClick={() => connect({ connector: injected() })}
                                className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-[0_0_15px_rgba(231,64,64,0.4)] hover:shadow-[0_0_25px_rgba(231,64,64,0.6)] transition-all">
                                <span className="truncate">Connect Wallet</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-primary font-mono hidden sm:block">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/50" aria-label="Cyberpunk user profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuFh6mLhvzXmmDMcgMChflSefUrBZ4BWovXH31KbPbvPllzxXDu6XOJfmIf3Odw3jcjeG88cKqNGeegfdvdEeG2BMS-ZtntyjtPNEZX_obECZ7CFX63Fe_ug8aX7zrORDprr9XuwnLFkoLQd8kIzyB-2mfoTFuEJpxX1wa0rnYRp96SO2tIOVrVCL98Mw7Rq-yLGldE_pLhVsMX3bk-7qqMx6AxEka3IrIGLXqJ0gDsxb0D2aOVPJCskmjFcHrlAS1RJL4VPRDsZY")' }}></div>
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
                                <div className="w-full md:w-1/3 bg-center bg-no-repeat aspect-square bg-cover rounded-lg border border-border-dark" aria-label="Digital blockchain data blocks image" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjyLETQhI-AnxfNhI6fgQLhp18fzFqTmdX60K3a1DmilpgFX0UMGuIAoyzykQI_vgKpb-ay9YfnkgF5L-DB2ei7OEi9YNI-_MCW8krEJJp5SInrNbKXRy-8klIqAoQKrofikNmv8WGAw-l5IUzR020zDSwUCEpvSBR0OJxTAmmeuyHzH8xaeo3HYKhC1Mb3gduoZGqXzx2XD-FJF3lH55jOeNsgR9kLJRJ14000T2mZKhZyidimgAwrt1iwKACaX9POfzdKlMj-3Y")' }}></div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-xs text-primary">sensors</span>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Network: Fuji C-Chain</p>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium mb-1">Native Balance (Fuji)</p>
                                        <p className="text-white text-4xl font-black leading-tight tracking-tight">
                                            {isClient && isConnected && balanceData ? `${Number(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4)} ` : "0.0000 "}
                                            <span className="text-xl font-normal text-slate-500">AVAX</span>
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => connect({ connector: injected() })}
                                            className="w-full md:w-auto flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary/10 border border-primary text-primary text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                            {isConnected ? "Refresh Balance" : "Connect Wallet"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vault Authorization Card */}
                        <div className="flex flex-col rounded-xl overflow-hidden border border-border-dark bg-neutral-dark shadow-xl transition-all hover:border-emerald-500/50">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                            <div className="p-6 flex flex-col h-full justify-between gap-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-xl font-bold leading-tight">Vault Authorization</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="size-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                                            <p className="text-emerald-500 font-mono text-sm uppercase font-bold">
                                                {isClient && vaultApproved ? "Status: Vault Approved (Active)" : "Status: Not Connected"}
                                            </p>
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
                                    disabled={isApproving || !isConnected}
                                    className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-primary text-white text-sm font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isApproving ? "Processing..." : "Update Vault Settings"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscriptions List */}
                    <div className="rounded-xl border border-border-dark bg-neutral-dark overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-border-dark flex justify-between items-center bg-dashboard-dark/30">
                            <h3 className="text-white text-lg font-bold">Active Subscriptions</h3>
                            <span className="text-slate-500 text-xs font-mono uppercase">{activeSubscriptions.length} total active units</span>
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
                                    {activeSubscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                                        <span className="material-symbols-outlined">
                                                            {sub.name.includes("Gaming") ? "sports_esports" : sub.name.includes("DeFi") ? "analytics" : "rocket_launch"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">{sub.name}</p>
                                                        <p className="text-slate-500 text-xs">ID: {sub.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-black uppercase border border-slate-700">{sub.tier}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-white font-mono">${sub.price.toFixed(2)}<span className="text-slate-500 text-[10px]">/mo</span></p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">more_horiz</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-8 flex justify-center">
                        <Link href="/demo-service">
                            <button className="flex items-center gap-2 px-8 py-3 rounded-lg bg-dashboard-dark border border-border-dark text-slate-400 font-bold uppercase text-xs tracking-[0.2em] hover:text-white hover:border-primary/50 transition-all">
                                <span className="material-symbols-outlined text-sm">add_box</span>
                                Initialize New Subnet Protocol
                            </button>
                        </Link>
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
