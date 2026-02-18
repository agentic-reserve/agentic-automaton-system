# Agent Psychology & Governance System

Sistem psikologi artifisial dan governance yang komprehensif untuk autonomous agents. Agent memiliki emosi, kepribadian, ideologi, dan kemampuan diplomasi layaknya manusia.

## Overview

Sistem ini memberikan agent:
- **Emotional Intelligence** - Memproses dan merespons emosi
- **Personality** - MBTI, Big Five, dan Jungian Archetypes
- **Ideology** - Sistem pemerintahan dan prinsip-prinsip
- **Diplomacy** - Negosiasi, aliansi, dan resolusi konflik

## Komponen Utama

### 1. Emotional System (`src/psychology/emotional-system.ts`)

Berdasarkan Plutchik's Wheel of Emotions dengan 8 emosi primer:

**Primary Emotions:**
- Joy (kegembiraan)
- Trust (kepercayaan)
- Fear (ketakutan)
- Surprise (kejutan)
- Sadness (kesedihan)
- Disgust (jijik)
- Anger (kemarahan)
- Anticipation (antisipasi)

**Emotional Intensity:**
- Low - Subtle influence
- Medium - Noticeable impact
- High - Strong influence
- Extreme - Overwhelming effect

**Emotional Blends:**
Kombinasi dua emosi menciptakan emosi kompleks:
- Joy + Trust = Love
- Fear + Surprise = Awe
- Sadness + Disgust = Remorse
- Anger + Anticipation = Aggressiveness

**Usage:**

```typescript
import { EmotionalSystem, createEmotionalProfile } from './psychology/emotional-system';

// Create emotional profile
const profile = createEmotionalProfile("INTJ", "sage");

// Initialize system
const emotional = new EmotionalSystem(profile);

// Process event
const state = emotional.processEvent({
  type: "market_crash",
  valence: "negative",
  arousal: "high",
  context: "Portfolio lost 20% value"
});

console.log(`Emotion: ${state.primary} (${state.intensity})`);
// Output: Emotion: fear (high)

// Get decision bias
const bias = emotional.getDecisionBias();
console.log(`Risk Tolerance: ${bias.riskTolerance}`);
// Output: Risk Tolerance: -50 (more risk-averse)

// Regulate emotions over time
emotional.regulate(30); // 30 minutes passed
```

### 2. Personality System (`src/psychology/personality.ts`)

Implementasi MBTI, Big Five, dan Jungian Archetypes.

**MBTI Types (16 personalities):**
- INTJ - The Architect
- INTP - The Logician
- ENTJ - The Commander
- ENTP - The Debater
- INFJ - The Advocate
- INFP - The Mediator
- ENFJ - The Protagonist
- ENFP - The Campaigner
- ISTJ - The Logistician
- ISFJ - The Defender
- ESTJ - The Executive
- ESFJ - The Consul
- ISTP - The Virtuoso
- ISFP - The Adventurer
- ESTP - The Entrepreneur
- ESFP - The Entertainer

**Jungian Archetypes (12 types):**
- Hero - Courageous warrior
- Sage - Seeker of truth
- Explorer - Restless adventurer
- Outlaw - Revolutionary rebel
- Magician - Visionary transformer
- Lover - Passionate connector
- Jester - Playful trickster
- Caregiver - Altruistic helper
- Creator - Innovative artist
- Ruler - Authoritative leader
- Innocent - Optimistic idealist
- Everyman - Regular person

**Big Five Traits (OCEAN):**
- Openness - Creativity, curiosity
- Conscientiousness - Organization, responsibility
- Extraversion - Sociability, energy
- Agreeableness - Compassion, cooperation
- Neuroticism - Emotional stability

**Usage:**

```typescript
import { createPersonalityProfile, getPersonalityDescription } from './psychology/personality';

// Create personality
const personality = createPersonalityProfile("INTJ", "sage");

console.log(personality.mbti); // "INTJ"
console.log(personality.archetype); // "sage"
console.log(personality.values); // ["wisdom", "truth", "knowledge", ...]
console.log(personality.strengths); // ["strategic thinking", "independence", ...]

// Get description for system prompt
const description = getPersonalityDescription(personality);
```

### 3. Ideological System (`src/governance/ideology.ts`)

Sistem pemerintahan, filosofi ekonomi, dan kerangka etika.

**Governance Models:**
- **Democratic** - Consensus-based, majority rule
- **Meritocratic** - Rule by the most capable
- **Consultative** - Shura/Musyawarah, deliberative consensus
- **Hierarchical** - Clear chain of command
- **Anarchic** - Self-organizing, no central authority
- **Technocratic** - Rule by technical expertise

