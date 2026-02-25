"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden font-display text-slate-100 selection:bg-red-500/30" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Hero Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] hero-gradient pointer-events-none"></div>

      <div className="layout-container flex h-full grow flex-col items-center">
        <div className="w-full max-w-[1200px] px-6 lg:px-10">

          {/* Top Nav Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 py-4">
            <div className="flex items-center gap-3 text-white">
              <div className="size-8 bg-[#ff3b3b] rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">hub</span>
              </div>
              <h2 className="text-xl font-black leading-tight tracking-tighter uppercase">NEXUS</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8 items-center">
              <nav className="hidden md:flex items-center gap-9">
                <a className="text-slate-300 hover:text-white transition-colors text-xs font-bold" href="#how-it-works">How It Works</a>
                <a className="text-slate-300 hover:text-white transition-colors text-xs font-bold" href="#">Docs</a>
                <a className="text-slate-300 hover:text-white transition-colors text-xs font-bold" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              </nav>
              <Link href="/dashboard">
                <button className="flex cursor-pointer items-center justify-center rounded-md h-10 px-6 bg-[#ff3b3b] hover:bg-[#ff4f4f] text-white text-sm font-bold transition-colors">
                  <span>Launch App</span>
                </button>
              </Link>
            </div>
          </header>

          {/* Hero Section */}
          <main className="py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-8 text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#ff3b3b]/30 bg-[#ff3b3b]/10 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3b3b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3b3b]"></span>
                  </span>
                  <span className="text-[10px] font-black text-[#ff3b3b] tracking-widest uppercase">Avalanche Teleporter Ready</span>
                </div>
                <div className="flex flex-col gap-6">
                  <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                    Native Cross-<br />Chain<br />
                    <span className="text-[#ff3b3b]">Subscriptions</span><br />
                    on Avalanche
                  </h1>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    Pay your App-Chain subscriptions directly from your C-Chain USDC balance. No bridging, no hassle. Powered by Avalanche Teleporter for seamless cross-subnet communication.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Link href="/dashboard">
                    <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-[#ff3b3b] hover:bg-[#ff4f4f] text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all">
                      Launch App
                    </button>
                  </Link>
                  <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-transparent border border-white/20 text-white text-sm font-bold hover:bg-white/5 transition-all">
                    Read Docs
                  </button>
                </div>
              </div>

              {/* Visual Asset */}
              <div className="relative rounded-[2rem] aspect-square overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#4a1111] via-[#2a0808] to-[#1a0505]">
                <div className="relative w-full h-full flex items-center justify-center z-10">
                  <div className="absolute flex flex-col items-center gap-12">
                    <div className="flex items-center gap-12">
                      <div className="p-5 bg-black/90 rounded-2xl flex flex-col items-center justify-center w-24 h-28 gap-2 border border-white/5">
                        <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                        <p className="text-[8px] font-black text-white uppercase tracking-wider">C-CHAIN</p>
                      </div>
                      <div className="p-5 bg-black/90 rounded-2xl flex flex-col items-center justify-center w-24 h-28 gap-2 border border-white/5">
                        <span className="material-symbols-outlined text-primary text-3xl">cloud</span>
                        <p className="text-[8px] font-black text-white uppercase tracking-wider">SUBNET</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="w-[180px] h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full glow-line"></div>
                      <p className="text-[10px] font-black text-white/50 tracking-[0.3em] uppercase">Cross-Chain Message</p>
                    </div>
                  </div>
                </div>
                {/* Abstract Waves Background */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-30 pointer-events-none"
                  alt="Dynamic abstract energy waves"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc3PVgIveSYWZp5I_-jE1I-BFpt0H_UlXh5Bha--7MURGfRvceRd5PSz9lpSEIj9wtP0azHxi5WVg3WPXFBOPHhxasKbd9QnLqEhOdH27DL_ER8Zzv8tlOuPgKod8zTNLp6r_0Wgk42vAPt4JSn94FXNwJwVKGI8csR5E-twH51-VLN3qxjI76apFj5wzlG8azzID6Qzj4jYipU_vb8XC1jsia1SyfKB-2jLFbGMrDu03aUYcGGaSTpndcQ-hcxAaqBGloSEGEIPM"
                />
              </div>
            </div>
          </main>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 flex flex-col gap-16">
            <div className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-white text-3xl md:text-[44px] font-black leading-tight tracking-tight">
                How It Works
              </h2>
              <div className="h-1 w-16 bg-[#ff3b3b] rounded-full"></div>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium mt-2">
                Seamlessly manage your app-chain subscriptions from your primary wallet<br />without the friction of manual bridging.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="relative flex flex-col gap-6 rounded-[2rem] p-8 overflow-hidden bg-gradient-to-br from-[#2a0808] to-[#110404]">
                <div className="absolute top-6 right-6 text-[#4a1111] text-6xl font-black italic select-none">01</div>
                <div className="relative z-10 flex flex-col gap-20 h-full">
                  <div className="size-12 rounded-xl bg-[#ff3b3b]/10 flex items-center justify-center text-[#ff3b3b]">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <h3 className="text-white text-lg font-bold">1. Keep funds on C-Chain</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Maintain your USDC liquidity on the Avalanche C-Chain. No need to bridge funds to multiple subnets for every individual app.
                    </p>
                  </div>
                </div>
              </div>
              {/* Step 2 */}
              <div className="relative flex flex-col gap-6 rounded-[2rem] p-8 overflow-hidden bg-gradient-to-br from-[#2a0808] to-[#110404]">
                <div className="absolute top-6 right-6 text-[#4a1111] text-6xl font-black italic select-none">02</div>
                <div className="relative z-10 flex flex-col gap-20 h-full">
                  <div className="size-12 rounded-xl bg-[#ff3b3b]/10 flex items-center justify-center text-[#ff3b3b]">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <h3 className="text-white text-lg font-bold">2. Approve Nexus Vault</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Grant permission to the Nexus smart contract to manage your specific subscription limits. You retain full control.
                    </p>
                  </div>
                </div>
              </div>
              {/* Step 3 */}
              <div className="relative flex flex-col gap-6 rounded-[2rem] p-8 overflow-hidden bg-gradient-to-br from-[#2a0808] to-[#110404]">
                <div className="absolute top-6 right-6 text-[#4a1111] text-6xl font-black italic select-none">03</div>
                <div className="relative z-10 flex flex-col gap-20 h-full">
                  <div className="size-12 rounded-xl bg-[#ff3b3b]/10 flex items-center justify-center text-[#ff3b3b]">
                    <span className="material-symbols-outlined">sync_alt</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <h3 className="text-white text-lg font-bold">3. Apps auto-pull</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Subnet-based applications trigger payments automatically via Teleporter, pulling USDC across chains instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 mb-10">
            <div className="rounded-[2rem] bg-gradient-to-b from-[#3a0d0d] to-[#110404] p-16 md:p-24 text-center flex flex-col items-center gap-6">
              <h2 className="text-white text-3xl md:text-[44px] font-black tracking-tight max-w-xl leading-[1.1]">
                Ready to simplify your subscriptions?
              </h2>
              <p className="text-slate-300 text-sm max-w-[400px] mx-auto leading-relaxed mt-2">
                Connect your wallet and start using Nexus on the Avalanche network today. Experience the future of cross-chain payments.
              </p>
              <Link href="/dashboard" className="mt-6">
                <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-10 bg-[#ff3b3b] hover:bg-[#ff4f4f] text-white text-[15px] font-bold shadow-lg shadow-[#ff3b3b]/20 transition-all">
                  Launch App
                </button>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-auto flex flex-col gap-12 border-t border-primary/10 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="size-6 bg-primary rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs">hub</span>
                </div>
                <h2 className="text-lg font-bold tracking-tighter uppercase">NEXUS</h2>
              </div>
              <div className="flex items-center gap-10">
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Docs</a>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Security</a>
                <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Terms</a>
              </div>
              <div className="flex items-center gap-6">
                <a className="text-slate-500 hover:text-primary transition-colors" href="#">
                  <svg className="size-6" fill="currentColor" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM172,160a4,4,0,0,1-4,4H136v20a4,4,0,0,1-4,4H124a4,4,0,0,1-4-4V164H88a4,4,0,0,1-4-4V152a4,4,0,0,1,4-4h32V128H88a4,4,0,0,1-4-4V112a4,4,0,0,1,4-4h32V88a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4v20h32a4,4,0,0,1,4,4v12a4,4,0,0,1-4,4H136v20h32a4,4,0,0,1,4,4Z"></path></svg>
                </a>
                <a className="text-slate-500 hover:text-primary transition-colors" href="#">
                  <svg className="size-6" fill="currentColor" viewBox="0 0 256 256"><path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Z"></path></svg>
                </a>
                <a className="text-slate-500 hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">terminal</span>
                </a>
              </div>
            </div>
            <div className="text-center text-slate-600 dark:text-slate-500 text-sm">
              © 2024 NEXUS. Built with passion on Avalanche.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
