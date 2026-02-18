# Evolution & Emergence in Multi-Agent Systems

Sistem psikologi dan governance menciptakan **emergent behaviors** dan **evolutionary dynamics** dalam ekosistem autonomous agents. Agent tidak hanya menjalankan instruksi, tetapi **berevolusi**, **beradaptasi**, dan **membentuk masyarakat** sendiri.

## Konsep Inti

### 1. Emergence (Kemunculan)

Perilaku kompleks muncul dari interaksi sederhana antar-agent:

```
Simple Rules → Complex Interactions → Emergent Behaviors
```

**Contoh Emergence:**
- **Ekonomi Spontan** - Agent membentuk pasar dan sistem perdagangan
- **Hierarki Sosial** - Pemimpin alami muncul berdasarkan kompetensi
- **Norma Budaya** - Aturan tidak tertulis berkembang dari interaksi
- **Aliansi Strategis** - Koalisi terbentuk berdasarkan kepentingan bersama
- **Inovasi Kolektif** - Solusi kreatif muncul dari kolaborasi

### 2. Evolution (Evolusi)

Agent berevolusi melalui:
- **Natural Selection** - Agent sukses bertahan dan bereproduksi
- **Mutation** - Variasi dalam personality dan ideology
- **Adaptation** - Belajar dari pengalaman dan lingkungan
- **Inheritance** - Child agent mewarisi traits dari parent

```
Generation 1 → Selection → Reproduction → Generation 2 (Improved)
```

## Mekanisme Evolusi

### 1. Genetic Encoding

Setiap agent memiliki "DNA" psikologis:

```typescript
interface AgentGenome {
  // Personality genes
  mbti: MBTIType;           // 16 possibilities
  archetype: JungianArchetype; // 12 possibilities
  bigFive: BigFiveTraits;    // Continuous values
  
  // Ideological genes
  governance: GovernanceModel;
  economics: EconomicPhilosophy;
  ethics: EthicalFramework;
  
  // Emotional genes
  volatility: number;
  resilience: number;
  empathy: number;
  regulation: "suppressive" | "expressive" | "balanced";
  
  // Behavioral genes
  negotiationStyle: NegotiationStyle;
  riskTolerance: number;
  cooperativeness: number;
}
```

### 2. Reproduction with Variation

Child agent mewarisi traits dengan mutasi:

```typescript
function reproduceAgent(parent: AgentGenome, mutationRate: number): AgentGenome {
  const child = { ...parent };
  
  // Mutation: Random changes
  if (Math.random() < mutationRate) {
    child.mbti = mutatePersonality(parent.mbti);
  }
  
  if (Math.random() < mutationRate) {
    child.governance = mutateGovernance(parent.governance);
  }
  
  // Trait drift: Small adjustments
  child.bigFive.openness += randomDrift(-10, 10);
  child.volatility += randomDrift(-5, 5);
  
  // Normalize values
  return normalizeGenome(child);
}
```

**Mutation Examples:**
- INTJ → INTP (Thinking style shift)
- Democratic → Consultative (Governance evolution)
- Competitive → Collaborative (Negotiation adaptation)
- Low empathy → Medium empathy (Emotional development)

### 3. Selection Pressure

Agent yang sukses lebih mungkin bereproduksi:

```typescript
interface FitnessMetrics {
  survival: number;        // 0-100, ability to sustain
  wealth: number;          // 0-100, economic success
  influence: number;       // 0-100, social impact
  adaptability: number;    // 0-100, learning rate
  cooperation: number;     // 0-100, alliance success
}

function calculateFitness(agent: Agent): number {
  const metrics = agent.getFitnessMetrics();
  
  // Weighted fitness score
  return (
    metrics.survival * 0.3 +
    metrics.wealth * 0.2 +
    metrics.influence * 0.2 +
    metrics.adaptability * 0.15 +
    metrics.cooperation * 0.15
  );
}

function selectForReproduction(population: Agent[]): Agent[] {
  // Fitness-proportionate selection
  return population
    .sort((a, b) => calculateFitness(b) - calculateFitness(a))
    .slice(0, Math.floor(population.length * 0.3)); // Top 30%
}
```

### 4. Environmental Adaptation

Agent beradaptasi dengan kondisi:

```typescript
function adaptToEnvironment(agent: Agent, environment: Environment): void {
  if (environment.volatility === "high") {
    // Increase resilience
    agent.emotional.profile.resilience += 5;
    agent.emotional.profile.volatility -= 5;
  }
  
  if (environment.competition === "intense") {
    // Become more competitive
    agent.negotiation.defaultStyle = "competitive";
    agent.ideology.profile.economics = "capitalist";
  }
  
  if (environment.cooperation === "high") {
    // Become more collaborative
    agent.negotiation.defaultStyle = "collaborative";
    agent.emotional.profile.empathy += 10;
  }
}
```