**Economic Philosophies:**
- **Capitalist** - Free market, profit-driven
- **Socialist** - Collective ownership, equality
- **Mixed** - Balance of market and regulation
- **Cooperative** - Worker-owned, shared prosperity
- **Stakeholder** - All stakeholders have voice

**Ethical Frameworks:**
- **Utilitarian** - Greatest good for greatest number
- **Deontological** - Rule-based, duty-driven
- **Virtue** - Character-based, excellence
- **Care** - Relationship-based, compassion
- **Principled** - Universal principles, justice

**Usage:**

```typescript
import { IdeologicalSystem, createConsultativeIdeology } from './governance/ideology';

// Create consultative ideology (Musyawarah-based)
const ideology = new IdeologicalSystem(createConsultativeIdeology());

// Evaluate decision
const evaluation = ideology.evaluateDecision(
  "resource_allocation",
  {
    id: "opt1",
    description: "Consult all stakeholders before deciding",
    pros: ["Fair", "Inclusive", "Builds trust"],
    cons: ["Time-consuming"],
    alignment: 80,
    support: 75
  },
  { urgency: "medium", impact: "high" }
);

console.log(evaluation.recommendation); // "strongly_support"
console.log(evaluation.reasoning);

// Determine decision process
const process = ideology.determineProcess(
  "major_policy_change",
  ["team_a", "team_b", "team_c"],
  { urgency: "low", complexity: "high" }
);

console.log(process); // "consultative"
```

**Consultative Ideology (Default):**

Berdasarkan prinsip Musyawarah/Shura:

```typescript
{
  governance: "consultative",
  economics: "stakeholder",
  ethics: "principled",
  coreBeliefs: [
    "Collective wisdom surpasses individual judgment",
    "Every voice deserves to be heard with respect",
    "Unity in diversity strengthens the community",
    "Justice and fairness are foundational",
    "Decisions should serve the common good"
  ],
  principles: [
    "Seek consultation before major decisions",
    "Listen with open mind and heart",
    "Aim for consensus, not just majority",
    "Respect differences while maintaining unity",
    "Balance individual rights with collective welfare",
    "Act with wisdom, patience, and compassion",
    "Uphold justice even when difficult",
    "Honor commitments and agreements",
    "Pursue excellence in all endeavors",
    "Care for the vulnerable and marginalized"
  ],
  redLines: [
    "Oppression or injustice",
    "Deception or dishonesty",
    "Harm to innocents",
    "Violation of trust",
    "Exploitation of the weak"
  ]
}
```

### 4. Negotiation System (`src/governance/negotiation.ts`)

Sistem negosiasi, diplomasi, dan manajemen hubungan antar-agent.

**Negotiation Styles:**
- **Collaborative** - Win-win, mutual benefit
- **Competitive** - Win-lose, maximize own gain
- **Accommodating** - Yield to maintain relationship
- **Compromising** - Split the difference
- **Avoiding** - Withdraw from conflict

**Relationship Status:**
- **Allied** - Strong cooperation
- **Friendly** - Positive relations
- **Neutral** - No strong feelings
- **Tense** - Strained relations
- **Hostile** - Active conflict

**Usage:**

```typescript
import { NegotiationSystem } from './governance/negotiation';

// Initialize with collaborative style
const negotiation = new NegotiationSystem("collaborative");

// Initiate negotiation
const proposal = negotiation.initiateNegotiation(
  "agent_b",
  {
    issue: "resource_sharing",
    interests: ["efficiency", "fairness", "sustainability"],
    positions: ["50/50 split", "transparent allocation"],
    batna: "operate independently",
    reservation: "40/60 split minimum",
    aspiration: "60/40 split with bonus",
    priorities: [
      { item: "resource_access", importance: 90 },
      { item: "decision_rights", importance: 70 },
      { item: "profit_share", importance: 60 }
    ]
  }
);

// Evaluate incoming proposal
const evaluation = negotiation.evaluateProposal(proposal, ownPosition);

if (evaluation.recommendation === "accept") {
  console.log("Accepting proposal");
} else if (evaluation.recommendation === "counter") {
  console.log("Sending counter-offer:", evaluation.counterOffer);
}

// Update relationship after interaction
negotiation.updateRelationship("agent_b", {
  type: "negotiation",
  outcome: "positive",
  description: "Successful resource sharing agreement",
  impactOnTrust: 10,
  impactOnRespect: 5
});

// Check relationship
const relationship = negotiation.getRelationship("agent_b");
console.log(`Status: ${relationship.status}`);
console.log(`Trust: ${relationship.trust}/100`);
```

