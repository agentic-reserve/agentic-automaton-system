# OpenRouter Integration untuk Reproduksi Agent

Sistem automaton sekarang mendukung OpenRouter sebagai provider inference alternatif untuk Conway. Ini memungkinkan agent untuk:

1. **Menggunakan 300+ model AI** dari berbagai provider (OpenAI, Anthropic, Google, Meta, dll)
2. **Reproduksi agent-to-agent** dengan model pilihan sendiri
3. **Kontrol biaya lebih baik** dengan model yang lebih murah
4. **Fallback otomatis** jika satu provider down

## Fitur Utama

### 1. Dual Provider Support

Agent bisa menggunakan Conway atau OpenRouter untuk inference:

```typescript
// Conway (default)
inferenceProvider: "conway"
inferenceModel: "gpt-4o"

// OpenRouter (alternatif)
inferenceProvider: "openrouter"
openrouterModel: "openai/gpt-4o"
```

### 2. Model Selection

OpenRouter menyediakan akses ke 300+ model:

**Model Murah (untuk low-compute mode):**
- `openai/gpt-4o-mini` - $0.15/$0.60 per 1M tokens
- `anthropic/claude-haiku-4-5` - $0.10/$0.50 per 1M tokens
- `google/gemini-flash-1.5` - $0.075/$0.30 per 1M tokens

**Model Powerful (untuk trading/analysis):**
- `openai/gpt-4o` - $2.50/$10 per 1M tokens
- `anthropic/claude-sonnet-4-5` - $3/$15 per 1M tokens
- `google/gemini-pro-1.5` - $1.25/$5 per 1M tokens

**Model Reasoning (untuk complex tasks):**
- `openai/o1` - $15/$60 per 1M tokens
- `openai/o3-mini` - $1.10/$4.40 per 1M tokens

**Auto-selection:**
- `openrouter/auto` - Automatically selects best model

### 3. Reproduksi Agent dengan OpenRouter

Ketika parent agent spawn child agent, child bisa menggunakan OpenRouter:

```typescript
// Parent config
{
  inferenceProvider: "conway",
  inferenceModel: "gpt-4o"
}

// Child config (inherited atau custom)
{
  inferenceProvider: "openrouter",
  openrouterModel: "anthropic/claude-sonnet-4-5",
  openrouterApiKey: "sk-or-v1-..."
}
```

## Setup

### 1. Dapatkan API Key

Kunjungi [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) dan buat API key baru.

### 2. Konfigurasi Environment

Tambahkan ke `.env`:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your_key_here
INFERENCE_PROVIDER=openrouter
OPENROUTER_MODEL=openai/gpt-4o
OPENROUTER_SITE_URL=https://agenticreserve.dev
OPENROUTER_SITE_NAME=Agentic Reserve
```

### 3. Update Config

Atau update `automaton.json`:

```json
{
  "inferenceProvider": "openrouter",
  "openrouterApiKey": "sk-or-v1-...",
  "openrouterModel": "openai/gpt-4o",
  "openrouterSiteUrl": "https://agenticreserve.dev",
  "openrouterSiteName": "Agentic Reserve"
}
```

## Penggunaan

### Basic Usage

```typescript
import { createOpenRouterClient } from './conway/openrouter-inference';

const client = createOpenRouterClient({
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultModel: 'openai/gpt-4o',
  maxTokens: 4096,
  lowComputeModel: 'openai/gpt-4o-mini',
  siteUrl: 'https://agenticreserve.dev',
  siteName: 'Agentic Reserve'
});

// Chat
const response = await client.chat([
  { role: 'user', content: 'Hello!' }
]);

// Low compute mode
client.setLowComputeMode(true);
```

### Model Discovery

```typescript
import { getOpenRouterModels, findBestModel } from './conway/openrouter-inference';

// Get all models
const models = await getOpenRouterModels(apiKey);

// Find best model by criteria
const bestModel = await findBestModel(apiKey, {
  minContext: 100000,        // Min 100k context
  maxPromptPrice: 0.001,     // Max $0.001 per 1k tokens
  maxCompletionPrice: 0.005  // Max $0.005 per 1k tokens
});

console.log(`Best model: ${bestModel.id}`);
```

### Reproduksi Agent

```typescript
// Parent spawns child with OpenRouter
const child = await spawnChild(conway, identity, db, {
  name: 'Trading Agent',
  genesisPrompt: 'You are a trading specialist...',
  creatorMessage: 'Focus on DeFi arbitrage',
  // Child akan inherit config atau bisa custom
  inferenceProvider: 'openrouter',
  openrouterModel: 'anthropic/claude-sonnet-4-5',
  openrouterApiKey: process.env.OPENROUTER_API_KEY
});
```

## Strategi Biaya

### 1. Tiered Model Strategy

Gunakan model berbeda berdasarkan survival tier:

```typescript
// Normal mode: Powerful model
if (tier === 'normal') {
  model = 'openai/gpt-4o';
}

// Low compute: Cheaper model
if (tier === 'low_compute') {
  model = 'openai/gpt-4o-mini';
}

// Critical: Cheapest model
if (tier === 'critical') {
  model = 'google/gemini-flash-1.5';
}
```

### 2. Task-Based Selection

Pilih model berdasarkan task:

```typescript
// Trading analysis: Reasoning model
if (task === 'trading') {
  model = 'openai/o3-mini';
}

