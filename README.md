# Base-Will

A decentralized application for managing time-locked cryptocurrency assets on the Base blockchain. This DApp allows sponsors to create, manage, and distribute time-locked coins to recipients.

## 🎯 Features

- **Timed Distribution**: Set specific dates for asset distribution to beneficiaries
- **Multi-Asset Support**: Compatible with any coin type on the Base blockchain
- **Secure Management**: Full control over lockups with ability to modify or revoke
- **User-Friendly Interface**: Modern Vite-powered frontend for easy interaction
- **Real-Time Updates**: Live tracking of locked assets and claim status

## 🏗️ Architecture

### Smart Contract
The core functionality is implemented in the `locked_coins` Move module, which provides:

- Creation of time-locked coin deposits
- Management of locks (update/cancel)
- Claiming of unlocked coins by recipients
- Comprehensive event emission for frontend tracking

### Frontend
Built with:
- Vite
- React
- Petra Wallet integration
- Tailwind CSS for styling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Petra Wallet browser extension
- Access to Base network (testnet/mainnet)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/locked-coins-dapp.git
cd locked-coins-dapp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## 💡 Usage

### For Sponsors

1. **Initialize Account**
```typescript
// Initialize sponsor account for a specific coin type
const tx = await initAndAddLockedCoins(
  recipient,
  amount,
  unlockTimeSeconds
);
await tx.wait();
```

2. **Create Locks**
Create time-locked deposits for recipients:
- Set recipient address
- Specify amount
- Define unlock time

3. **Manage Locks**
- Update lockup periods
- Cancel locks if needed
- View all active locks

### For Recipients

1. **View Locks**
Check your pending locked coins:
```typescript
const lockInfo = await getRecipientLockInfo(
  sponsorAddress,
  recipientAddress
);
console.log(lockInfo);
```

2. **Claim Unlocked Coins**
Claim your coins once the unlock time has passed:
```typescript
const tx = await claim(sponsorAddress);
await tx.wait();
```

## 🔒 Security Considerations

- All functions have appropriate access controls
- Withdrawal addresses can only be updated when no active locks exist
- Events are emitted for all significant state changes
- Frontend implements additional validation layer

## 🛠️ Smart Contract API

### Key Functions

#### `init_and_add_locked_coins<CoinType>`
Initializes a sponsor account and creates the first lock.

#### `claim<CoinType>`
Allows recipients to claim unlocked coins.

#### `update_lockup<CoinType>`
Enables sponsors to modify existing lock periods.

#### `cancel_lockup<CoinType>`
Permits sponsors to cancel locks and return coins.

### View Functions

#### `get_recipient_lock_info<CoinType>`
Retrieves lock details for a specific recipient.

#### `total_locks<CoinType>`
Returns the total number of active locks for a sponsor.

## 📊 Frontend Components

- **LockCreation**: Form for creating new locks
- **LockManagement**: Interface for updating/canceling locks
- **RecipientDashboard**: View and claim unlocked coins
- **TransactionHistory**: List of all lock-related transactions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Base team for the blockchain platform
- Move language developers
- Our amazing community of testers and early adopters