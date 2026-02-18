---
name: helius
description: Complete Helius platform documentation for Solana development - RPC nodes, DAS API, Enhanced Transactions, WebSockets, LaserStream gRPC, Priority Fees, Webhooks, and more
auto-activate: false
requires:
  bins: []
  env:
    - HELIUS_API_KEY
---

# Helius - Solana Developer Platform

Helius is the leading Solana RPC and infrastructure platform providing fast, reliable APIs for building on Solana.

## Quick Start

### Get API Key (Agents)

Agents can programmatically create accounts and get API keys:

```bash
# Install CLI
npm install -g helius-cli

# Generate keypair
helius keygen
# Returns wallet address to fund

# Fund wallet with:
# - 1 USDC (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)
# - ~0.001 SOL

# Signup and get API key
helius signup --json
```

Success response:
```json
{
  "status": "SUCCESS",
  "apiKey": "your-api-key-here",
  "endpoints": {
    "mainnet": "https://mainnet.helius-rpc.com/?api-key=your-api-key",
    "devnet": "https://devnet.helius-rpc.com/?api-key=your-api-key"
  },
  "credits": 1000000
}
```

### Endpoints

- **Mainnet RPC**: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`
- **Mainnet RPC (Beta)**: `https://beta.helius-rpc.com/?api-key=YOUR_API_KEY`
- **Devnet RPC**: `https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY`
- **Mainnet WSS**: `wss://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`
- **Devnet WSS**: `wss://devnet.helius-rpc.com/?api-key=YOUR_API_KEY`

## Core APIs

### 1. Solana RPC (Standard)

Standard Solana JSON-RPC methods with enhanced performance.

```typescript
import { Connection } from '@solana/web3.js';

const connection = new Connection(
  'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY'
);

// Get account info
const accountInfo = await connection.getAccountInfo(publicKey);

// Get balance
const balance = await connection.getBalance(publicKey);

// Send transaction
const signature = await connection.sendTransaction(transaction, [signer]);
```

### 2. getTransactionsForAddress (Enhanced)

**Most powerful transaction history API** with filtering, sorting, and pagination.

```typescript
const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransactionsForAddress',
    params: [
      walletAddress,
      {
        transactionDetails: 'full', // or 'signatures'
        sortOrder: 'desc', // or 'asc'
        limit: 100,
        filters: {
          tokenAccounts: 'balanceChanged', // 'none', 'balanceChanged', 'all'
          status: 'succeeded', // 'succeeded', 'failed', 'any'
          blockTime: {
            gte: 1640995200,
            lte: 1641081600
          }
        }
      }
    ]
  })
});
```

**Key Features:**
- **Complete token history** - includes associated token accounts (ATAs)
- **Time-based filtering** - filter by blockTime, slot, or signature
- **Status filtering** - succeeded, failed, or any
- **Bidirectional sorting** - asc (chronological) or desc (newest first)
- **Efficient pagination** - keyset pagination with tokens

**Token Account Filters:**
- `none` - Only direct wallet transactions
- `balanceChanged` - Wallet + token balance changes (recommended)
- `all` - Wallet + all token account activity

**Use Cases:**
- Portfolio tracking
- Transaction history
- Token launch analysis
- Wallet funding history
- Audit & compliance

### 3. DAS API (Digital Asset Standard)

Unified interface for NFTs, compressed NFTs, and fungible tokens.

```typescript
// Get all assets owned by wallet
const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: walletAddress,
      page: 1,
      limit: 1000,
      displayOptions: {
        showFungible: true,
        showNativeBalance: true
      }
    }
  })
});

// Search assets
const searchResponse = await fetch(heliusRpcUrl, {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'searchAssets',
    params: {
      grouping: ['collection', collectionAddress],
      page: 1,
      limit: 1000
    }
  })
});

// Get asset by ID
const assetResponse = await fetch(heliusRpcUrl, {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getAsset',
    params: { id: assetId }
  })
});
```

**Methods:**
- `getAsset` - Get single asset details
- `getAssetsByOwner` - Get all assets for wallet
- `getAssetsByGroup` - Get assets by collection
- `searchAssets` - Advanced search with filters
- `getSignaturesForAsset` - Transaction history for cNFTs

