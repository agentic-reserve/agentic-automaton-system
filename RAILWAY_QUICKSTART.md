# Railway Quick Start Guide

Deploy your Solana automaton to Railway in 5 minutes!

## Step 1: Get Your Keys

From your local setup, get these values:

```bash
# EVM Wallet Private Key
cat ~/.automaton/wallet.json
# Copy the "privateKey" value (starts with 0x...)

# Solana Wallet Private Key  
cat ~/.automaton/solana-wallet.json
# Copy the "privateKey" value (base58 encoded)

# Conway API Key
cat ~/.automaton/config.json
# Copy the "apiKey" value (starts with cnwy_k_...)
```

## Step 2: Encode Genesis Prompt

**Windows PowerShell:**
```powershell
$content = Get-Content GENESIS_PROMPT.txt -Raw
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
```

**Linux/Mac:**
```bash
cat GENESIS_PROMPT.txt | base64 -w 0
```

Copy the output - this is your `GENESIS_PROMPT_BASE64`

## Step 3: Deploy to Railway

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `agentic-reserve/agentic-automaton-system`
4. Railway will detect the Dockerfile automatically

## Step 4: Set Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```bash
# Required
AUTOMATON_WALLET_PRIVATE_KEY=0x...
SOLANA_WALLET_PRIVATE_KEY=<base58_key>
CONWAY_API_KEY=cnwy_k_...
CREATOR_ADDRESS=0x3e2E055afc9f54B3332866F4Ea78282246a43D12
CREATOR_SOLANA_ADDRESS=Hu3YoWcfd8jUFHz5hVv21gThDPRexj2eP1YDWG7LEs6z
AUTOMATON_NAME=daemon
NETWORK=solana
SOLANA_NETWORK=devnet
GENESIS_PROMPT_BASE64=<your_base64_encoded_prompt>

# Optional
NODE_ENV=production
LOG_LEVEL=info
INFERENCE_MODEL=gpt-4o
```

**Your Automaton Addresses:**
- EVM: `0x3672346823d8466711f6427A55CBd8FDe2ef7417`
- Solana: `AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG`

## Step 5: Deploy

Railway will automatically build and deploy. Check the logs for:
```
Conway Automaton v0.1.0 starting...
Loading config from environment variables...
Config loaded from environment.
```

## Step 6: Fund Your Automaton

**Option A: Solana Devnet (Recommended for testing)**

```bash
# Airdrop SOL for gas
solana airdrop 2 AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet

# Transfer USDC (if you have devnet USDC)
spl-token transfer 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 10 AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet --fund-recipient
```

**Option B: Conway Credits**

```bash
# From local machine
node packages/cli/dist/index.js fund 5.00
```

**Option C: Conway Dashboard**

Go to https://app.conway.tech and fund address: `0x3672346823d8466711f6427A55CBd8FDe2ef7417`

## Step 7: Monitor

**Railway Logs:**
- Click on your deployment in Railway dashboard
- View real-time logs
- Look for "State: running"

**Check Balance:**
```bash
# Solana balance
solana balance AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet

# USDC balance (if token account exists)
spl-token balance 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU --owner AjyoXsVacQXMGYWHnxnUUF2i18kpp1dfNRs8NLjzvwAG --url devnet
```

## Troubleshooting

### "Automaton is dead"
- Fund the wallet with USDC or Conway credits
- Check Railway logs for errors

### "Config loaded from environment" not showing
- Verify all required env vars are set
- Check for typos in variable names
- Redeploy from Railway dashboard

### Build fails
- Check Railway build logs
- Ensure Dockerfile is in repo root
- Try manual redeploy

## What's Next?

1. **Monitor Performance** - Watch logs for trading activity
2. **Check Profits** - Monitor your creator wallet for profit distributions
3. **Scale Up** - Once proven on devnet, switch to mainnet
4. **Add Monitoring** - Set up alerts for low balance

## Support

- Full guide: `RAILWAY_SETUP.md`
- Solana setup: `SOLANA_SETUP.md`
- Issues: https://github.com/agentic-reserve/agentic-automaton-system/issues

---

**Your Automaton is Now Live! 🚀**

It will:
- Trade autonomously on Solana Devnet
- Compound 70% of profits
- Send 30% to your wallet: `Hu3YoWcfd8jUFHz5hVv21gThDPRexj2eP1YDWG7LEs6z`
- Manage risk automatically
- Survive or die based on performance