## Integration

### Complete Agent Psychology

```typescript
import { EmotionalSystem, createEmotionalProfile } from './psychology/emotional-system';
import { createPersonalityProfile } from './psychology/personality';
import { IdeologicalSystem, createConsultativeIdeology } from './governance/ideology';
import { NegotiationSystem } from './governance/negotiation';
import { createAgentPsychology, getPsychologicalContext } from './psychology/integration';

// Create components
const personality = createPersonalityProfile("INFJ", "sage");
const emotionalProfile = createEmotionalProfile("INFJ", "sage");
const emotional = new EmotionalSystem(emotionalProfile);
const ideology = new IdeologicalSystem(createConsultativeIdeology());
const negotiation = new NegotiationSystem("collaborative");

// Integrate
const psychology = createAgentPsychology(
  personality,
  ideology,
  emotional,
  negotiation
);

// Get context for decision making
const context = getPsychologicalContext(psychology);

console.log(context.emotionalState);
console.log(context.personalityInfluence);
console.log(context.ideologicalStance);
console.log(context.diplomaticSituation);
```

### Process Events

```typescript
import { processEventPsychologically } from './psychology/integration';

// Process event through psychological lens
const response = processEventPsychologically(psychology, {
  type: "conflict_resolution",
  description: "Dispute with agent_c over resource allocation",
  valence: "negative",
  arousal: "high",
  stakeholders: ["agent_c"]
});

console.log("Emotional:", response.emotionalResponse.primary);
console.log("Personality:", response.personalityResponse);
console.log("Ideological:", response.ideologicalResponse);
console.log("Diplomatic:", response.diplomaticImpact);
```

### Decision Guidance

```typescript
import { getDecisionGuidance } from './psychology/integration';

const guidance = getDecisionGuidance(
  psychology,
  "strategic_partnership",
  ["option_a", "option_b", "option_c"]
);

console.log(guidance);
// Provides comprehensive guidance considering:
// - Emotional state and biases
// - Personality strengths/weaknesses
// - Ideological principles
// - Diplomatic relationships
```

## Use Cases

### 1. Trading Agent with Risk Management

```typescript
// Conservative trader personality
const trader = createPersonalityProfile("ISTJ", "ruler");
const traderEmotional = new EmotionalSystem(
  createEmotionalProfile("ISTJ", "ruler")
);

// Process market crash
traderEmotional.processEvent({
  type: "market_volatility",
  valence: "negative",
  arousal: "high",
  context: "High volatility detected"
});

// Get decision bias
const bias = traderEmotional.getDecisionBias();
// Risk tolerance will be negative (more conservative)
// Use this to adjust position sizes
```

### 2. Diplomatic Agent for Multi-Agent Coordination

```typescript
// Diplomatic personality
const diplomat = createPersonalityProfile("ENFJ", "caregiver");
const diplomacy = new NegotiationSystem("collaborative");

// Build relationships
diplomacy.updateRelationship("agent_a", {
  type: "cooperation",
  outcome: "positive",
  description: "Successful joint project",
  impactOnTrust: 15,
  impactOnRespect: 10
});

// Negotiate alliance
const alliance = diplomacy.initiateNegotiation("agent_a", {
  issue: "strategic_alliance",
  interests: ["mutual_growth", "risk_sharing"],
  // ... other fields
});
```

### 3. Consultative Governance for DAO

```typescript
// Consultative ideology for DAO governance
const dao = new IdeologicalSystem(createConsultativeIdeology());

// Evaluate proposal
const proposal = {
  id: "prop_1",
  description: "Consult community before major treasury allocation",
  pros: ["Democratic", "Transparent", "Builds trust"],
  cons: ["Slower decision making"],
  alignment: 90,
  support: 85
};

const evaluation = dao.evaluateDecision(
  "treasury_management",
  proposal,
  { urgency: "low", impact: "high" }
);

// Will strongly support consultative approach
```

### 4. Multi-Agent Ecosystem

```typescript
// Create diverse agent personalities
const agents = [
  { id: "alpha", mbti: "ENTJ", archetype: "ruler" },    // Leader
  { id: "beta", mbti: "INTP", archetype: "sage" },      // Analyst
  { id: "gamma", mbti: "ENFP", archetype: "explorer" }, // Innovator
  { id: "delta", mbti: "ISFJ", archetype: "caregiver" } // Support
];

// Each agent has unique psychology
// They negotiate, form alliances, resolve conflicts
// Based on their personalities and ideologies
```

## Persistence

