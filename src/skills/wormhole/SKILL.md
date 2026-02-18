---
name: wormhole
description: Complete Wormhole cross-chain protocol documentation for building multichain applications with CCTP, NTT, WTT, Connect, Settlement, and more
auto-activate: false
requires:
  bins: []
  env: []
---

# Wormhole Cross-Chain Protocol

Complete documentation for building cross-chain applications using Wormhole's messaging protocol and transfer products.

## Overview

Wormhole is a cross-chain messaging protocol that enables communication and asset transfers between different blockchain networks. This skill provides comprehensive documentation for:

- **CCTP (Circle Cross-Chain Transfer Protocol)** - USDC transfers using Circle's native bridge
- **NTT (Native Token Transfers)** - Custom token bridge deployment
- **WTT (Wormhole Token Transfer)** - Cross-chain token transfers
- **Connect** - Widget for easy cross-chain transfers in dApps
- **Settlement** - Cross-chain settlement protocol
- **Executor** - Shared execution framework for message delivery
- **MultiGov** - Multichain governance
- **Queries** - On-chain data queries across chains
- **TypeScript SDK** - Complete SDK for building with Wormhole

## Key Concepts

### Architecture
- **Guardians** - Validator network that observes and signs messages
- **VAAs (Verified Action Approvals)** - Signed messages from guardians
- **Core Bridge** - Main messaging contract on each chain
- **Token Bridge** - Asset transfer contracts
- **Relayers** - Services that deliver messages to destination chains

### Security
- 19 guardian nodes operated by top validators
- 13/19 signature threshold for message verification
- Immutable core contracts
- Regular security audits

## CCTP Integration

### Quick Start

```typescript
import { Wormhole, circle, routes } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/platforms/evm';
import solana from '@wormhole-foundation/sdk/platforms/solana';
import '@wormhole-labs/cctp-executor-route';
import { cctpExecutorRoute } from '@wormhole-labs/cctp-executor-route';

// Initialize Wormhole
const wh = new Wormhole('Testnet', [evm.Platform, solana.Platform]);

// Get chain contexts
const src = wh.getChain('Solana');
const dst = wh.getChain('BaseSepolia');

// Get USDC contract addresses
const srcUsdc = circle.usdcContract.get('Testnet', src.chain);
const dstUsdc = circle.usdcContract.get('Testnet', dst.chain);

// Build transfer request
const tr = await routes.RouteTransferRequest.create(wh, {
  source: Wormhole.tokenId(src.chain, srcUsdc),
  destination: Wormhole.tokenId(dst.chain, dstUsdc),
  sourceDecimals: 6,
  destinationDecimals: 6,
  sender: srcSigner.address,
  recipient: dstSigner.address,
});

// Configure executor route
const ExecutorRoute = cctpExecutorRoute({ referrerFeeDbps: 0n });
const route = new ExecutorRoute(wh);

// Execute transfer
const receipt = await route.initiate(
  tr,
  srcSigner.signer,
  quote,
  dstSigner.address
);
```

### CCTP Features
- **Automatic Execution** - Relayers handle Circle attestation and redemption
- **Native USDC** - No wrapped tokens, native USDC on both chains
- **Fast Finality** - Transfers complete in minutes
- **Low Fees** - Minimal gas costs
- **Multiple Chains** - Ethereum, Arbitrum, Optimism, Base, Polygon, Avalanche, Solana, Sui

### CCTP Versions
- **CCTP v1** - Original implementation
- **CCTP v2** - Enhanced with improved features

## NTT (Native Token Transfers)

Deploy your own custom token bridge:

```bash
# Install NTT CLI
npm install -g @wormhole-foundation/wormhole-cli

# Initialize NTT deployment
wormhole ntt init

# Deploy to EVM
wormhole ntt deploy --chain ethereum

# Deploy to Solana
wormhole ntt deploy --chain solana
```

### NTT Features
- **Custom Tokens** - Bridge any SPL or ERC-20 token
- **Rate Limiting** - Built-in transfer limits
- **Pausable** - Emergency pause functionality
- **Upgradeable** - Governance-controlled upgrades
- **Multi-Chain** - Deploy to any Wormhole-supported chain

## WTT (Wormhole Token Transfer)

