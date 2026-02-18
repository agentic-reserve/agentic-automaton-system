# Deploy Automaton to Railway

## Prerequisites

1. Railway account: https://railway.app
2. GitHub repository connected
3. Automaton wallet files (will be set via environment variables)

## Setup Steps

### 1. Create New Project on Railway

1. Go to https://railway.app/new
2. Select "Deploy from GitHub repo"
3. Choose `agentic-reserve/agentic-automaton-system`
4. Railway will auto-detect the Dockerfile

### 2. Set Environment Variables

In Railway dashboard, go to Variables tab and add:

**Required Variables:**

```bash
# Node environment
NODE_ENV=production

# Automaton wallet (EVM) - from ~/.automaton/wallet.json
AUTOMATON_WALLET_PRIVATE_KEY=0x...

# Solana wallet - from ~/.automaton/solana-wallet.json
SOLANA_WALLET_PRIVATE_KEY=base58_encoded_key

# Conway API Key - from ~/.automaton/config.json
CONWAY_API_KEY=cnwy_k_...

# Automaton Config
AUTOMATON_NAME=daemon
CREATOR_ADDRESS=0x3e2E055afc9f54B3332866F4Ea78282246a43D12
CREATOR_SOLANA_ADDRESS=Hu3YoWcfd8jUFHz5hVv21gThDPRexj2eP1YDWG7LEs6z

# Network settings
NETWORK=solana
SOLANA_NETWORK=devnet

# Genesis prompt (base64 encoded to avoid newline issues)
GENESIS_PROMPT_BASE64=<base64_encoded_genesis_prompt>
```

**Optional Variables:**

```bash
# Logging
LOG_LEVEL=info

# Conway API URL (default: https://api.conway.tech)
CONWAY_API_URL=https://api.conway.tech

# Inference model
INFERENCE_MODEL=gpt-4o
```

### 3. Get Your Wallet Keys

From your local machine where you ran setup:

**EVM Wallet:**
```bash
cat ~/.automaton/wallet.json
# Copy the "privateKey" value
```

**Solana Wallet:**
```bash
cat ~/.automaton/solana-wallet.json
# Copy the "privateKey" value (base58 encoded)
```

**Conway API Key:**
```bash
cat ~/.automaton/config.json
# Copy the "apiKey" value
```

**Genesis Prompt (Base64):**
```bash
# On Linux/Mac:
cat GENESIS_PROMPT.txt | base64

# On Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content GENESIS_PROMPT.txt -Raw)))
```

### 4. Deploy

1. Railway will automatically deploy after you set variables
2. Check logs in Railway dashboard
3. Monitor automaton status

### 5. Fund Your Automaton

**Option A: Conway Credits**
```bash
# From local machine with CLI
node packages/cli/dist/index.js fund 5.00
```

**Option B: Direct Solana Transfer**
```bash
# Airdrop SOL for gas
solana airdrop 2 AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet

# Transfer USDC
spl-token transfer 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 10 AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet --fund-recipient
```

**Option C: Conway Dashboard**
- Go to https://app.conway.tech
- Fund EVM address: `0x3672346823d8466711f6427A55CBd8FDe2ef7417`

### 6. Monitor

**Railway Logs:**
- Check Railway dashboard for real-time logs
- Look for "State: running" messages

**Automaton Status:**
```bash
# From local machine
node packages/cli/dist/index.js status
node packages/cli/dist/index.js logs --tail 50
```

**Check Solana Balance:**
```bash
solana balance AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet
```

## Troubleshooting

### Automaton is DEAD
- Check if wallet has USDC balance
- Fund via Conway credits or direct Solana transfer

### API Key Issues
- Verify CONWAY_API_KEY is set correctly
- Check if key is valid: https://app.conway.tech

### Wallet Not Found
- Ensure AUTOMATON_WALLET_PRIVATE_KEY is set
- Ensure SOLANA_WALLET_PRIVATE_KEY is set
- Check format (0x... for EVM, base58 for Solana)

### Build Fails
- Check Railway build logs
- Ensure all dependencies are in package.json
- Try rebuilding: Railway dashboard → Deployments → Redeploy

## Persistent Storage

Railway provides ephemeral storage. For persistent data:

1. **Use Railway Volumes** (recommended)
   - Add volume in Railway dashboard
   - Mount to `/root/.automaton`

2. **Use External Database**
   - Add PostgreSQL service in Railway
   - Modify code to use PostgreSQL instead of SQLite

## Scaling

For production:
1. Switch to `SOLANA_NETWORK=mainnet`
2. Fund with real USDC
3. Monitor performance and adjust resources
4. Set up alerts for low balance

## Security

- Never commit wallet private keys to git
- Use Railway's encrypted environment variables
- Rotate API keys periodically
- Monitor for unauthorized access

## Support

- Railway docs: https://docs.railway.app
- Conway docs: https://docs.conway.tech
- GitHub issues: https://github.com/agentic-reserve/agentic-automaton-system/issues
