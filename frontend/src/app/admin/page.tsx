"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function AdminConsole() {
    const [targetAddress, setTargetAddress] = useState("0x8920...2456");
    const [serviceId, setServiceId] = useState("SRV-MAIN-9921");
    const [isSimulating, setIsSimulating] = useState(false);

    type LogType = 'info' | 'success' | 'warning' | 'system';
    interface LogEntry { time: string; content: React.ReactNode; type: LogType; }

    const [logs, setLogs] = useState<LogEntry[]>([
        { time: "14:30:11", content: <><span className="text-slate-300">SYS:</span> Listening for new socket events...</>, type: "system" },
        { time: "14:28:05", content: <><span className="text-terminal-green">INF:</span> Vault lock initiated... Transaction confirmed.</>, type: "info" },
        { time: "14:28:02", content: <><span className="text-primary">EVT:</span> <span className="text-white underline">RenewalTriggered</span> for UID: <span className="text-slate-300">114-002</span></>, type: "info" },
        { time: "14:25:12", content: <><span className="text-slate-500">WRN:</span> Latency spike detected in Peer-4 node link</>, type: "warning" },
        { time: "14:23:45", content: <><span className="text-primary">EVT:</span> <span className="text-white underline">PaymentTeleported</span> <span className="text-terminal-green">SUCCESS</span> - 0.45 ETH</>, type: "success" },
        { time: "14:22:15", content: <><span className="text-terminal-green">INF:</span> Calculating gas parameters for L2 bridge... OK</>, type: "info" },
        { time: "14:22:01", content: <><span className="text-terminal-green">INF:</span> Initializing Teleporter handshake with node <span className="text-slate-300">#042</span></>, type: "info" },
    ]);

    const addLog = (content: React.ReactNode, type: LogType = 'info') => {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        // Keep only the latest 50 logs to prevent memory leaks in the browser
        setLogs(prev => [{ time: timeStr, content, type }, ...prev].slice(0, 50));
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const generateRandomLog = () => {
            const events = [
                { content: <><span className="text-slate-300">SYS:</span> Heartbeat check OK for Node-12</>, type: "system" as LogType },
                { content: <><span className="text-terminal-green">INF:</span> Verified inbound Teleporter packet [Hash: {Math.random().toString(16).substring(2, 8)}]</>, type: "info" as LogType },
                { content: <><span className="text-primary">EVT:</span> <span className="text-white underline">StateSync</span> mapped new block</>, type: "info" as LogType },
                { content: <><span className="text-terminal-green">INF:</span> Subnet billing indexer polled 4 new subscriptions</>, type: "info" as LogType },
                { content: <><span className="text-slate-500">WRN:</span> Minor RPC delay detected (120ms)</>, type: "warning" as LogType },
                { content: <><span className="text-primary">EVT:</span> <span className="text-white underline">CrossChainTransfer</span> queued for processing</>, type: "info" as LogType }
            ];
            const randomEvent = events[Math.floor(Math.random() * events.length)];

            setLogs(prev => [{
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                content: randomEvent.content,
                type: randomEvent.type
            }, ...prev].slice(0, 50));

            // Schedule next log
            const nextDelay = Math.random() * 4000 + 2000; // Between 2 and 6 seconds
            timeoutId = setTimeout(generateRandomLog, nextDelay);
        };

        timeoutId = setTimeout(generateRandomLog, 2000);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleSimulate = () => {
        if (!targetAddress) { toast.error("Please enter a target address"); return; }
        setIsSimulating(true);
        addLog(<><span className="text-terminal-green">INF:</span> Initiating triggerRenewal for Service: <span className="text-slate-300">{serviceId}</span>...</>, 'info');
        setTimeout(() => {
            addLog(<><span className="text-primary">EVT:</span> <span className="text-white underline">RenewalTriggered</span> for UID: <span className="text-slate-300">{targetAddress.substring(0, 10)}...</span></>, 'info');
            setTimeout(() => {
                addLog(<><span className="text-terminal-green">INF:</span> Teleporter: Cross-chain message sent (Subnet → C-Chain)</>, 'info');
                setTimeout(() => {
                    addLog(<><span className="text-terminal-green">INF:</span> C-Chain: NexusVault.receiveTeleporterMessage executing...</>, 'info');
                    setTimeout(() => {
                        addLog(<><span className="text-primary">EVT:</span> <span className="text-white underline">PaymentTeleported</span> <span className="text-terminal-green">SUCCESS</span> - 100 mUSDC</>, 'success');
                        setIsSimulating(false);
                        toast.success("Simulation Complete: Teleportation Successful!", {
                            style: { background: '#211111', color: '#4ade80', border: '1px solid #4ade80' }
                        });
                    }, 1000);
                }, 1500);
            }, 1500);
        }, 1000);
    };

    return (
        <div className="text-slate-100 min-h-screen overflow-x-hidden font-display" style={{ backgroundColor: '#211111' }}>
            <Toaster position="bottom-right" />
            <div className="layout-container flex flex-col h-full grow" style={{ backgroundColor: '#211111', minHeight: '100vh' }}>

                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-terminal-accent px-6 py-3 bg-admin-dark/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-4 text-primary hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined text-3xl">terminal</span>
                            <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight uppercase terminal-font">NEXUS Admin</h2>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link className="text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest terminal-font" href="/dashboard">Dashboard</Link>
                            <a className="text-primary text-xs font-bold uppercase tracking-widest terminal-font border-b-2 border-primary" href="#">Contracts</a>
                            <a className="text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest terminal-font" href="#">Logs</a>
                            <a className="text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest terminal-font" href="#">Settings</a>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 items-center">
                        <div className="hidden sm:flex items-center bg-terminal-accent rounded-lg px-3 py-1.5">
                            <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-48 placeholder:text-slate-500 font-mono focus:outline-none" placeholder="Search system logs..." type="text" />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-terminal-accent text-slate-300 hover:bg-primary/20 hover:text-primary transition-all">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="h-10 w-10 rounded-full border-2 border-primary/40 bg-cover bg-center" aria-label="Admin user avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzzHUkBvpRLD3GYQhApAMPqiyojUrfC9GMl6tzJ3VZV4cVr0aXZtex_bMt4txluBEcbRlqKBbrg7AzrXvp1Py8Bzqj35Y6U07Uqmo3BjWQ5FWMpAhf66gguRW0npyDWEZdWo4coCF_AFeSCMgxhBUqLGI7wrGXccj6afP2A5IHLc7hpvFY1W5ojQVXlq4JAkmmkmPWFzlgrJkAOdDLdUOb4K7RyEzclfb5avYyHCCZQXWwjXtmvxpecQvlbDHh5mtvfSRuk_TUmhg')" }}></div>
                        </div>
                    </div>
                </header>

                <main className="flex flex-col lg:flex-row gap-6 p-6 max-w-[1600px] mx-auto w-full">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex flex-col gap-6">
                        <div className="bg-terminal-accent/30 p-4 rounded-xl border border-terminal-accent/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">hub</span>
                                </div>
                                <div>
                                    <h1 className="text-slate-100 text-sm font-bold terminal-font">NEXUS Core</h1>
                                    <p className="text-primary/70 text-xs font-mono">v2.4.0-stable</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium">
                                    <span className="material-symbols-outlined text-lg">dashboard</span>
                                    <span>Overview</span>
                                </div>
                                {[
                                    { icon: "memory", label: "Contracts" },
                                    { icon: "terminal", label: "Live Logs" },
                                    { icon: "auto_fix", label: "Automation" },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-terminal-accent text-slate-400 hover:text-slate-200 transition-all text-sm font-medium cursor-pointer">
                                        <span className="material-symbols-outlined text-lg">{icon}</span>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl">
                            <p className="text-primary text-[10px] font-bold uppercase tracking-tighter mb-1">Status Warning</p>
                            <p className="text-slate-300 text-xs leading-relaxed italic">&apos;For Demonstration Purposes Only&apos; - Production write access restricted.</p>
                        </div>
                    </aside>

                    {/* Main Console */}
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary/60 text-xs font-mono">
                                <span>/admin</span><span>/</span><span>developer-console</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-100 terminal-font tracking-tight">Developer Console</h2>
                        </div>

                        {/* System Status Cards */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "Vault Contract", address: "0x71C765...D4C731", status: "Online", statusColor: "text-terminal-green bg-terminal-green/20", icon: "account_balance_wallet", detail: "Balance: 142.08 ETH" },
                                { label: "Billing Engine", address: "0x3A2B9C...E5F812", status: "Online", statusColor: "text-terminal-green bg-terminal-green/20", icon: "receipt_long", detail: "Processed: 1,204 calls" },
                                { label: "Teleporter Bridge", address: "0x9F1D8E...C0B4A2", status: "Busy", statusColor: "text-primary bg-primary/20", icon: "sensors", detail: "Latency: 14ms" },
                            ].map(({ label, address, status, statusColor, icon, detail }) => (
                                <div key={label} className="bg-terminal-accent/20 border border-terminal-accent p-4 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase terminal-font">{label}</span>
                                        <span className={`${statusColor} text-[10px] px-2 py-0.5 rounded-full font-mono uppercase`}>{status}</span>
                                    </div>
                                    <p className="text-slate-200 font-mono text-xs break-all mb-3 bg-black/40 p-2 rounded">{address}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                        <span className="material-symbols-outlined text-xs">{icon}</span>
                                        <span>{detail}</span>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Action and Logs */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Manual Trigger Form */}
                            <div className="bg-terminal-accent/20 border border-terminal-accent rounded-xl flex flex-col">
                                <div className="border-b border-terminal-accent p-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">settings_input_component</span>
                                    <h3 className="text-sm font-bold uppercase terminal-font tracking-wider">Manual Execution Trigger</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-5 flex-1">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase terminal-font ml-1">User Wallet Address</label>
                                        <div className="relative">
                                            <input className="w-full bg-black/40 border border-terminal-accent rounded-lg px-4 py-3 text-sm font-mono focus:ring-1 focus:ring-primary focus:border-primary text-slate-200 outline-none"
                                                type="text" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-600 text-sm">person</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase terminal-font ml-1">Service ID</label>
                                        <div className="relative">
                                            <input className="w-full bg-black/40 border border-terminal-accent rounded-lg px-4 py-3 text-sm font-mono focus:ring-1 focus:ring-primary focus:border-primary text-slate-200 outline-none"
                                                type="text" value={serviceId} onChange={(e) => setServiceId(e.target.value)} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-600 text-sm">dns</span>
                                        </div>
                                    </div>
                                    <button onClick={handleSimulate} disabled={isSimulating}
                                        className="mt-auto w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] terminal-font uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isSimulating ? (
                                            <><span className="material-symbols-outlined text-lg animate-spin">refresh</span>Simulating...</>
                                        ) : (
                                            <><span className="material-symbols-outlined text-lg">refresh</span>Simulate Monthly Renewal</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Teleporter Log */}
                            <div className="bg-black/40 border border-terminal-accent rounded-xl flex flex-col h-[400px]">
                                <div className="border-b border-terminal-accent p-4 flex justify-between items-center bg-terminal-accent/10">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-terminal-green text-sm">event_list</span>
                                        <h3 className="text-sm font-bold uppercase terminal-font tracking-wider">Teleporter Log</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                    </div>
                                </div>
                                <div className="p-4 overflow-y-auto custom-scrollbar flex-1 font-mono text-[11px] space-y-3">
                                    {logs.map((log, index) => (
                                        <div key={index} className={`flex gap-3 text-slate-400 ${log.type === 'system' ? 'animate-pulse' : ''}`}>
                                            <span className="text-primary/50 shrink-0">[{log.time}]</span>
                                            <p>{log.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-auto border-t border-terminal-accent bg-admin-dark/50 p-4">
                    <div className="max-w-[1600px] mx-auto flex flex-wrap justify-between items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terminal-green"></span><span>Node Latency: 14ms</span></div>
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-terminal-green"></span><span>Block Height: 18,992,123</span></div>
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span><span>Live Sync Active</span></div>
                        </div>
                        <div className="text-slate-400">NEXUS ADMIN PANEL V2.4 © 2024</div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
