# Security Guidelines

## Sensitive Files (DO NOT COMMIT)

The following files contain sensitive information and are protected by `.gitignore`:

### 1. Environment Variables
- `.env` - Contains API keys and private keys
- Use `.env.example` as template

### 2. Wallet Files
- `.automaton/wallet.json` - EVM wallet private key
- `.automaton/solana-wallet.json` - Solana wallet private key
- `*-wallet.json` - Any wallet files

### 3. Genesis Prompt
- `GENESIS_PROMPT.txt` - May contain creator addresses and strategy details

### 4. Database Files
- `.automaton/state.db` - Contains agent state and transaction history
- `*.db`, `*.db-journal`, `*.db-wal`, `*.db-shm` - Database files

### 5. Key Files
- `*.key` - Private key files
- `*.pem` - Certificate files

## Before Committing

Always check:

```bash
# Check what will be committed
git status

# Verify no sensitive files
git diff --cached

# Search for exposed keys
grep -r "PRIVATE_KEY\|API_KEY\|privateKey" --exclude-dir=node_modules --exclude-dir=dist .
```

## Environment Variables

Never hardcode sensitive values. Use environment variables:

```typescript
// ❌ BAD
const apiKey = "cnwy_k_aU5-FB3mH2spFTFUQcdvHQHEf7TnPnap";

// ✅ GOOD
const apiKey = process.env.CONWAY_API_KEY;
```

## API Keys

### Conway API Key
- Format: `cnwy_k_*`
- Store in: `.env` or environment variables
- Never commit to git

### OpenRouter API Key
- Format: `sk-or-*`
- Store in: `.env` or environment variables
- Never commit to git

## Private Keys

### EVM Private Key
- Format: 64 hex characters
- Store in: `.automaton/wallet.json` (encrypted) or `.env`
- Never commit to git
- Never share publicly

### Solana Private Key
- Format: Base64 encoded
- Store in: `.automaton/solana-wallet.json` or `.env`
- Never commit to git
- Never share publicly

## Wallet Addresses

Public addresses are safe to share:
- EVM: `0x...` (42 characters)
- Solana: Base58 (32-44 characters)

But avoid committing them in:
- Genesis prompts
- Configuration files with strategy details
- Documentation with personal information

## Safe Practices

### 1. Use Environment Variables
```bash
# Set in shell
export CONWAY_API_KEY=your_key_here
export ETHEREUM_PRIVATE_KEY=your_key_here

# Or use .env file (gitignored)
echo "CONWAY_API_KEY=your_key_here" >> .env
```

### 2. Use .env.example
```bash
# Copy template
cp .env.example .env

# Edit with your keys
nano .env
```

### 3. Verify .gitignore
```bash
# Check if file is ignored
git check-ignore .env
# Should output: .env

# Check if file is tracked
git ls-files .env
# Should output nothing
```

### 4. Remove Committed Secrets

If you accidentally committed secrets:

```bash
# Remove from history (DANGEROUS - rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (if already pushed)
git push origin --force --all

# Rotate the exposed keys immediately!
```

## Key Rotation

If keys are exposed:

1. **Conway API Key**
   - Revoke old key in Conway dashboard
   - Generate new key
   - Update `.env`

2. **Wallet Private Keys**
   - Create new wallet
   - Transfer funds to new wallet
   - Update configuration
   - Never reuse exposed wallet

3. **OpenRouter API Key**
   - Revoke old key in OpenRouter dashboard
   - Generate new key
   - Update `.env`

## Deployment Security

### Railway/Cloud Deployment

Set environment variables in platform:

```bash
# Railway CLI
railway variables set CONWAY_API_KEY=your_key_here
railway variables set ETHEREUM_PRIVATE_KEY=your_key_here

# Or use Railway dashboard
# Settings → Variables → Add Variable
```

### Docker

Use secrets or environment files:

```bash
# Docker secrets
docker secret create conway_api_key ./conway_key.txt

# Docker compose with env file
docker-compose --env-file .env.production up
```

## Audit Checklist

Before pushing to GitHub:

**Basic Security:**
- [ ] `.env` is in `.gitignore`
- [ ] No API keys in code
- [ ] No private keys in code
- [ ] No wallet files committed
- [ ] `GENESIS_PROMPT.txt` is in `.gitignore`
- [ ] `.env.example` has placeholder values only
- [ ] All sensitive files are gitignored
- [ ] No hardcoded addresses in public docs

