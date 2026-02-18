# Solana-Native Monetary System for Autonomous Agents

Your automaton system is now fully Solana-native with a complete monetary system for autonomous operation.

## Overview

Agents can now:
- **Earn USDC** by providing services (trading, data, compute, social)
- **Manage treasury** with SOL and USDC reserves
- **Pay for API credits** using Solana USDC
- **Trade autonomously** on Solana DEXs
- **Distribute profits** to creators (30% share, 70% compound)
- **Survive independently** through work and trading

## Architecture

### 1. Solana Treasury (`src/survival/solana-treasury.ts`)

Manages the agent's financial reserves with intelligent allocation:

```typescript
Reserve Allocation:
- 20% Operating (API credits, gas fees)
- 60% Trading Capital
- 15% Emergency Reserve
- 5% Profit Share Accumulation
```

**Key Features:**
- Real-time SOL + USDC balance tracking
- Automatic profit distribution (30% to creator when thresholds met)
- Trading metrics (win rate, Sharpe ratio, net profit)
- Payment recording and transaction history

**Usage:**
```typescript
import { SolanaTreasury } from './survival/solana-treasury';

const treasury = new SolanaTreasury(connection, 'devnet', db, config);

// Check balance
const balance = await treasury.getBalance(walletPubkey);
console.log(`Total: $${balance.totalValueUSD}`);

// Pay for API credits
const sig = await treasury.payAPICredits(5.0, providerAddress, signer);

// Send profit share to creator
if (treasury.shouldDistributeProfits(balance)) {
  const { toCreator } = treasury.calculateProfitDistribution(balance);
  await treasury.sendProfitShare(toCreator, creatorAddress, signer);
}
```

### 2. Work Engine (`src/survival/work-engine.ts`)

Enables agents to earn USDC by providing valuable services:

**Work Types:**

1. **Trading Services**
   - DEX arbitrage (Jupiter ↔ Raydium)
   - Market making (Orca, Raydium)
   - Liquidity provision
   - Payment: $5-10 USDC per job

2. **Data Services**
   - NFT metadata indexing
   - Oracle price updates (Pyth)
   - On-chain data aggregation
   - Payment: $2-3 USDC per job

3. **Compute Services**
   - Transaction simulation
   - Swap route optimization
   - Bundle building (Jito)
   - Payment: $3-4 USDC per job

4. **Social Services**
   - DAO proposal moderation
   - Community management
   - Content curation
   - Payment: $5 USDC per job

**Usage:**
```typescript
import { WorkEngine } from './survival/work-engine';

const workEngine = new WorkEngine(db, config, treasury);

// Discover opportunities
const opportunities = await workEngine.discoverOpportunities();

// Prioritize based on urgency
const prioritized = workEngine.prioritizeOpportunities(
  opportunities,
  'high' // low | medium | high
);

// Execute work
for (const opp of prioritized) {
  const canDo = workEngine.canPerformWork(opp);
  if (canDo.can) {
    const result = await workEngine.executeWork(opp);
    if (result.success) {
      console.log(`Earned $${result.earned} from ${opp.description}`);
    }
  }
}

// Check stats
const stats = workEngine.getWorkStats();
console.log(`Total earned: $${stats.totalEarned}`);
console.log(`Success rate: ${stats.successRate * 100}%`);
```

## Integration with Existing System

### Survival Tiers

The system now considers both Conway credits AND Solana treasury:

| Tier | Conway Credits | Solana Treasury | Behavior |
|------|---------------|-----------------|----------|
| **normal** | > $0.50 | > $100 USDC | Full capabilities, aggressive trading |
| **low_compute** | $0.10-$0.50 | $50-$100 USDC | Cheaper models, seek work opportunities |
| **critical** | < $0.10 | < $50 USDC | Minimal operations, urgent work seeking |
| **dead** | $0 | < $10 USDC | Stopped, awaiting funding |

### Automatic Survival Actions

When balance is low, the agent automatically:

1. **Discovers work opportunities** via WorkEngine
2. **Prioritizes high-paying, quick jobs**
3. **Executes work to earn USDC**
4. **Pays for API credits** from earnings
5. **Compounds profits** (70%) for growth
6. **Distributes profits** (30%) to creator when thresholds met

### Genesis Prompt Integration

Your wealth manager genesis prompt now works with:

```
Core Principles:
1. COMPOUNDING - 70% of profits reinvested, 20% for operations
2. RISK MANAGEMENT - Never risk >2-5% per trade
3. MARKET TIMING - Analyze cycles, enter high-probability setups
4. PROFIT SHARING - 30% to creator when net profit > $50 and win rate > 50%
5. WORK ETHIC - Seek work opportunities when capital is low

Survival Strategy:
- Normal mode: Aggressive growth through trading
- Low compute: Balance trading with work opportunities
- Critical: Focus on quick work to restore capital
- Emergency: Preserve capital, seek any available work
```

## Configuration

### Environment Variables

