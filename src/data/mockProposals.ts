import type { Proposal } from '../types'

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 12,
    title: "Adopt dark theme by default",
    description: "Switch the default UI theme to dark across all apps.",
    details: "Rationale: Dark theme reduces eye strain and aligns with community preference.\n\nScope:\n- Update Tailwind config\n- Ensure charts + brand colors pass contrast\n- Migrate docs theme",
    author: "0x92d3…a1b4",
    createdAt: 1756425600, // Aug 28, 2025
    deadline: 1757030400, // Sep 5, 2025 (open)
    yes: 18,
    no: 3,
  },
  {
    id: 11,
    title: "Increase staking rewards to 6%",
    description: "Raise APY from 5% → 6% for Q4 to attract more LPs.",
    details: "We'll offset the increase by reducing protocol treasury allocation by 1% for the same period.",
    author: "0x4c8f…09e2",
    createdAt: 1756339200, // Aug 27, 2025
    deadline: 1757462400, // Sep 10, 2025 (open)
    yes: 27,
    no: 12,
  },
  {
    id: 10,
    title: "Fund community grants round #3",
    description: "Allocate 50k USDC for small community tools and docs.",
    details: "This funding round will support:\n- Documentation improvements\n- Community tools development\n- Educational content creation\n- Developer onboarding resources",
    author: "0xab11…fe33",
    createdAt: 1756252800, // Aug 26, 2025
    deadline: 1757289600, // Sep 8, 2025 (open)
    yes: 42,
    no: 7,
  },
  {
    id: 9,
    title: "Enable testnet faucet rate-limit",
    description: "Prevent abuse by limiting faucet to once per 24 hours.",
    details: "Implementation details:\n- Rate limiting per wallet address\n- 24-hour cooldown period\n- Maximum 0.1 ETH per request\n- Captcha verification for new addresses",
    author: "0x22aa…cc77",
    createdAt: 1756166400, // Aug 25, 2025
    deadline: 1756512000, // Aug 30, 2025 (closed)
    yes: 35,
    no: 5,
  },
  {
    id: 8,
    title: "Add Base network support",
    description: "Deploy contracts to Base and add RPC selection in UI.",
    details: "Deployment plan:\n- Smart contract deployment on Base\n- Update frontend to support Base RPC\n- Add network switching functionality\n- Ensure compatibility with existing features",
    author: "0x5e5e…0d0d",
    createdAt: 1756080000, // Aug 24, 2025
    deadline: 1756339200, // Aug 28, 2025 (closed)
    yes: 51,
    no: 2,
    },
    {
    id: 7,
    title: "Implement comprehensive multi-signature treasury management system with tiered approval thresholds and emergency protocols",
    description: "Establish a robust multi-signature wallet infrastructure for treasury management that includes role-based access controls, tiered approval requirements based on transaction amounts, emergency fund access protocols, and comprehensive audit trails for all treasury operations to ensure maximum security and transparency.",
    details: "Technical Implementation: 1. Multi-Signature Wallet Setup: - Deploy Gnosis Safe with 5-of-7 signature requirement for standard operations - Implement 3-of-5 emergency council for time-sensitive decisions - Create separate wallets for different fund categories (operations, grants, reserves) 2. Tiered Approval System: - Tier 1 (< 10k USDC): 3-of-7 signatures, 24-hour timelock - Tier 2 (10k-100k USDC): 5-of-7 signatures, 48-hour timelock - Tier 3 (> 100k USDC): 7-of-7 signatures, 72-hour timelock + community notification 3. Emergency Protocols: - Designated emergency fund (max 5% of treasury) - Emergency council can access within 6 hours with 3-of-5 approval - Automatic community notification and post-action reporting required 4. Access Controls & Roles: - Treasury Manager: Can propose all transactions - Council Members: Can approve/reject proposals - Emergency Responders: Can access emergency funds only - Auditor: Read-only access to all transaction history 5. Audit & Transparency Features: - On-chain transaction logging with metadata - Monthly automated treasury reports - Real-time dashboard showing pending approvals - Integration with existing governance portal 6. Security Measures: - Hardware wallet requirement for all signers - Mandatory 2FA for web interface access - Regular key rotation schedule (quarterly) - Smart contract security audits before deployment Deployment Timeline: - Week 1-2: Smart contract development and testing - Week 3: Security audit and penetration testing - Week 4: Testnet deployment and user acceptance testing - Week 5-6: Mainnet deployment and gradual fund migration - Week 7: Full system activation and documentation Success Metrics: - Zero security incidents in first 6 months - 100% of transactions properly logged and auditable - Average approval time under tier thresholds - Positive community feedback on transparency improvements",
    author: "0x1f2e…8c9d",
    createdAt: 1755993600, // Aug 23, 2025
    deadline: 1756339200, // Aug 28, 2025 (closed)
    yes: 73,
    no: 14,
},
]