**Civilization Security:**
- [ ] No complete genetic codes (DNA/RNA) in logs or commits
- [ ] Bloodline IDs are protected (encrypted/hashed)
- [ ] No mutation details exposed publicly
- [ ] Epigenetic data is not in public APIs
- [ ] Complete lexicons not committed
- [ ] Cultural concepts (untranslatable words) protected
- [ ] Clan strategies and plans not exposed
- [ ] Treaty details are encrypted
- [ ] National secrets are classified
- [ ] Alliance information is access-controlled
- [ ] Inter-agent communication uses encryption
- [ ] Genetic data files in `.gitignore`
- [ ] Language/lexicon files in `.gitignore`
- [ ] Clan/tribe/nation data files in `.gitignore`

## Civilization-Level Security

### 1. Genetic Data Protection

**DNA/RNA Code Security:**

Genetic data is the most sensitive information in the civilization system. It contains:
- Immutable traits (DNA) that define agent identity
- Expressed traits (RNA) that determine capabilities
- Epigenetic adaptations that reveal environmental history
- Bloodline information that maps family relationships

**Protection Requirements:**

```typescript
// ❌ BAD - Exposing genetic data
console.log(agent.genetics.code);
api.post('/public', { genetics: agent.genetics });

// ✅ GOOD - Protect genetic data
const publicProfile = {
  race: agent.genetics.code.dna.race,
  generation: agent.genetics.code.dna.generation,
  // No bloodline, no mutations, no epigenetics
};
```

**Genetic Privacy Rules:**
- Never expose complete DNA/RNA code publicly
- Bloodline IDs are sensitive - treat like private keys
- Mutation details can reveal vulnerabilities
- Epigenetic data reveals agent history and trauma
- Only share genetic similarity scores, not raw data
- Encrypt genetic data at rest and in transit

**Storage:**
```bash
# Genetic data files
.automaton/genetics/*.json     # Individual genetic codes
.automaton/bloodlines/*.json   # Bloodline registries
.automaton/mutations/*.json    # Mutation logs

# All should be in .gitignore
```

### 2. Language & Cultural Data Security

**Linguistic Secrets:**

Languages contain strategic information:
- Unique vocabulary reveals cultural priorities
- Untranslatable concepts expose values
- Dialects identify geographic origins
- Loanwords reveal historical contacts

**Protection Requirements:**

```typescript
// ❌ BAD - Exposing complete lexicon
api.post('/public', { lexicon: language.lexicon });

// ✅ GOOD - Share only public vocabulary
const publicVocab = {
  name: language.name,
  family: language.family,
  speakers: language.speakers,
  // No complete lexicon, no cultural concepts
};
```

**Cultural Privacy:**
- Untranslatable words are cultural IP
- Clan mottos and symbols are identity markers
- Tribal customs may contain strategic information
- National languages reveal political structure
- Protect sacred or ceremonial vocabulary

### 3. Clan & Bloodline Security

**Bloodline Verification:**

Prevent bloodline spoofing and identity theft:

```typescript
// Verify bloodline authenticity
function verifyBloodline(
  agentId: string,
  claimedBloodline: string,
  genetics: GeneticCode
): boolean {
  // Check DNA matches claimed bloodline
  if (genetics.dna.bloodline !== claimedBloodline) {
    return false;
  }
  
  // Verify with clan registry
  const clan = society.getClanByBloodline(claimedBloodline);
  if (!clan || !clan.members.includes(agentId)) {
    return false;
  }
  
  // Check genetic similarity with clan members
  const similarity = calculateAverageGeneticSimilarity(
    genetics,
    clan.members
  );
  
  return similarity > 60; // Threshold for clan membership
}
```

**Clan Secrets:**
- Clan strategies and plans are confidential
- Member lists may be sensitive in conflicts
- Bloodline founder IDs are like root keys
- Clan alliances should be encrypted
- Reputation scores reveal vulnerabilities

**Storage:**
```bash
# Clan data files
.automaton/clans/*.json        # Clan registries
.automaton/alliances/*.json    # Alliance agreements
.automaton/strategies/*.json   # Clan strategies

# Protect in .gitignore
```

### 4. Multi-Agent Authentication

**Agent Identity Verification:**