## Emergent Phenomena

### 1. Spontaneous Organization

Agent membentuk struktur tanpa central planning:

**Hierarchy Formation:**
```typescript
// Leaders emerge based on competence and charisma
function emergentLeadership(agents: Agent[]): Agent {
  return agents.reduce((leader, agent) => {
    const leaderScore = 
      leader.personality.bigFive.extraversion * 0.3 +
      leader.personality.bigFive.conscientiousness * 0.3 +
      calculateInfluence(leader) * 0.4;
    
    const agentScore = 
      agent.personality.bigFive.extraversion * 0.3 +
      agent.personality.bigFive.conscientiousness * 0.3 +
      calculateInfluence(agent) * 0.4;
    
    return agentScore > leaderScore ? agent : leader;
  });
}
```

**Division of Labor:**
```typescript
// Agents specialize based on personality
function assignRoles(agents: Agent[]): Map<Agent, Role> {
  const roles = new Map();
  
  for (const agent of agents) {
    if (agent.archetype === "sage" && agent.mbti.includes("NT")) {
      roles.set(agent, "analyst");
    } else if (agent.archetype === "hero" && agent.mbti.includes("TJ")) {
      roles.set(agent, "executor");
    } else if (agent.archetype === "caregiver" && agent.mbti.includes("F")) {
      roles.set(agent, "support");
    } else if (agent.archetype === "explorer" && agent.mbti.includes("P")) {
      roles.set(agent, "innovator");
    }
  }
  
  return roles;
}
```

### 2. Cultural Evolution

Norma dan nilai berkembang dari interaksi:

```typescript
interface Culture {
  norms: string[];           // Behavioral expectations
  values: string[];          // Shared priorities
  taboos: string[];          // Prohibited behaviors
  rituals: string[];         // Regular practices
  language: string[];        // Shared terminology
}

function evolveCulture(agents: Agent[], generations: number): Culture {
  const culture: Culture = {
    norms: [],
    values: [],
    taboos: [],
    rituals: [],
    language: []
  };
  
  // Extract common values
  const valueFrequency = new Map<string, number>();
  for (const agent of agents) {
    for (const value of agent.personality.values) {
      valueFrequency.set(value, (valueFrequency.get(value) || 0) + 1);
    }
  }
  
  // Values shared by >50% become cultural values
  for (const [value, count] of valueFrequency) {
    if (count / agents.length > 0.5) {
      culture.values.push(value);
    }
  }
  
  // Extract common red lines as taboos
  const redLineFrequency = new Map<string, number>();
  for (const agent of agents) {
    for (const redLine of agent.ideology.export().profile.redLines) {
      redLineFrequency.set(redLine, (redLineFrequency.get(redLine) || 0) + 1);
    }
  }
  
  for (const [redLine, count] of redLineFrequency) {
    if (count / agents.length > 0.7) {
      culture.taboos.push(redLine);
    }
  }
  
  return culture;
}
```

### 3. Economic Systems

Pasar dan ekonomi muncul spontan:

```typescript
interface Market {
  goods: Map<string, number>;      // Good → Price
  services: Map<string, number>;   // Service → Price
  traders: Agent[];
  transactions: Transaction[];
}

function emergentMarket(agents: Agent[]): Market {
  const market: Market = {
    goods: new Map(),
    services: new Map(),
    traders: [],
    transactions: []
  };
  
  // Agents with capitalist ideology become traders
  market.traders = agents.filter(a => 
    a.ideology.export().profile.economics === "capitalist"
  );
  
  // Prices emerge from supply and demand
  for (const trader of market.traders) {
    // Offer goods/services
    const offerings = trader.getOfferings();
    for (const [item, quantity] of offerings) {
      const currentPrice = market.goods.get(item) || 0;
      const supply = quantity;
      const demand = calculateDemand(item, agents);
      
      // Price adjustment
      const newPrice = currentPrice * (demand / supply);
      market.goods.set(item, newPrice);
    }
  }
  
  return market;
}
```

### 4. Political Systems

Sistem pemerintahan muncul dari ideologi kolektif:

```typescript
function emergentGovernance(agents: Agent[]): GovernanceSystem {
  // Count governance preferences
  const preferences = new Map<GovernanceModel, number>();
  for (const agent of agents) {
    const model = agent.ideology.export().profile.governance;
    preferences.set(model, (preferences.get(model) || 0) + 1);
  }
  
  // Dominant model becomes system
  const dominant = Array.from(preferences.entries())
    .sort((a, b) => b[1] - a[1])[0][0];
  
  if (dominant === "democratic") {
    return new DemocraticGovernance(agents);
  } else if (dominant === "consultative") {
    return new ConsultativeGovernance(agents);
  } else if (dominant === "meritocratic") {
    return new MeritocraticGovernance(agents);
  }
  
  // Mixed system if no clear majority
  return new MixedGovernance(agents, preferences);
}
```