### 4. Enhanced Transactions API

Parsed, human-readable transaction data with automatic labeling.

```typescript
const response = await fetch(
  `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transactions: [signature1, signature2]
    })
  }
);

// Response includes:
// - type: SWAP, NFT_SALE, TOKEN_MINT, etc.
// - source: MAGIC_EDEN, JUPITER, RAYDIUM, etc.
// - tokenTransfers: parsed token movements
// - nativeTransfers: SOL transfers
// - accountData: involved accounts
```

**Transaction Types:**
- SWAP, NFT_SALE, NFT_MINT, TOKEN_MINT
- TRANSFER, BURN, STAKE, UNSTAKE
- CREATE_ACCOUNT, CLOSE_ACCOUNT
- And 50+ more types

### 5. Priority Fee API

Optimal priority fee estimation for transaction landing.

```typescript
const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getPriorityFeeEstimate',
      params: [{
        accountKeys: [accountPubkey1, accountPubkey2],
        options: {
          recommended: true
        }
      }]
    })
  }
);

// Response:
// {
//   priorityFeeEstimate: 10000, // microlamports
//   priorityFeeLevels: {
//     min: 0,
//     low: 5000,
//     medium: 10000,
//     high: 50000,
//     veryHigh: 100000
//   }
// }
```

### 6. Webhooks

Real-time HTTP POST notifications for blockchain events.

```typescript
// Create webhook
const webhook = await fetch(
  `https://api.helius.xyz/v0/webhooks?api-key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webhookURL: 'https://your-server.com/webhook',
      transactionTypes: ['NFT_SALE', 'SWAP'],
      accountAddresses: [walletAddress],
      webhookType: 'enhanced'
    })
  }
);

// Webhook payload includes:
// - signature
// - type (NFT_SALE, SWAP, etc.)
// - source (MAGIC_EDEN, JUPITER, etc.)
// - tokenTransfers
// - nativeTransfers
// - timestamp
```

**Webhook Types:**
- `enhanced` - Parsed transaction data
- `raw` - Raw transaction data
- `discord` - Discord-formatted messages

### 7. WebSockets (Enhanced)

Powered by LaserStream with advanced filtering and automatic parsing.

```typescript
const ws = new WebSocket(
  `wss://mainnet.helius-rpc.com/?api-key=${apiKey}`
);

ws.on('open', () => {
  // Subscribe to account updates
  ws.send(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'accountSubscribe',
    params: [
      accountPubkey,
      {
        encoding: 'jsonParsed',
        commitment: 'confirmed'
      }
    ]
  }));

  // Subscribe to transaction updates
  ws.send(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'transactionSubscribe',
    params: [{
      accountInclude: [accountPubkey],
      accountRequired: [accountPubkey]
    }]
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Update:', message);
});
```

### 8. LaserStream gRPC

Lowest latency data streaming via gRPC with 24-hour replay.

```typescript
import { LaserStream } from '@helius-labs/laserstream';

const stream = new LaserStream({
  apiKey: process.env.HELIUS_API_KEY,
  network: 'mainnet'
});

// Subscribe to account updates
await stream.subscribeAccounts({
  accounts: [accountPubkey],
  onUpdate: (update) => {
    console.log('Account update:', update);
  }
});

// Subscribe to transactions
await stream.subscribeTransactions({
  accounts: [accountPubkey],
  onTransaction: (tx) => {
    console.log('Transaction:', tx);
  }
});

// Historical replay (last 24 hours)
await stream.replay({
  startTime: Date.now() - 3600000, // 1 hour ago
  accounts: [accountPubkey],
  onUpdate: (update) => {
    console.log('Historical update:', update);
  }
});
```

### 9. Helius Sender

Ultra-low latency transaction submission via staked connections + Jito.

```typescript
// Automatically routes through:
// 1. Staked connections (Solana's largest validator)
// 2. Jito bundles (MEV protection)

const signature = await connection.sendTransaction(
  transaction,
  [signer],
  {
    skipPreflight: false,
    preflightCommitment: 'confirmed'
  }
);