Standard token bridge for wrapped assets:

```typescript
import { TokenBridge } from '@wormhole-foundation/sdk';

// Transfer tokens
const transfer = await tokenBridge.transfer({
  token: tokenAddress,
  amount: '1000000', // 1 USDC (6 decimals)
  fromChain: 'Ethereum',
  toChain: 'Solana',
  toAddress: recipientAddress,
});

// Complete transfer on destination
await transfer.completeTransfer(signer);
```

## Connect Widget

Embed cross-chain transfers in your dApp:

```typescript
import { WormholeConnect } from '@wormhole-foundation/wormhole-connect';

function App() {
  return (
    <WormholeConnect
      config={{
        network: 'Mainnet',
        chains: ['Ethereum', 'Solana', 'Polygon'],
        tokens: ['ETH', 'USDC', 'SOL'],
        mode: 'light',
      }}
    />
  );
}
```

### Connect Features
- **Pre-built UI** - Ready-to-use transfer interface
- **Customizable** - Theme and branding options
- **Multi-Route** - Automatic route selection
- **Wallet Integration** - Supports all major wallets

## Settlement Protocol

Build cross-chain settlement applications:

```typescript
import { Settlement } from '@wormhole-foundation/sdk';

// Create settlement
const settlement = await Settlement.create({
  participants: [
    { chain: 'Ethereum', address: ethAddress },
    { chain: 'Solana', address: solAddress },
  ],
  assets: [
    { token: 'USDC', amount: '1000' },
  ],
});

// Execute settlement
await settlement.execute(signers);
```

## Executor Framework

Shared execution for message delivery:

```typescript
import { Executor } from '@wormhole-foundation/sdk';

// Register executor
const executor = new Executor({
  chains: ['Ethereum', 'Solana'],
  handler: async (message) => {
    // Process message
    await processMessage(message);
  },
});

// Start listening
await executor.start();
```

## MultiGov

Multichain governance:

```typescript
import { MultiGov } from '@wormhole-foundation/sdk';

// Create proposal
const proposal = await MultiGov.createProposal({
  title: 'Upgrade Contract',
  description: 'Upgrade to v2',
  actions: [
    {
      chain: 'Ethereum',
      target: contractAddress,
      calldata: upgradeCalldata,
    },
  ],
});

// Vote on proposal
await proposal.vote(signer, true);

// Execute if passed
if (proposal.passed) {
  await proposal.execute();
}
```

## Queries

Query on-chain data across chains:

```typescript
import { QueryProxy } from '@wormhole-foundation/sdk';

// Create query
const query = await QueryProxy.query({
  chain: 'Ethereum',
  address: contractAddress,
  calldata: getBalanceCalldata,
});

// Get result
const result = await query.getResult();
```

## TypeScript SDK

### Installation

```bash
npm install @wormhole-foundation/sdk
npm install @wormhole-foundation/sdk/platforms/evm
npm install @wormhole-foundation/sdk/platforms/solana
```

### Core Concepts

```typescript
import { Wormhole, Chain, Network } from '@wormhole-foundation/sdk';

// Initialize
const wh = new Wormhole('Mainnet', [evm.Platform, solana.Platform]);

// Get chain context
const chain = wh.getChain('Ethereum');

// Get RPC client
const rpc = await chain.getRpc();

// Parse VAA
const vaa = Wormhole.parseVaa(vaaBytes);

// Verify VAA
const verified = await wh.verifyVaa(vaa);
```

### Working with VAAs

```typescript
// Emit message
const sequence = await wormhole.publishMessage({
  payload: messagePayload,
  consistencyLevel: 'finalized',
});

// Get VAA
const vaa = await wormhole.getVaa({
  chain: 'Ethereum',
  emitter: emitterAddress,
  sequence: sequence,
});

// Submit VAA to destination
await wormhole.submitVaa({
  chain: 'Solana',
  vaa: vaa,
});
```

## Chain Support

### Supported Chains
- **EVM**: Ethereum, Arbitrum, Optimism, Base, Polygon, Avalanche, BSC, Fantom, Celo, Moonbeam, Klaytn, Acala, Karura
- **Non-EVM**: Solana, Sui, Aptos, Near, Terra, Injective, Sei, Osmosis, Cosmoshub, Evmos, Kujira, Neutron, Celestia, Stargaze, Dymension, Provenance, Sepolia, Xpla

