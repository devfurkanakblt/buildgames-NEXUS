**STEP 4: Frontend Integration (Next.js & Wagmi)**

Write a React component named `SubscriptionDashboard.tsx` for the user.
Requirements:
- Tech: Next.js, TailwindCSS, Wagmi v2.
- UI: A dark-themed, sleek dashboard (Cyberpunk/Enterprise vibe) showing the user's USDC balance.
- Action: A button called "Approve Nexus Vault". When clicked, it calls the `approve` function on the MockUSDC contract, giving the `NexusVault` contract permission to spend funds.
- Include Toast notifications for transaction pending and success states.