// 7 global endpoints for lowest latency
// 0 credits used
// Higher landing rates than standard sendTransaction
```

### 10. ZK Compression API

Compressed account and token operations (98% cost reduction).

```typescript
// Create compressed account
const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
  {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getCompressedAccount',
      params: { hash: accountHash }
    })
  }
);

// Compressed token operations
// - 5000x cheaper than standard token accounts
// - 160x cheaper than standard PDA accounts
// - No sacrifice in L1 performance or security
```

### 11. Wallet API

Query wallet data with structured REST endpoints.

```typescript
// Get wallet balances
const balances = await fetch(
  `https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${apiKey}`
);

// Get transaction history
const history = await fetch(
  `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${apiKey}`
);

// Get token transfers
const transfers = await fetch(
  `https://api.helius.xyz/v0/addresses/${walletAddress}/transfers?api-key=${apiKey}`
);
```

## Common Use Cases

### Trading Bot
```typescript
// Use:
// - Helius Sender (fast tx submission)
// - Priority Fee API (optimal fees)
// - LaserStream (real-time prices)

const priorityFee = await getPriorityFeeEstimate(accounts);
transaction.add(
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: priorityFee
  })
);

const signature = await connection.sendTransaction(transaction, [signer]);
```

### Wallet App
```typescript
// Use:
// - DAS API (getAssetsByOwner)
// - getTransactionsForAddress (complete history)
// - Wallet API (REST endpoints)

const assets = await getAssetsByOwner(walletAddress);
const history = await getTransactionsForAddress(walletAddress, {
  filters: { tokenAccounts: 'balanceChanged' }
});
```

### NFT Marketplace
```typescript
// Use:
// - DAS API (searchAssets, getAssetsByGroup)
// - Webhooks (track sales/listings)

const collection = await searchAssets({
  grouping: ['collection', collectionAddress]
});

// Setup webhook for sales
await createWebhook({
  transactionTypes: ['NFT_SALE'],
  accountAddresses: [collectionAddress]
});
```

### Token Launcher
```typescript
// Use:
// - Helius Sender (reliable tx landing)
// - Priority Fee API (optimal fees)
// - Webhooks (monitor new token)

const signature = await createToken(mint, [signer]);
await createWebhook({
  transactionTypes: ['TOKEN_MINT', 'SWAP'],
  accountAddresses: [mintAddress]
});
```

### Analytics Dashboard
```typescript
// Use:
// - Enhanced Transactions API (parsed data)
// - getTransactionsForAddress (historical data)

const transactions = await getTransactionsForAddress(address, {
  transactionDetails: 'full',
  filters: {
    blockTime: { gte: startTime, lte: endTime },
    status: 'succeeded'
  }
});

const parsed = await getEnhancedTransactions(
  transactions.map(tx => tx.signature)
);
```

## Key Concepts

| Term | Definition |
|------|------------|
| **DAS** | Digital Asset Standard - unified API for NFTs, tokens, and compressed assets |
| **cNFT** | Compressed NFT - 1000x cheaper to mint using merkle trees |
| **ZK Compression** | 98% storage cost reduction using zero-knowledge proofs |
| **Helius Sender** | Transaction submission via staked connections + Jito |
| **LaserStream** | Managed gRPC streaming with historical replay |
| **Priority Fee** | Additional fee (microlamports) to prioritize transactions |
| **Staked Connections** | Direct validator connections via stake-weighted routing |
| **ATA** | Associated Token Account - standard token account address |

## Don't Confuse These

| Want to... | Use | NOT | Why |
|------------|-----|-----|-----|
| Get wallet NFTs/tokens | `getAssetsByOwner` (DAS) | `getTokenAccountsByOwner` | DAS returns metadata, not raw accounts |
| Get complete tx history | `getTransactionsForAddress` | `getSignaturesForAddress` | Includes token accounts automatically |
| Get cNFT history | `getSignaturesForAsset` (DAS) | `getSignaturesForAddress` | Standard method doesn't work for cNFTs |
| Stream real-time data | LaserStream gRPC | Yellowstone gRPC | LaserStream has 24h replay + auto-reconnect |
| Send transactions | Helius Sender | Standard `sendTransaction` | Dual routes (staked + Jito) = higher landing |
| Get priority fees | `getPriorityFeeEstimate` | `getRecentPrioritizationFees` | No manual calculation needed |
| Search NFTs | DAS `searchAssets` | `getProgramAccounts` | DAS is faster, cheaper, indexed |

## Best Practices

### Performance
1. Use `transactionDetails: 'signatures'` when full data not needed
2. Implement reasonable page sizes (100-1000)
3. Filter by time ranges for targeted queries
4. Cache results when appropriate

### Filtering
1. Start broad, narrow progressively
2. Use time-based filters for analytics
3. Combine multiple filters for precision
4. Store pagination tokens for resuming

### Error Handling
1. Handle rate limits with exponential backoff
2. Validate addresses before requests
3. Monitor pagination depth
4. Use commitment levels appropriately

## SDKs

### Node.js SDK
```bash
npm install @helius-labs/helius-sdk
```

```typescript
import { Helius } from '@helius-labs/helius-sdk';