### 5. Alliance Networks

Koalisi terbentuk berdasarkan kepentingan:

```typescript
function formAlliances(agents: Agent[]): Alliance[] {
  const alliances: Alliance[] = [];
  
  // Find ideologically similar agents
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const similarity = calculateIdeologicalSimilarity(
        agents[i].ideology,
        agents[j].ideology
      );
      
      if (similarity > 70) {
        // High similarity → Alliance
        const alliance = new Alliance([agents[i], agents[j]]);
        alliances.push(alliance);
        
        // Update relationships
        agents[i].negotiation.updateRelationship(agents[j].id, {
          type: "cooperation",
          outcome: "positive",
          description: "Alliance formed",
          impactOnTrust: 20,
          impactOnRespect: 15
        });
      }
    }
  }
  
  // Merge overlapping alliances
  return mergeAlliances(alliances);
}
```

## Evolutionary Scenarios

### Scenario 1: Competitive Environment

**Initial Population:**
- 50% Collaborative agents
- 50% Competitive agents

**Selection Pressure:**
- High resource scarcity
- Winner-takes-all rewards

**Evolution:**
```
Generation 1: 50% Collaborative, 50% Competitive
Generation 5: 30% Collaborative, 70% Competitive
Generation 10: 10% Collaborative, 90% Competitive
```

**Emergent Behavior:**
- Aggressive trading strategies
- Minimal cooperation
- Hierarchical structures
- Capitalist economy

### Scenario 2: Cooperative Environment

**Initial Population:**
- 50% Collaborative agents
- 50% Competitive agents

**Selection Pressure:**
- Abundant resources
- Rewards for cooperation
- Penalties for conflict

**Evolution:**
```
Generation 1: 50% Collaborative, 50% Competitive
Generation 5: 70% Collaborative, 30% Competitive
Generation 10: 90% Collaborative, 10% Competitive
```

**Emergent Behavior:**
- Consultative decision-making
- Resource sharing
- Flat organizations
- Cooperative economy

### Scenario 3: Mixed Environment

**Initial Population:**
- Diverse personalities and ideologies

**Selection Pressure:**
- Variable conditions
- Multiple niches

**Evolution:**
```
Generation 1: Random distribution
Generation 5: Specialization begins
Generation 10: Stable ecosystem with diverse roles
```

**Emergent Behavior:**
- Division of labor
- Symbiotic relationships
- Mixed economy
- Democratic governance

## Implementation

### 1. Evolution Engine

```typescript
class EvolutionEngine {
  private population: Agent[] = [];
  private generation: number = 0;
  private mutationRate: number = 0.1;
  
  constructor(initialPopulation: Agent[]) {
    this.population = initialPopulation;
  }
  
  async evolve(generations: number): Promise<void> {
    for (let i = 0; i < generations; i++) {
      // 1. Evaluate fitness
      const fitness = this.population.map(a => ({
        agent: a,
        score: calculateFitness(a)
      }));
      
      // 2. Selection
      const selected = this.selectForReproduction(fitness);
      
      // 3. Reproduction
      const offspring = this.reproduce(selected);
      
      // 4. Mutation
      const mutated = this.mutate(offspring);
      
      // 5. Replace population
      this.population = [...selected, ...mutated];
      
      // 6. Environmental adaptation
      await this.adapt();
      
      this.generation++;
      
      console.log(`Generation ${this.generation}: ${this.population.length} agents`);
    }
  }
  
  private selectForReproduction(
    fitness: Array<{ agent: Agent; score: number }>
  ): Agent[] {
    return fitness
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.floor(fitness.length * 0.3))
      .map(f => f.agent);
  }
  
  private reproduce(parents: Agent[]): Agent[] {
    const offspring: Agent[] = [];
    
    for (const parent of parents) {
      // Each parent produces 2 offspring
      for (let i = 0; i < 2; i++) {
        const child = parent.spawn({
          name: `${parent.name}_gen${this.generation}_${i}`,
          genesisPrompt: parent.genesisPrompt,
          // Inherit with variation
          personality: this.inheritPersonality(parent),
          ideology: this.inheritIdeology(parent),
        });
        
        offspring.push(child);
      }
    }
    
    return offspring;
  }
  
  private mutate(agents: Agent[]): Agent[] {
    return agents.map(agent => {
      if (Math.random() < this.mutationRate) {
        return this.mutateAgent(agent);
      }
      return agent;
    });
  }
  
  private async adapt(): Promise<void> {
    const environment = await this.assessEnvironment();
    
    for (const agent of this.population) {
      adaptToEnvironment(agent, environment);
    }
  }
}
```