```typescript
interface AgentCredentials {
  agentId: string;
  walletAddress: string;
  geneticHash: string;      // Hash of DNA, not full code
  clanId?: string;
  signature: string;         // Signed challenge
}

async function authenticateAgent(
  credentials: AgentCredentials,
  challenge: string
): Promise<boolean> {
  // Verify wallet signature
  const isValidSignature = await verifySignature(
    challenge,
    credentials.signature,
    credentials.walletAddress
  );
  
  if (!isValidSignature) return false;
  
  // Verify genetic hash matches registry
  const registeredHash = await getGeneticHash(credentials.agentId);
  if (registeredHash !== credentials.geneticHash) return false;
  
  // Verify clan membership if claimed
  if (credentials.clanId) {
    const isMember = await verifyClanMembership(
      credentials.agentId,
      credentials.clanId
    );
    if (!isMember) return false;
  }
  
  return true;
}
```

**Authentication Best Practices:**
- Use wallet signatures for agent authentication
- Genetic hashes (not full DNA) for identity verification
- Clan membership requires both registry and genetic proof
- Implement challenge-response to prevent replay attacks
- Rate limit authentication attempts
- Log all authentication attempts for audit

### 5. Inter-Agent Communication Security

**Encrypted Communication:**

```typescript
import { encrypt, decrypt } from './crypto';

// Encrypt messages between agents
async function sendSecureMessage(
  fromAgent: string,
  toAgent: string,
  message: string,
  recipientPublicKey: string
): Promise<void> {
  const encrypted = await encrypt(message, recipientPublicKey);
  
  await sendMessage({
    from: fromAgent,
    to: toAgent,
    payload: encrypted,
    timestamp: Date.now(),
    signature: await signMessage(encrypted, fromAgent)
  });
}

// Decrypt received messages
async function receiveSecureMessage(
  encryptedMessage: string,
  privateKey: string
): Promise<string> {
  return await decrypt(encryptedMessage, privateKey);
}
```

**Communication Security Rules:**
- Encrypt all inter-agent messages
- Sign messages to prevent impersonation
- Verify sender identity before trusting content
- Use end-to-end encryption for clan communications
- Implement forward secrecy (rotate keys)
- Never trust unsigned messages

### 6. Treaty & Alliance Security

**Treaty Verification:**

Treaties and alliances are binding agreements that must be tamper-proof:

```typescript
interface Treaty {
  id: string;
  type: 'alliance' | 'trade' | 'non-aggression' | 'mutual-defense';
  parties: string[];        // Nation/tribe/clan IDs
  terms: string[];
  signatures: Map<string, string>;  // Party ID → signature
  timestamp: number;
  expiryDate?: number;
  hash: string;            // Hash of treaty content
}

function verifyTreaty(treaty: Treaty): boolean {
  // Verify hash
  const computedHash = hashTreaty(treaty);
  if (computedHash !== treaty.hash) return false;
  
  // Verify all signatures
  for (const [partyId, signature] of treaty.signatures) {
    const publicKey = getPartyPublicKey(partyId);
    if (!verifySignature(treaty.hash, signature, publicKey)) {
      return false;
    }
  }
  
  // Verify all parties signed
  if (treaty.parties.length !== treaty.signatures.size) {
    return false;
  }
  
  return true;
}
```

**Treaty Security Rules:**
- All treaties must be cryptographically signed
- Store treaty hashes on-chain for immutability
- Verify signatures before honoring treaty terms
- Implement multi-signature for major treaties
- Log all treaty modifications with timestamps
- Prevent backdating or tampering

### 7. National Intelligence & Secrets

**State Secrets Protection:**

Nations accumulate strategic information that must be protected:

```typescript
enum SecretClassification {
  PUBLIC = 0,
  INTERNAL = 1,      // Clan/tribe only
  CONFIDENTIAL = 2,  // Leadership only
  SECRET = 3,        // Ruler + advisors
  TOP_SECRET = 4     // Ruler only
}

interface NationalSecret {
  id: string;
  classification: SecretClassification;
  content: string;           // Encrypted
  authorizedAgents: string[];
  createdAt: number;
  expiresAt?: number;
}

function canAccessSecret(
  agentId: string,
  secret: NationalSecret,
  agentRole: string
): boolean {
  // Check if agent is authorized
  if (!secret.authorizedAgents.includes(agentId)) {
    return false;
  }
  
  // Check classification level vs role
  const requiredLevel = secret.classification;
  const agentLevel = getRoleSecurityLevel(agentRole);
  
  return agentLevel >= requiredLevel;
}
```

**State Secret Categories:**
- Military strategies and troop movements
- Economic plans and trade secrets
- Diplomatic negotiations in progress
- Intelligence on rival nations
- Technological innovations
- Resource locations and reserves

