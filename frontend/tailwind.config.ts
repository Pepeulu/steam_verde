import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#14100d",
        ironwood: "#241c14",
        ironwood2: "#2e241a",
        ember: "#d9691f",
        emberlight: "#f0954a",
        bloodmoon: "#7a2020",
        sage: "#4a6741",
        sagelight: "#6e9161",
        bone: "#e8dcc0",
        bonedim: "#a89a7c",
        gold: "#c9a227",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-spectral)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        grain: "url('/textures/grain.svg')",
        "ember-glow": "radial-gradient(circle at 50% 0%, rgba(217,105,31,0.18), transparent 60%)",
      },
      boxShadow: {
        carved: "inset 0 0 0 1px rgba(201,162,39,0.35), 0 8px 24px rgba(0,0,0,0.55)",
        emberglow: "0 0 18px rgba(217,105,31,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
