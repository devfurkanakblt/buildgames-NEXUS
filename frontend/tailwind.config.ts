import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Shared across all pages
                "primary": "#e74040",
                "background-light": "#f8f6f6",
                // Landing page
                "background-dark": "#050505",
                // Dashboard, Mock Service, Admin
                "dashboard-dark": "#120a0a",
                "admin-dark": "#211111",
                "neutral-dark": "#1c1212",
                "border-dark": "#382929",
                "terminal-accent": "#382929",
                "terminal-green": "#4ade80",
                // Mock Service (red-themed)
                "mock-bg": "#120808",
                "mock-neutral-800": "#2a1a1a",
                "mock-neutral-900": "#1c1212",
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