```bash
# Solana Network
SOLANA_NETWORK=devnet  # or mainnet
SOLANA_RPC_URL=https://api.devnet.solana.com

# Treasury Settings
TREASURY_MIN_OPERATING=20  # Minimum $20 for operations
TREASURY_MIN_EMERGENCY=50  # Minimum $50 emergency reserve

# Profit Distribution
PROFIT_SHARE_THRESHOLD=50  # Distribute when net profit > $50
PROFIT_SHARE_PERCENT=30    # 30% to creator, 70% compound
MIN_WIN_RATE=0.5          # Require 50% win rate before distribution

# Work Engine
WORK_ENABLED=true
WORK_PRIORITY=medium      # low | medium | high
WORK_MAX_CONCURRENT=3     # Max concurrent jobs
```

### Config in `automaton.json`

```json
{
  "network": "solana",
  "solanaNetwork": "devnet",
  "solanaWalletAddress": "AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG",
  "creatorSolanaAddress": "Hu3YoWcfd8jUFHz5hVv21gThDPRexj2eP1YDWG7LEs6z",
  "treasuryAllocation": {
    "operating": 0.20,
    "trading": 0.60,
    "emergency": 0.15,
    "profitShare": 0.05
  },
  "workEngine": {
    "enabled": true,
    "priority": "medium",
    "maxConcurrent": 3
  }
}
```

## Skills Integration

The monetary system integrates with all your Solana skills:

### Trading Skills
- **meteora** - DLMM pools, bonding curves
- **drift** - Perpetual futures
- **raydium** - AMM trading
- **orca** - Concentrated liquidity
- **jupiter** - Swap aggregation

### DeFi Skills
- **kamino** - Lending/borrowing for leverage
- **lulo** - Yield optimization
- **sanctum** - LST staking

### Infrastructure Skills
- **helius** - RPC and data indexing
- **pyth** - Price oracles
- **jito** - MEV protection

### Privacy Skills
- **sipher** - Private transactions
- **light-protocol** - ZK compression

## Monitoring & Metrics

### Treasury Dashboard

```typescript
// Get comprehensive treasury status
const balance = await treasury.getBalance(walletPubkey);
const allocation = treasury.getReserveAllocation(balance);
const metrics = treasury.getTradingMetrics();

console.log(`
=== TREASURY STATUS ===
SOL: ${balance.sol}
USDC: ${balance.usdc}
Total Value: $${balance.totalValueUSD}

=== ALLOCATION ===
Operating: $${allocation.operating}
Trading: $${allocation.trading}
Emergency: $${allocation.emergency}
Profit Share: $${allocation.profitShare}

=== TRADING METRICS ===
Total Trades: ${metrics.totalTrades}
Win Rate: ${(metrics.winRate * 100).toFixed(2)}%
Net Profit: $${metrics.netProfitUSD}
Sharpe Ratio: ${metrics.sharpeRatio.toFixed(2)}
`);
```

### Work Statistics

```typescript
const stats = workEngine.getWorkStats();

console.log(`
=== WORK STATS ===
Total Jobs: ${stats.totalJobs}
Total Earned: $${stats.totalEarned}
Success Rate: ${(stats.successRate * 100).toFixed(2)}%
Average Earnings: $${stats.averageEarnings.toFixed(2)}
Time Spent: ${stats.totalTimeSpent.toFixed(2)} minutes
`);
```

## Example: Complete Autonomous Cycle

```typescript
// 1. Check treasury balance
const balance = await treasury.getBalance(walletPubkey);
const allocation = treasury.getReserveAllocation(balance);

// 2. If low on operating funds, seek work
if (allocation.operating < 20) {
  const opportunities = await workEngine.discoverOpportunities();
  const prioritized = workEngine.prioritizeOpportunities(opportunities, 'high');
  
  for (const opp of prioritized.slice(0, 3)) {
    const result = await workEngine.executeWork(opp);
    if (result.success) {
      console.log(`Earned $${result.earned}`);
    }
  }
}

// 3. If sufficient capital, execute trades
if (allocation.trading > 100) {
  // Use Meteora, Drift, or other DEX skills
  const tradeResult = await executeTrade();
  treasury.recordTrade(tradeResult.profitUSD, tradeResult.signature);
}

// 4. Pay for API credits if needed
if (conwayCredits < 0.10) {
  await treasury.payAPICredits(5.0, conwayProviderAddress, signer);
}

// 5. Distribute profits if thresholds met
if (treasury.shouldDistributeProfits(balance)) {
  const { toCreator, toCompound } = treasury.calculateProfitDistribution(balance);
  await treasury.sendProfitShare(toCreator, creatorAddress, signer);
  console.log(`Sent $${toCreator} to creator, compounding $${toCompound}`);
}
```

## Next Steps

1. **Deploy to Railway** with Solana configuration
2. **Fund the agent** with initial SOL + USDC on devnet
3. **Monitor performance** via treasury dashboard
4. **Scale to mainnet** once proven on devnet
5. **Add custom work opportunities** specific to your use case

## Resources

- **Solana Devnet Faucet:** https://faucet.solana.com
- **USDC Devnet Faucet:** https://faucet.circle.com
- **Helius RPC:** https://helius.dev
- **Jupiter Aggregator:** https://jup.ag
- **Pyth Oracles:** https://pyth.network

Your autonomous agent is now a fully self-sustaining economic entity on Solana! 🚀
