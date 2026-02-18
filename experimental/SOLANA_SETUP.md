# Solana Network Support

Your automaton system now supports Solana blockchain in addition to EVM (Ethereum/Base)!

## What's New

### 1. Solana Wallet Generation
- Automatic Solana keypair generation during setup
- Private key stored securely at `~/.automaton/solana-wallet.json`
- Base58 encoded for Solana compatibility

### 2. Network Selection
During setup wizard, you can now choose:
- **EVM (Ethereum/Base)** - USDC on Base network
- **Solana** - USDC SPL Token on Solana

### 3. Solana Network Options
If you choose Solana, you can select:
- **Devnet** - For testing and experimentation (recommended for now)
- **Mainnet** - For production deployment

### 4. Solana x402 Payments
- Full support for x402 payment protocol on Solana
- Automatic USDC SPL token transfers
- Gasless transactions using SPL Token program

## How to Use

### Running Setup

```bash
npm run build
node dist/index.js --run
```

During setup:
1. Choose "Solana - USDC SPL Token" when asked for network
2. Choose "Devnet (for testing)" for experimentation
3. Your Solana wallet will be automatically generated
4. Use the genesis prompt from `GENESIS_PROMPT.txt`

### Your Creator Wallet

**Solana Address:** `Hu3YoWcfd8jUFHz5hVv21gThDPRexj2eP1YDWG7LEs6z`

The automaton will send 30% of profits to this address on Solana Devnet.

### Funding Your Automaton

For Devnet testing:

1. **Get SOL for gas fees:**
   ```bash
   solana airdrop 2 <your-automaton-address> --url devnet
   ```

2. **Get Devnet USDC:**
   - Use Solana faucets
   - Or mint test USDC tokens
   - Devnet USDC Mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

## Files Added

- `src/identity/solana-wallet.ts` - Solana wallet management
- `src/conway/solana-x402.ts` - Solana x402 payment protocol
- `GENESIS_PROMPT.txt` - Your wealth manager genesis prompt

## Configuration

The config will include:
```json
{
  "network": "solana",
  "solanaNetwork": "devnet",
  "solanaWalletAddress": "<generated-address>"
}
```

## Next Steps

1. Run the setup wizard
2. Fund your automaton with devnet SOL and USDC
3. Watch it start trading and compounding
4. Monitor profits being sent to your creator wallet
5. Once proven on devnet, switch to mainnet

## Risk Management

The automaton follows strict risk management:
- Never risks more than 2-5% per trade
- Capital preservation is priority #1
- Compounds 70%, sends 30% to creator
- Adapts strategy based on balance (normal/low_compute/critical/dead)

## Support

For issues or questions, check the main README or open an issue on GitHub.