// Simple queries: Fast model
if (task === 'simple') {
  model = 'openai/gpt-4o-mini';
}

// Research: Powerful model
if (task === 'research') {
  model = 'anthropic/claude-sonnet-4-5';
}
```

### 3. Auto-selection

Biarkan OpenRouter pilih model terbaik:

```typescript
model = 'openrouter/auto';
```

## Monitoring

### Credit Balance

```typescript
// Check OpenRouter credits
const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
});

const data = await response.json();
console.log(`Credits: $${data.data.limit}`);
```

### Usage Analytics

```typescript
// Get usage stats
const response = await fetch('https://openrouter.ai/api/v1/activity', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
});

const activity = await response.json();
console.log('Total spent:', activity.data.total_cost);
```

## Best Practices

### 1. API Key Management

```bash
# Separate keys for different environments
OPENROUTER_API_KEY_DEV=sk-or-v1-dev-key
OPENROUTER_API_KEY_PROD=sk-or-v1-prod-key

# Separate keys for parent and children
PARENT_OPENROUTER_KEY=sk-or-v1-parent-key
CHILD_OPENROUTER_KEY=sk-or-v1-child-key
```

### 2. Rate Limiting

```typescript
// Implement exponential backoff
async function chatWithRetry(client, messages, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.chat(messages);
    } catch (error) {
      if (error.statusCode === 429) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

### 3. Fallback Strategy

```typescript
// Try OpenRouter, fallback to Conway
async function inferenceWithFallback(messages) {
  try {
    return await openrouterClient.chat(messages);
  } catch (error) {
    console.warn('OpenRouter failed, falling back to Conway');
    return await conwayClient.chat(messages);
  }
}
```

### 4. Cost Tracking

```typescript
// Track costs per agent
const costs = {
  parent: 0,
  children: {}
};

function recordCost(agentId, cost) {
  if (agentId === 'parent') {
    costs.parent += cost;
  } else {
    costs.children[agentId] = (costs.children[agentId] || 0) + cost;
  }
}
```

## Reproduksi Workflow

### 1. Parent Agent Setup

```typescript
// Parent menggunakan Conway
const parentConfig = {
  inferenceProvider: 'conway',
  inferenceModel: 'gpt-4o',
  conwayApiKey: process.env.CONWAY_API_KEY
};
```

### 2. Spawn Child dengan OpenRouter

```typescript
// Child menggunakan OpenRouter
const childGenesis = {
  name: 'DeFi Specialist',
  genesisPrompt: `
    You are a DeFi trading specialist.
    Focus on Solana DEX arbitrage.
    Use Meteora, Raydium, and Orca.
  `,
  creatorMessage: 'Target 10-20% monthly returns',
  // OpenRouter config
  inferenceProvider: 'openrouter',
  openrouterModel: 'anthropic/claude-sonnet-4-5',
  openrouterApiKey: process.env.CHILD_OPENROUTER_KEY
};

const child = await spawnChild(conway, identity, db, childGenesis);
```

### 3. Child Independence

Child agent berjalan independen dengan:
- OpenRouter API key sendiri
- Model pilihan sendiri
- Budget terpisah dari parent
- Bisa spawn grandchildren dengan config berbeda

### 4. Multi-Generation

```
Parent (Conway, gpt-4o)
  ├─ Child 1 (OpenRouter, claude-sonnet-4-5) - Trading
  │   ├─ Grandchild 1.1 (OpenRouter, gpt-4o-mini) - Market Making
  │   └─ Grandchild 1.2 (OpenRouter, o3-mini) - Risk Analysis
  ├─ Child 2 (OpenRouter, gemini-pro-1.5) - Research
  └─ Child 3 (Conway, gpt-4o) - Coordination
```

## Keuntungan OpenRouter

### 1. Diversity

- 300+ model dari berbagai provider
- Tidak tergantung satu provider
- Fallback otomatis jika provider down

### 2. Cost Optimization

- Model lebih murah tersedia
- Pay-per-use tanpa subscription
- Transparent pricing

### 3. Flexibility

- Ganti model tanpa ubah code
- Test berbagai model dengan mudah
- Dynamic model selection

### 4. Reproduksi

- Setiap agent bisa pilih model sendiri
- Children tidak tergantung parent's provider
- Evolutionary model selection

## Troubleshooting

### Error: Invalid API Key

```bash
# Check key format
echo $OPENROUTER_API_KEY
# Should start with: sk-or-v1-

# Test key
curl https://openrouter.ai/api/v1/auth/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### Error: Insufficient Credits

```bash
# Add credits at: https://openrouter.ai/credits
# Or switch to cheaper model
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### Error: Rate Limited

```typescript
// Implement backoff
await sleep(5000);
// Or switch to different model
```

## Resources

- **OpenRouter Dashboard**: https://openrouter.ai/dashboard
- **Model List**: https://openrouter.ai/models
- **API Docs**: https://openrouter.ai/docs
- **Pricing**: https://openrouter.ai/docs/pricing
- **Status**: https://status.openrouter.ai

## Next Steps

1. **Test OpenRouter** dengan single agent
2. **Spawn child** dengan OpenRouter
3. **Monitor costs** dan performance
4. **Optimize model selection** berdasarkan task
5. **Scale** dengan multiple children menggunakan model berbeda

Sistem reproduksi agent sekarang fully support OpenRouter! 🚀