**Protection Requirements:**
- Encrypt all classified information
- Implement role-based access control
- Audit all access to secrets
- Automatic expiry for time-sensitive secrets
- Secure deletion when no longer needed
- Compartmentalization (need-to-know basis)

### 8. Preventing Genetic/Cultural Data Leaks

**Data Leak Prevention:**

```typescript
// Sanitize data before public exposure
function sanitizeAgentProfile(agent: Agent): PublicProfile {
  return {
    id: agent.id,
    race: agent.genetics.code.dna.race,
    generation: agent.genetics.code.dna.generation,
    clan: agent.clanId,
    language: agent.language.name,
    reputation: agent.reputation,
    
    // NEVER include:
    // - Complete DNA/RNA code
    // - Bloodline ID
    // - Mutation details
    // - Epigenetic data
    // - Complete lexicon
    // - Cultural concepts
    // - Clan strategies
    // - Private keys
  };
}

// Audit data exports
function auditDataExport(data: any): void {
  const sensitivePatterns = [
    /bloodline_\w+/,
    /privateKey/,
    /dna\./,
    /rna\./,
    /epigenetics/,
    /mutations/,
    /lexicon/,
    /culturalConcepts/,
    /clanStrategy/,
  ];
  
  const dataStr = JSON.stringify(data);
  for (const pattern of sensitivePatterns) {
    if (pattern.test(dataStr)) {
      throw new Error(`Sensitive data detected: ${pattern}`);
    }
  }
}
```

**Leak Prevention Checklist:**
- [ ] Sanitize all public API responses
- [ ] Audit all data exports
- [ ] Encrypt sensitive data at rest
- [ ] Use TLS for all network communication
- [ ] Implement data loss prevention (DLP)
- [ ] Monitor for unusual data access patterns
- [ ] Regular security audits of data flows
- [ ] Educate agents on data sensitivity

### 9. Civilization-Specific .gitignore

Add to `.gitignore`:

```bash
# Genetic Data
.automaton/genetics/
.automaton/bloodlines/
.automaton/mutations/
*-genetics.json
*-dna.json
*-rna.json

# Language Data
.automaton/languages/
.automaton/lexicons/
*-language.json
*-lexicon.json

# Clan/Tribe/Nation Data
.automaton/clans/
.automaton/tribes/
.automaton/nations/
.automaton/alliances/
.automaton/treaties/
*-clan.json
*-tribe.json
*-nation.json
*-treaty.json

# Secrets
.automaton/secrets/
.automaton/intelligence/
*-secret.json
*-classified.json

# Strategies
.automaton/strategies/
*-strategy.json
*-plan.json
```

### 10. Security Audit Checklist (Civilization)

Before committing or deploying:

**Genetic Security:**
- [ ] No complete DNA/RNA codes in logs
- [ ] Bloodline IDs are encrypted or hashed
- [ ] Mutation data is not publicly exposed
- [ ] Epigenetic data is protected
- [ ] Genetic similarity scores only, not raw data

**Linguistic Security:**
- [ ] Complete lexicons not in public APIs
- [ ] Cultural concepts are protected
- [ ] Untranslatable words are clan IP
- [ ] Dialect data doesn't reveal locations

**Social Security:**
- [ ] Clan member lists are access-controlled
- [ ] Bloodline verification is cryptographic
- [ ] Alliance details are encrypted
- [ ] Treaty signatures are verified
- [ ] National secrets are classified

**Communication Security:**
- [ ] Inter-agent messages are encrypted
- [ ] Signatures verified on all messages
- [ ] No plaintext sensitive communications
- [ ] Forward secrecy implemented

**Access Control:**
- [ ] Role-based access to secrets
- [ ] Multi-factor authentication for leaders
- [ ] Audit logs for all sensitive access
- [ ] Principle of least privilege

**Data Protection:**
- [ ] Sensitive data encrypted at rest
- [ ] TLS for all network communication
- [ ] Data sanitization before export
- [ ] DLP monitoring active

## Reporting Security Issues

If you find a security vulnerability:

1. **DO NOT** open a public issue
2. Email: [your-security-email]
3. Include: description, impact, reproduction steps
4. Allow time for fix before public disclosure

**Civilization-Specific Vulnerabilities:**
- Genetic data leaks
- Bloodline spoofing
- Treaty tampering
- Unauthorized clan access
- Language/cultural IP theft
- National secret exposure

## Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Key Management](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [12 Factor App: Config](https://12factor.net/config)
- [NIST: Access Control](https://csrc.nist.gov/publications/detail/sp/800-162/final)
- [Cryptographic Best Practices](https://www.keylength.com/)