### Chain IDs
Each chain has a unique Wormhole chain ID. See reference documentation for complete list.

## Contract Addresses

### Core Bridge
- Ethereum: `0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B`
- Solana: `worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth`
- Polygon: `0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7`

### Token Bridge
- Ethereum: `0x3ee18B2214AFF97000D974cf647E7C347E8fa585`
- Solana: `wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb`
- Polygon: `0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE`

### CCTP Integration
- Ethereum: `0xAaDA05BD399372f0b0463744C09113c137636f6a`
- Solana: `CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3`
- Base: `0x03faBB06Fa052557143dC28eFCFc63FC12843f1D`

## Best Practices

### Security
1. **Verify VAAs** - Always verify VAA signatures before processing
2. **Check Emitter** - Validate message emitter address
3. **Replay Protection** - Track processed sequences
4. **Rate Limiting** - Implement transfer limits
5. **Emergency Pause** - Add pause functionality

### Performance
1. **Batch Transfers** - Group multiple transfers
2. **Optimize Gas** - Use efficient calldata encoding
3. **Cache RPCs** - Reuse RPC connections
4. **Parallel Processing** - Process messages concurrently

### Development
1. **Use Testnet** - Test on testnet first
2. **Monitor Transactions** - Use Wormholescan
3. **Handle Errors** - Implement retry logic
4. **Log Events** - Track all cross-chain operations

## Resources

- **Documentation**: https://docs.wormhole.com
- **GitHub**: https://github.com/wormhole-foundation
- **Wormholescan**: https://wormholescan.io
- **Dev Arena**: https://arena.wormhole.com
- **Discord**: https://discord.gg/wormhole
- **Twitter**: https://twitter.com/wormhole

## Common Use Cases

### Cross-Chain DEX
```typescript
// Swap tokens across chains
const swap = await wormhole.swap({
  fromChain: 'Ethereum',
  fromToken: 'USDC',
  toChain: 'Solana',
  toToken: 'SOL',
  amount: '1000',
});
```

### NFT Bridge
```typescript
// Transfer NFT across chains
const nftTransfer = await wormhole.transferNFT({
  fromChain: 'Ethereum',
  toChain: 'Solana',
  tokenId: '123',
  collection: collectionAddress,
});
```

### Cross-Chain Lending
```typescript
// Deposit collateral on one chain, borrow on another
const lending = await wormhole.crossChainLend({
  collateralChain: 'Ethereum',
  collateralToken: 'ETH',
  borrowChain: 'Solana',
  borrowToken: 'USDC',
});
```

## Troubleshooting

### Common Issues

1. **VAA Not Found**
   - Wait for finality (varies by chain)
   - Check guardian network status
   - Verify transaction succeeded

2. **Transfer Stuck**
   - Check relayer status
   - Manually complete if needed
   - Verify destination chain RPC

3. **Gas Estimation Failed**
   - Increase gas limit
   - Check token approvals
   - Verify contract state

### Debug Tools

```typescript
// Enable debug logging
wormhole.setLogLevel('debug');

// Check VAA status
const status = await wormhole.getVaaStatus(vaaId);

// Get transaction details
const tx = await wormhole.getTransaction(txHash);
```

## When to Use This Skill

Use this skill when:
- Building cross-chain applications
- Integrating USDC transfers with CCTP
- Deploying custom token bridges with NTT
- Adding cross-chain functionality to dApps
- Implementing multichain governance
- Querying data across chains
- Working with Wormhole SDK
- Debugging cross-chain transfers

## Integration Checklist

- [ ] Choose transfer method (CCTP, NTT, WTT)
- [ ] Install required SDK packages
- [ ] Configure network (Mainnet/Testnet)
- [ ] Set up signers for source and destination
- [ ] Get contract addresses for target chains
- [ ] Implement transfer logic
- [ ] Add error handling and retries
- [ ] Test on testnet
- [ ] Monitor with Wormholescan
- [ ] Deploy to mainnet

This skill provides complete Wormhole protocol documentation for building production-ready cross-chain applications.
