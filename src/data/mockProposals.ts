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
{
    id: 7,
    title: "Implement comprehensive multi-signature treasury management system with tiered approval thresholds and emergency protocols",
    description: "Establish a robust multi-signature wallet infrastructure for treasury management that includes role-based access controls, tiered approval requirements based on transaction amounts, emergency fund access protocols, and comprehensive audit trails for all treasury operations to ensure maximum security and transparency.",
    details: "Technical Implementation:\n\n1. Multi-Signature Wallet Setup:\n   - Deploy Gnosis Safe with 5-of-7 signature requirement for standard operations\n   - Implement 3-of-5 emergency council for time-sensitive decisions\n   - Create separate wallets for different fund categories (operations, grants, reserves)\n\n2. Tiered Approval System:\n   - Tier 1 (< 10k USDC): 3-of-7 signatures, 24-hour timelock\n   - Tier 2 (10k-100k USDC): 5-of-7 signatures, 48-hour timelock\n   - Tier 3 (> 100k USDC): 7-of-7 signatures, 72-hour timelock + community notification\n\n3. Emergency Protocols:\n   - Designated emergency fund (max 5% of treasury)\n   - Emergency council can access within 6 hours with 3-of-5 approval\n   - Automatic community notification and post-action reporting required\n\n4. Access Controls & Roles:\n   - Treasury Manager: Can propose all transactions\n   - Council Members: Can approve/reject proposals\n   - Emergency Responders: Can access emergency funds only\n   - Auditor: Read-only access to all transaction history\n\n5. Audit & Transparency Features:\n   - On-chain transaction logging with metadata\n   - Monthly automated treasury reports\n   - Real-time dashboard showing pending approvals\n   - Integration with existing governance portal\n\n6. Security Measures:\n   - Hardware wallet requirement for all signers\n   - Mandatory 2FA for web interface access\n   - Regular key rotation schedule (quarterly)\n   - Smart contract security audits before deployment\n\nDeployment Timeline:\n- Week 1-2: Smart contract development and testing\n- Week 3: Security audit and penetration testing\n- Week 4: Testnet deployment and user acceptance testing\n- Week 5-6: Mainnet deployment and gradual fund migration\n- Week 7: Full system activation and documentation\n\nSuccess Metrics:\n- Zero security incidents in first 6 months\n- 100% of transactions properly logged and auditable\n- Average approval time under tier thresholds\n- Positive community feedback on transparency improvements",
    author: "0x1f2e…8c9d",
    createdAt: 1724236800, // Aug 21, 2025
    deadline: 1724927400, // Aug 29, 2025 (closed)
    yes: 73,
    no: 14,
},
]
