"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useConnect, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { injected } from "wagmi/connectors";
import { toast, Toaster } from "react-hot-toast";
import { useEcosystemStore } from "@/store/useEcosystemStore";
import { NEXUS_BILLING_ADDRESS, NEXUS_BILLING_ABI, MOCK_USDC_ADDRESS, MOCK_USDC_ABI } from "@/lib/constants";

export default function DemoServicePage() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { activeSubscriptions } = useEcosystemStore();

    // 1. Check if user is already actively subscribed on-chain
    const { data: subscriptionData, refetch: refetchSubscription } = useReadContract({
        address: NEXUS_BILLING_ADDRESS,
        abi: NEXUS_BILLING_ABI,
        functionName: 'subscriptions',
        args: address ? [address, BigInt(100)] : undefined, // serviceId = 100
        query: {
            enabled: !!address,
        }
    });

    // We know 'isActive' is the 5th item in the returned tuple from the struct 
    // (userAddress, serviceId, costPerMonth, nextPaymentDueDate, isActive)
    const isOnchainSubscribed = subscriptionData ? (subscriptionData as any[])[4] : false;

    // 2. Wagmi hook for writing to NexusBilling
    const { writeContractAsync, isPending: isTxPending } = useWriteContract();

    const handleSubscribe = async () => {
        if (!isConnected) {
            toast.error("Please connect your wallet first");
            connect({ connector: injected() });
            return;
        }

        try {
            const txPromise = writeContractAsync({
                address: NEXUS_BILLING_ADDRESS,
                abi: NEXUS_BILLING_ABI,
                functionName: 'registerSubscription',
                args: [
                    address,
                    BigInt(100), // serviceId
                    parseUnits("100", 6) // costPerMonth (100 mUSDC)
                ],
            });

            toast.promise(txPromise, {
                loading: 'Communicating with Subnet Billing Contract via Wallet...',
                success: 'Transaction submitted! Waiting for confirmation...',
                error: 'Transaction failed or denied.',
            }, {
                style: { background: '#120808', color: '#4ade80', border: '1px solid #4ade80' }
            });

            await txPromise;
            refetchSubscription(); // Refetch the status once the transaction is sent

        } catch (error) {
            console.error("Subscription flow error:", error);
        }
    };

    const handleFaucet = async () => {
        if (!isConnected) {
            toast.error("Please connect your wallet first");
            connect({ connector: injected() });
            return;
        }

        try {
            setIsMinting(true);
            const txPromise = writeContractAsync({
                address: MOCK_USDC_ADDRESS,
                abi: MOCK_USDC_ABI,
                functionName: 'mint',
                args: [address, parseUnits("1000", 6)], // Mint 1,000 mUSDC
            });

            toast.promise(txPromise, {
                loading: 'Requesting 1,000 mUSDC from Faucet...',
                success: 'Tokens minted successfully! Checkout Dashboard.',
                error: 'Faucet request failed.',
            }, {
                style: { background: '#120808', color: '#4ade80', border: '1px solid #4ade80' }
            });

            await txPromise;
        } catch (error) {
            console.error("Faucet error:", error);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display text-slate-100" style={{ backgroundColor: '#120808' }}>
            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Header */}
            <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-20 bg-background-light dark:bg-mock-bg sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <div className="text-primary">
                        <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-black leading-tight tracking-tight uppercase">Galactic Raiders</h2>
                        <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">Web3 Infrastructure</span>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6 mr-6">
                        <Link className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard">Nexus Dashboard</Link>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Explorer</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Assets</a>
                    </div>
                    <button
                        onClick={() => (!isClient || !isConnected) && connect({ connector: injected() })}
                        className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                        title={(isClient && isConnected) ? "Connected" : "Connect Wallet"}>
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </button>
                    <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 lg:hidden">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>

            {/* Network Warning Banner */}
            <div className="w-full bg-primary/10 border-b border-primary/30 py-3 px-6 lg:px-20">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">warning</span>
                        <div>
                            <p className="text-slate-900 dark:text-slate-100 text-sm font-bold">Network Warning</p>
                            <p className="text-slate-600 dark:text-slate-400 text-xs">You must be connected to the Custom Subnet to interact with these assets.</p>
                        </div>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap">
                        Switch Network
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-10 lg:px-10 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column */}
                    <div className="flex flex-col flex-1 gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full w-fit text-[10px] font-black uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Nexus Service Live
                            </div>
                            <h1 className="text-slate-900 dark:text-slate-100 text-5xl lg:text-7xl font-black leading-none tracking-tighter uppercase italic">
                                NEXUS <span className="text-primary">Mock</span><br />App-Chain
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
                                Experience the future of Galactic Raiders Web3 infrastructure. Deploy, scale, and manage your in-game identity with zero gas fees on our dedicated gaming subnet.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-mock-neutral-800/40 border border-primary/10 p-6 rounded-xl hover:border-primary/40 transition-all group">
                                <span className="material-symbols-outlined text-primary mb-3 text-3xl group-hover:scale-110 transition-transform block">speed</span>
                                <h3 className="text-slate-100 font-bold mb-1">Instant Settlement</h3>
                                <p className="text-slate-400 text-sm">Transactions confirm in under 1s with our specialized consensus engine.</p>
                            </div>
                            <div className="bg-mock-neutral-800/40 border border-primary/10 p-6 rounded-xl hover:border-primary/40 transition-all group">
                                <span className="material-symbols-outlined text-primary mb-3 text-3xl group-hover:scale-110 transition-transform block">shield_moon</span>
                                <h3 className="text-slate-100 font-bold mb-1">Secure Custody</h3>
                                <p className="text-slate-400 text-sm">Enterprise-grade security for your legendary Galactic Raider assets.</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 pt-10 border-t border-primary/10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex gap-10 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-primary font-black text-2xl">4.2M</span>
                                        <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Transactions</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-primary font-black text-2xl">12k</span>
                                        <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Active Raiders</span>
                                    </div>
                                    <button
                                        onClick={handleFaucet}
                                        disabled={isMinting}
                                        className="h-10 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                                        <span className="material-symbols-outlined text-[16px]">water_drop</span>
                                        {isMinting ? "Minting..." : "Faucet: 1,000 mUSDC"}
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <a className="w-10 h-10 rounded-lg bg-mock-neutral-800 flex items-center justify-center hover:bg-primary/20 transition-colors" href="#">
                                        <span className="material-symbols-outlined text-slate-400">share</span>
                                    </a>
                                    <a className="w-10 h-10 rounded-lg bg-mock-neutral-800 flex items-center justify-center hover:bg-primary/20 transition-colors" href="#">
                                        <span className="material-symbols-outlined text-slate-400">code</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Subscription Card */}
                    <div className="w-full lg:w-[400px]">
                        <div className="relative bg-mock-neutral-900 border-2 border-primary p-1 rounded-xl shadow-2xl shadow-primary/20 overflow-hidden">
                            <div className="bg-primary/10 px-6 py-4 border-b border-primary/30 flex justify-between items-center">
                                <h2 className="text-slate-100 font-black italic uppercase tracking-wider">Subscription Tiers</h2>
                                <span className="material-symbols-outlined text-primary">verified</span>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-slate-100 text-xl font-bold">Pro Gamer Pass</h3>
                                    <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded uppercase">Most Popular</span>
                                </div>
                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-slate-100 text-6xl font-black italic tracking-tighter">100</span>
                                        <div className="flex flex-col">
                                            <span className="text-primary font-bold text-lg leading-none">mUSDC</span>
                                            <span className="text-slate-500 text-sm">/ month</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-10">
                                    {[
                                        "Full Access to Galactic Custom Subnet",
                                        "Zero Gas Fees for all Transactions",
                                        "Exclusive Season 4 In-game Assets",
                                        "Priority Matchmaking & Tournament Entry",
                                        "Early Access to Galactic Raiders Beta",
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                            <span className="text-slate-300 text-sm leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {isOnchainSubscribed ? (
                                    <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 font-bold">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Active Subscription
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSubscribe}
                                        disabled={isTxPending || isSubscribing}
                                        className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isTxPending ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Registering...
                                            </span>
                                        ) : (
                                            <>
                                                <span>Subscribe with Nexus</span>
                                                <span className="material-symbols-outlined">double_arrow</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                <p className="text-center text-slate-500 text-[10px] mt-6 uppercase tracking-widest font-bold">
                                    Powered by NEXUS Protocol
                                </p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-[200px] text-primary">rocket</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-background-light dark:bg-mock-bg py-10 px-6 lg:px-20 border-t border-primary/10 mt-auto">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-primary">rocket_launch</span>
                        <span className="text-sm font-black uppercase tracking-tighter">Galactic Raiders</span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <a className="hover:text-primary" href="#">Legal</a>
                        <a className="hover:text-primary" href="#">Support</a>
                        <a className="hover:text-primary" href="#">Docs</a>
                        <a className="hover:text-primary" href="#">Status</a>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">© 2024 Nexus Gaming Lab</p>
                </div>
            </footer>
        </div>
    );
}