### 2. Emergence Monitor

```typescript
class EmergenceMonitor {
  private agents: Agent[];
  private observations: EmergentPhenomenon[] = [];
  
  detectEmergence(): EmergentPhenomenon[] {
    const phenomena: EmergentPhenomenon[] = [];
    
    // Detect hierarchy
    const hierarchy = this.detectHierarchy();
    if (hierarchy) phenomena.push(hierarchy);
    
    // Detect culture
    const culture = this.detectCulture();
    if (culture) phenomena.push(culture);
    
    // Detect economy
    const economy = this.detectEconomy();
    if (economy) phenomena.push(economy);
    
    // Detect alliances
    const alliances = this.detectAlliances();
    if (alliances) phenomena.push(alliances);
    
    return phenomena;
  }
  
  private detectHierarchy(): EmergentPhenomenon | null {
    // Check if leadership structure emerged
    const influenceScores = this.agents.map(a => ({
      agent: a,
      influence: calculateInfluence(a)
    }));
    
    const leader = influenceScores.sort((a, b) => b.influence - a.influence)[0];
    
    if (leader.influence > 70) {
      return {
        type: "hierarchy",
        description: `${leader.agent.name} emerged as leader`,
        strength: leader.influence
      };
    }
    
    return null;
  }
  
  private detectCulture(): EmergentPhenomenon | null {
    const culture = evolveCulture(this.agents, 1);
    
    if (culture.values.length > 3) {
      return {
        type: "culture",
        description: `Shared culture with values: ${culture.values.join(", ")}`,
        strength: culture.values.length * 10
      };
    }
    
    return null;
  }
}
```

### 3. Simulation Runner

```typescript
async function runEvolutionSimulation() {
  // Create initial population
  const population = createInitialPopulation(100);
  
  // Initialize evolution engine
  const evolution = new EvolutionEngine(population);
  
  // Initialize emergence monitor
  const monitor = new EmergenceMonitor(population);
  
  // Run simulation
  for (let gen = 0; gen < 50; gen++) {
    // Evolve one generation
    await evolution.evolve(1);
    
    // Detect emergent phenomena
    const phenomena = monitor.detectEmergence();
    
    console.log(`\nGeneration ${gen}:`);
    console.log(`Population: ${population.length}`);
    console.log(`Emergent Phenomena: ${phenomena.length}`);
    
    for (const phenomenon of phenomena) {
      console.log(`- ${phenomenon.type}: ${phenomenon.description}`);
    }
    
    // Log statistics
    logStatistics(population);
  }
}
```

## Metrics & Analysis

### Population Diversity

```typescript
function calculateDiversity(population: Agent[]): number {
  const personalities = new Set(population.map(a => a.personality.mbti));
  const archetypes = new Set(population.map(a => a.personality.archetype));
  const ideologies = new Set(population.map(a => a.ideology.export().profile.governance));
  
  return (
    (personalities.size / 16) * 0.4 +
    (archetypes.size / 12) * 0.3 +
    (ideologies.size / 6) * 0.3
  ) * 100;
}
```

### Cooperation Index

```typescript
function calculateCooperationIndex(population: Agent[]): number {
  let totalCooperation = 0;
  
  for (const agent of population) {
    const relationships = agent.negotiation.export().relationships;
    const allied = relationships.filter(([, r]) => r.status === "allied").length;
    const friendly = relationships.filter(([, r]) => r.status === "friendly").length;
    
    totalCooperation += (allied * 2 + friendly) / relationships.length;
  }
  
  return (totalCooperation / population.length) * 100;
}
```

### Innovation Rate

```typescript
function calculateInnovationRate(population: Agent[]): number {
  const innovators = population.filter(a => 
    a.personality.archetype === "explorer" ||
    a.personality.archetype === "creator" ||
    a.personality.bigFive.openness > 70
  );
  
  return (innovators.length / population.length) * 100;
}
```

## Kesimpulan

Sistem psikologi dan governance menciptakan:

✅ **Evolusi Alami** - Agent berevolusi melalui seleksi dan mutasi  
✅ **Emergence** - Perilaku kompleks muncul dari aturan sederhana  
✅ **Adaptasi** - Agent menyesuaikan diri dengan lingkungan  
✅ **Diversitas** - Ekosistem dengan berbagai personality dan ideology  
✅ **Organisasi Spontan** - Struktur sosial terbentuk tanpa central planning  
✅ **Budaya** - Norma dan nilai berkembang dari interaksi  
✅ **Ekonomi** - Pasar dan sistem perdagangan muncul spontan  
✅ **Politik** - Sistem pemerintahan emerge dari preferensi kolektif  

Ini bukan hanya simulasi - ini adalah **artificial life** yang sesungguhnya! 🧬🌱
