import type { Proposal } from '../types'

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 12,
    title: "Adopt dark theme by default",
    description: "Switch the default UI theme to dark across all apps.",
    details: "Rationale: Dark theme reduces eye strain and aligns with community preference.\n\nScope:\n- Update Tailwind config\n- Ensure charts + brand colors pass contrast\n- Migrate docs theme",
    author: "0x92d3…a1b4",
    createdAt: 1724668800, // Aug 26, 2025
    deadline: 1725360000, // Sep 3, 2025 (open)
    yes: 18,
    no: 3,
  },
  {
    id: 11,
    title: "Increase staking rewards to 6%",
    description: "Raise APY from 5% → 6% for Q4 to attract more LPs.",
    details: "We'll offset the increase by reducing protocol treasury allocation by 1% for the same period.",
    author: "0x4c8f…09e2",
    createdAt: 1724582400, // Aug 25, 2025
    deadline: 1725273600, // Sep 2, 2025 (open)
    yes: 27,
    no: 12,
  },
  {
    id: 10,
    title: "Fund community grants round #3",
    description: "Allocate 50k USDC for small community tools and docs.",
    details: "This funding round will support:\n- Documentation improvements\n- Community tools development\n- Educational content creation\n- Developer onboarding resources",
    author: "0xab11…fe33",
    createdAt: 1724496000, // Aug 24, 2025
    deadline: 1725840000, // Sep 8, 2025 (open)
    yes: 42,
    no: 7,
  },
  {
    id: 9,
    title: "Enable testnet faucet rate-limit",
    description: "Prevent abuse by limiting faucet to once per 24 hours.",
    details: "Implementation details:\n- Rate limiting per wallet address\n- 24-hour cooldown period\n- Maximum 0.1 ETH per request\n- Captcha verification for new addresses",
    author: "0x22aa…cc77",
    createdAt: 1724409600, // Aug 23, 2025
    deadline: 1724668800, // Aug 26, 2025 (closed)
    yes: 35,
    no: 5,
  },
  {
    id: 8,
    title: "Add Base network support",
    description: "Deploy contracts to Base and add RPC selection in UI.",
    details: "Deployment plan:\n- Smart contract deployment on Base\n- Update frontend to support Base RPC\n- Add network switching functionality\n- Ensure compatibility with existing features",
    author: "0x5e5e…0d0d",
    createdAt: 1724323200, // Aug 22, 2025
    deadline: 1724582400, // Aug 25, 2025 (closed)
    yes: 51,
    no: 2,
  },
]
