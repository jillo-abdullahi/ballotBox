# BallotBox 🗳️

A modern, decentralized voting platform built on Ethereum that enables communities to create and vote on proposals with a beautiful, intuitive interface.

![BallotBox](https://img.shields.io/badge/Built%20with-React%2B%20TypeScript-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-purple)
![Network](https://img.shields.io/badge/Network-Sepolia%20Testnet-orange)

## ✨ Features

### 🗳️ **Decentralized Voting**
- Create proposals with title, description, and detailed content
- Yes/No voting with transparent on-chain tallying
- Real-time vote counting and proposal status tracking
- Deadline-based proposal lifecycle management

### 🎨 **Modern User Experience**
- Responsive, dark-themed interface built with Tailwind CSS
- Skeleton loading states for smooth UX
- Smart contract transaction modals with real-time status
- Advanced filtering and search functionality

### 🔐 **Web3 Integration**
- RainbowKit wallet connection with support for multiple wallets
- Wagmi hooks for efficient blockchain interactions
- Optimistic UI updates for instant feedback
- Automatic wallet switching and account management

### 📱 **User-Friendly Features**
- Filter proposals by "All" or "My Proposals"
- Real-time search across titles, descriptions, and content
- Pagination for optimal performance
- Beautiful voting statistics with progress bars
- Author identification with Ethereum addresses

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 
- **Web3**: Wagmi v2 + RainbowKit + Viem
- **Blockchain**: Ethereum (Sepolia Testnet)
- **State Management**: React Hooks + TanStack Query
- **Routing**: TanStack Router
- **Icons**: React Icons
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jillo-abdullahi/ballotBox.git
   cd ballotBox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```bash
   # Required environment variables
   VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address
   VITE_INFURA_API_KEY=your_infura_api_key
   
   # Optional IPFS configuration (for enhanced content storage)
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) | ✅ |
| `VITE_CONTRACT_ADDRESS` | Deployed smart contract address on Sepolia | ✅ |
| `VITE_INFURA_API_KEY` | Infura API key for Ethereum RPC | ✅ |
| `VITE_PINATA_API_KEY` | Pinata API key for IPFS storage | ⚪ |
| `VITE_PINATA_SECRET_API_KEY` | Pinata secret key for IPFS storage | ⚪ |

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContractTransactionModal.tsx
│   ├── ProposalCard.tsx
│   ├── VoteModal.tsx
│   └── ...
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Proposals listing with filtering
│   ├── ProposalPage.tsx # Individual proposal view
│   └── CreateProposal.tsx # Proposal creation form
├── hooks/              # Custom React hooks
│   ├── useCreateProposal.ts
│   ├── useVoting.ts
│   └── useDebounce.ts
├── utils/              # Utility functions
│   ├── ipfs.ts        # Content storage utilities
│   └── index.ts       # General utilities
├── config/             # Configuration files
│   ├── contract.ts    # Smart contract ABI and address
│   └── wagmi.ts       # Wagmi configuration
└── types/              # TypeScript type definitions
```

## 🔗 Smart Contract

The BallotBox smart contract is deployed on **Sepolia Testnet** and provides:

- **Proposal Creation**: Submit proposals with metadata and content hashes
- **Voting System**: Cast yes/no votes with duplicate prevention
- **Query Functions**: Retrieve proposals, vote counts, and user-specific data
- **Access Control**: Author-based proposal management
- **Event Logging**: Transparent on-chain activity tracking

### Key Contract Functions

```solidity
// Create a new proposal
function createProposal(string title, string description, bytes32 detailsHash, uint32 deadline)

// Cast a vote (true = yes, false = no)
function vote(uint256 proposalId, bool vote)

// Get proposal details
function getProposal(uint256 proposalId) 

// Get proposals with pagination
function getProposals(uint256 offset, uint256 limit)

// Get proposals by author
function getProposalsByAuthor(address author, uint256 offset, uint256 limit)
```

## 🎯 Usage

### Creating Proposals
1. Connect your wallet using RainbowKit
2. Navigate to "Create Proposal"
3. Fill in title, description, and optional detailed content
4. Set deadline for voting
5. Confirm transaction in your wallet

### Voting on Proposals
1. Browse proposals on the homepage
2. Click on any proposal to view details
3. Click "Vote Yes" or "Vote No"
4. Confirm the voting transaction
5. See real-time vote updates

### Filtering & Search
- Use the filter dropdown to view "All Proposals" or "My Proposals"
- Search across titles, descriptions, and content
- Navigate through pages with built-in pagination

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Code formatting (via ESLint integration)
- **Vite**: Fast development and optimized builds

## 📱 Responsive Design

BallotBox is fully responsive and optimized for:
- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Adapted layouts with collapsible navigation
- **Mobile**: Touch-friendly interface with stacked components

## 🔒 Security Features

- **Wallet Signature Verification**: All actions require wallet signatures
- **Smart Contract Validation**: On-chain validation prevents invalid operations
- **Optimistic UI**: Safe fallback for all blockchain interactions
- **Error Handling**: Comprehensive error states and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- [RainbowKit](https://rainbowkit.com/) for beautiful wallet connections
- [Wagmi](https://wagmi.sh/) for React hooks for Ethereum
- [Viem](https://viem.sh/) for TypeScript Ethereum interactions
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [React Icons](https://react-icons.github.io/react-icons/) for beautiful icons

---

**Built with ❤️ for the decentralized future**