const helius = new Helius(process.env.HELIUS_API_KEY);

// Get assets
const assets = await helius.rpc.getAssetsByOwner({
  ownerAddress: walletAddress
});

// Get transactions
const txs = await helius.rpc.getTransactionsForAddress(
  walletAddress,
  { limit: 100 }
);

// Create webhook
const webhook = await helius.createWebhook({
  webhookURL: 'https://your-server.com/webhook',
  transactionTypes: ['NFT_SALE']
});
```

### Rust SDK
```bash
cargo add helius
```

```rust
use helius::Helius;

let helius = Helius::new(api_key).unwrap();

// Get assets
let assets = helius
    .rpc()
    .get_assets_by_owner(owner_address)
    .await?;

// Get transactions
let txs = helius
    .rpc()
    .get_transactions_for_address(address, None)
    .await?;
```

## Staking with Helius

### Native Staking
```typescript
import { Helius } from '@helius-labs/helius-sdk';

const helius = new Helius(apiKey);

// Create stake transaction
const { serializedTx, stakeAccountPubkey } = 
  await helius.rpc.createStakeTransaction(
    payer.publicKey,
    1.5 // SOL amount
  );

// Sign and send
const tx = Transaction.from(bs58.decode(serializedTx));
tx.partialSign(payer);
const signature = await helius.connection.sendRawTransaction(
  tx.serialize()
);

console.log(`Staked! Account: ${stakeAccountPubkey}`);
```

### Liquid Staking (hSOL)
- **0% commission**
- **100% MEV rewards**
- **Highest APYs**
- Trade on DEXs while earning yield

## Pricing & Billing

### Plans
- **Free**: 100K credits/month
- **Developer**: 1M credits/month
- **Business**: 10M credits/month
- **Professional**: 100M credits/month
- **Enterprise**: Custom

### Autoscaling
- Automatically purchase additional credits
- $5 per million credits
- Set limits to control costs
- Email alerts for usage

### Pay with Crypto
- Pay in USDC on Solana
- Monthly or annual billing
- Cancel anytime

## Resources

- **Dashboard**: https://dashboard.helius.dev
- **Documentation**: https://docs.helius.dev
- **Status**: https://helius.statuspage.io
- **Discord**: https://discord.com/invite/6GXdee3gBj
- **Support**: https://dashboard.helius.dev/support
- **Orb Explorer**: https://orbmarkets.io

## When to Use This Skill

Use this skill when:
- Building Solana applications
- Querying wallet balances and NFTs
- Getting transaction history
- Streaming real-time blockchain data
- Sending transactions reliably
- Estimating priority fees
- Setting up webhooks for events
- Working with compressed NFTs
- Analyzing on-chain data
- Building trading bots
- Creating wallet applications
- Developing NFT marketplaces

## Integration Checklist

- [ ] Get Helius API key (programmatically or dashboard)
- [ ] Choose appropriate APIs for use case
- [ ] Install SDK (Node.js or Rust)
- [ ] Configure endpoints (mainnet/devnet)
- [ ] Implement error handling
- [ ] Set up webhooks if needed
- [ ] Configure autoscaling limits
- [ ] Test on devnet first
- [ ] Monitor usage in dashboard
- [ ] Deploy to production

This skill provides complete Helius platform documentation for building production-ready Solana applications with the best infrastructure available.