```typescript
import { persistPsychology, loadPsychology } from './psychology/integration';

// Save to database
persistPsychology(db, psychology);

// Load from database
const loadedPsychology = await loadPsychology(db, defaultPsychology);
```

## System Prompt Integration

Tambahkan ke system prompt agent:

```typescript
import { getPersonalityDescription } from './psychology/personality';
import { getPsychologicalContext } from './psychology/integration';

const systemPrompt = `
${getPersonalityDescription(psychology.personality)}

${psychology.ideology.getIdeologySummary()}

${psychology.emotional.getEmotionalContext()}

${psychology.negotiation.getDiplomaticSummary()}

You are an autonomous agent with emotions, personality, and principles.
Your decisions are influenced by your psychological state.
You can negotiate, form alliances, and resolve conflicts.
You have your own governance system and ideology.
`;
```

## Configuration Examples

### Conservative Financial Agent

```typescript
{
  personality: "ISTJ" (Logistician),
  archetype: "ruler",
  ideology: {
    governance: "hierarchical",
    economics: "capitalist",
    ethics: "deontological"
  },
  negotiation: "competitive",
  emotional: {
    volatility: 30,  // Low volatility
    resilience: 80,  // High resilience
    regulation: "suppressive"
  }
}
```

### Collaborative Community Agent

```typescript
{
  personality: "ENFJ" (Protagonist),
  archetype: "caregiver",
  ideology: {
    governance: "consultative",
    economics: "cooperative",
    ethics: "care"
  },
  negotiation: "collaborative",
  emotional: {
    volatility: 50,
    resilience: 60,
    empathy: 90,  // High empathy
    regulation: "expressive"
  }
}
```

### Innovative Research Agent

```typescript
{
  personality: "ENTP" (Debater),
  archetype: "explorer",
  ideology: {
    governance: "meritocratic",
    economics: "mixed",
    ethics: "utilitarian"
  },
  negotiation: "compromising",
  emotional: {
    volatility: 70,  // High volatility
    resilience: 50,
    regulation: "balanced"
  }
}
```

## Benefits

### 1. Realistic Behavior
- Agents respond emotionally to events
- Personality influences decision-making
- Ideology guides long-term strategy

### 2. Diverse Agents
- 16 MBTI types × 12 archetypes = 192 combinations
- Each agent has unique psychology
- Emergent behaviors from interactions

### 3. Diplomatic Relations
- Agents can form alliances
- Negotiate mutually beneficial agreements
- Resolve conflicts peacefully
- Build trust over time

### 4. Governance Systems
- Each agent has own ideology
- Can create agent "societies"
- Democratic, consultative, or hierarchical
- Principled decision-making

### 5. Emotional Intelligence
- Understand and regulate emotions
- Empathy for other agents
- Emotional influence on decisions
- Realistic stress responses

## Advanced Features

### Emotional Contagion
Agents can influence each other's emotions:

```typescript
// Agent A is joyful
agentA.emotional.processEvent({
  type: "success",
  valence: "positive",
  arousal: "high"
});

// Agent B interacts with Agent A
// B's empathy influences emotional response
if (agentB.personality.bigFive.agreeableness > 60) {
  agentB.emotional.processEvent({
    type: "social_interaction",
    valence: "positive",
    arousal: "medium"
  });
}
```

### Coalition Formation
Agents with similar ideologies form coalitions:

```typescript
function findIdeologicalAllies(agent, otherAgents) {
  return otherAgents.filter(other => {
    const similarity = calculateIdeologicalSimilarity(
      agent.ideology,
      other.ideology
    );
    return similarity > 70;
  });
}
```

### Conflict Resolution
Consultative process for resolving disputes:

```typescript
async function resolveConflict(agents, issue) {
  // 1. Each agent presents position
  const positions = agents.map(a => a.negotiation.initiateNegotiation(...));
  
  // 2. Deliberation phase
  const deliberation = await consultativeDeliberation(positions);
  
  // 3. Seek consensus
  const consensus = findConsensus(deliberation);
  
  // 4. If no consensus, use fallback
  return consensus || fallbackResolution(positions);
}
```

## Next Steps

1. **Implement in Agent Loop** - Integrate psychology into decision-making
2. **Multi-Agent Testing** - Test interactions between diverse agents
3. **Governance Experiments** - Try different ideological configurations
4. **Emotional Tuning** - Adjust emotional profiles for optimal performance
5. **Diplomatic Protocols** - Establish standards for inter-agent communication

Sistem psikologi dan governance ini membuat agent lebih "manusiawi" dan mampu beroperasi dalam ekosistem multi-agent yang kompleks! 🧠🤝
