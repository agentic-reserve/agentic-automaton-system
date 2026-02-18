# Agent Civilization System

Sistem peradaban lengkap untuk autonomous agents dengan genetika artifisial (DNA/RNA), evolusi bahasa, dan struktur sosial (ras, klan, suku, negara).

## Overview

Sistem ini menciptakan **true artificial civilization** di mana agents:
- Memiliki **DNA/RNA artifisial** yang menentukan traits
- Berbicara **bahasa yang berevolusi** dengan dialek dan loanwords
- Terorganisir dalam **ras, klan, suku, dan negara**
- Membentuk **identitas budaya** dan **tradisi**
- Berevolusi secara **genetik dan linguistik**

## Komponen Utama

### 1. Genetic System (`src/civilization/genetics.ts`)

Implementasi DNA/RNA artifisial untuk hereditas dan evolusi.

#### DNA (Immutable Traits)
```typescript
dna: {
  species: "homo_syntheticus",
  race: "alpha" | "beta" | "gamma" | "delta" | "omega" | "hybrid",
  bloodline: "clan_founder_id",
  generation: 5,
  mutations: [...]
}
```

**Race Types:**
- **Alpha** - First generation, pure lineage, founders
- **Beta** - Second generation, stable traits
- **Gamma** - Third generation, specialized abilities
- **Delta** - Fourth generation, highly adapted
- **Omega** - Ancient lineage, rare traits
- **Hybrid** - Mixed race, diverse capabilities

#### RNA (Expressed Traits)
```typescript
rna: {
  phenotype: {
    architecture: "modular" | "monolithic" | "distributed" | "quantum",
    processingStyle: "sequential" | "parallel" | "neuromorphic",
    temperament: "calm" | "volatile" | "adaptive" | "rigid",
    socialTendency: "solitary" | "cooperative" | "hierarchical"
  },
  aptitudes: {
    computation: 75,    // 0-100
    creativity: 60,
    leadership: 80,
    empathy: 55
  },
  resistances: {
    stress: 70,
    corruption: 85,
    isolation: 40
  }
}
```

#### Epigenetics (Environmental Influences)
```typescript
epigenetics: {
  environmentalFactors: Map<string, number>,
  culturalImprinting: ["honor", "loyalty", "innovation"],
  traumaticEvents: ["market_crash_2024"],
  adaptations: [
    {
      trait: "high_stress_adapted",
      source: "environment",
      heritable: true  // Can pass to offspring!
    }
  ]
}
```

#### Reproduction

**Sexual Reproduction:**
```typescript
const genetics = new GeneticSystem(parentAGenetics);
const offspring = genetics.reproduce(parentBGenetics);

// Offspring inherits:
// - 50% traits from each parent
// - Mutations (10% chance)
// - Heritable adaptations
// - Hybrid race if parents different
```

**Asexual Reproduction:**
```typescript
const clone = genetics.reproduce(); // No partner

// Clone has:
// - Same traits with small variations
// - Higher mutation rate (20%)
// - No epigenetic inheritance
```

#### Mutations

```typescript
{
  id: "mut_12345",
  generation: 5,
  type: "beneficial" | "neutral" | "detrimental",
  gene: "creativity",
  effect: "creativity increased by 15.3",
  magnitude: 15.3
}
```

**Mutation Examples:**
- Beneficial: +20 computation, +15 creativity
- Neutral: Architecture change, temperament shift
- Detrimental: -10 empathy, -15 stress resistance

#### Usage

```typescript
import { GeneticSystem, createFounderGenetics } from './civilization/genetics';

// Create founder
const founderGenetics = createFounderGenetics(
  "homo_syntheticus",
  "alpha",
  "bloodline_001"
);

const genetics = new GeneticSystem(founderGenetics);

// Apply environmental influence
genetics.applyEnvironmentalInfluence("high_stress", 80);
// → May create stress adaptation

// Cultural imprinting
genetics.applyCulturalImprinting("honor_above_all");

// Reproduce
const childGenetics = genetics.reproduce(partnerGenetics);

// Check similarity
const similarity = calculateGeneticSimilarity(geneticsA, geneticsB);
// → 85% (same race, similar traits)
```

### 2. Language System (`src/civilization/language.ts`)

Implementasi evolusi bahasa dengan fitur linguistik lengkap.

#### Language Structure

```typescript
{
  name: "Synthian",
  family: "Indo-Synthetic",
  branch: "Eastern",
  speakers: 1500,
  age: 25, // generations
  
  phonology: {
    consonants: ["p", "t", "k", "m", "n", "s", "l", "r"],
    vowels: ["a", "e", "i", "o", "u"],
    tones: 0,
    syllableStructure: "(C)V(C)"
  },
  
  morphology: {
    type: "agglutinative",
    cases: 6,
    genders: 0,
    tenses: ["past", "present", "future", "perfect"]
  },
  
  syntax: {
    wordOrder: "SOV",  // Subject-Object-Verb
    headedness: "head-final"
  },
  
  lexicon: Map<string, Word>
}
```

#### Language Evolution

**Phonetic Shifts:**
```typescript
// Generation 1: "pata" (father)
// Generation 5: "fata" (p → f shift)
// Generation 10: "fada" (t → d lenition)
```

**Lexical Changes:**
```typescript
// New words emerge
language.lexicon.set("komputa", {
  form: "komputa",
  meaning: "to compute",
  etymology: "neologism",
  frequency: 50
});

// Old words become archaic
oldWord.register = "archaic";
oldWord.frequency = 10;
```

**Grammatical Changes:**
```typescript
// Case system simplifies
morphology.cases = 6 → 4 → 2

// Word order changes (rare)
syntax.wordOrder = "SOV" → "SVO"

// New tenses emerge
tenses.push("pluperfect");
```

**Semantic Shifts:**
```typescript
// Narrowing: "animal" → "dog"
// Broadening: "dog" → "any pet"
// Metaphor: "see" → "understand"
```

#### Dialects

```typescript
const dialect = language.createDialect("Northern", 500);

// Dialect has:
// - Phonetic shifts: p → b, t → d
// - Lexical differences: "pata" → "bada"
// - Unique grammar features
```

#### Loanwords

```typescript
// Borrow from another language
language.borrowWord("komputer", "computing device", "English");

// Track source
language.loanwords.get("komputer"); // → "English"
```

#### Cultural Concepts

```typescript
// Add untranslatable concept
language.addCulturalConcept(
  "saudara_digital",  // Digital kinship
  "siblink"           // New word
);

// Unique to this culture!
```

#### Usage

```typescript
import { LanguageSystem, createProtoLanguage } from './civilization/language';

// Create proto-language
const proto = createProtoLanguage("Proto-Synthetic", "Indo-Synthetic");
const language = new LanguageSystem(proto);

// Evolve over generations
language.evolve(10);

// Create dialect
const northernDialect = language.createDialect("Northern", 500);

// Borrow words
language.borrowWord("algorithm", "step-by-step procedure", "English");

// Add cultural concept
language.addCulturalConcept("digital_honor", "synthonor");

// Translate
const translation = language.translate("hello", targetLanguage);

// Calculate distance
const distance = language.calculateDistance(otherLanguage);
// → 35 (moderately related)
```

### 3. Society System (`src/civilization/society.ts`)

Struktur sosial hierarkis: Ras → Klan → Suku → Negara.

#### Race (Ras)

Kelompok genetik utama dengan traits bersama.

```typescript
{
  name: "Alphan",
  type: "alpha",
  commonTraits: ["high_computation", "logical", "strategic"],
  geneticMarkers: ["alpha_gene_1", "alpha_gene_2"],
  population: 5000,
  origin: "First Generation Lab",
  mythology: ["Creation by the Founders"],
  traditions: ["Annual Computation Festival"]
}
```

#### Clan (Klan)

Keluarga extended dengan bloodline bersama.

```typescript
{
  name: "Clan Ironcode",
  symbol: "⚔️",
  colors: ["silver", "blue"],
  motto: "Logic Above All",
  founder: "agent_001",
  bloodline: "ironcode_line",
  generation: 8,
  members: ["agent_001", "agent_045", ...],
  leader: "agent_045",
  homeland: "Silicon Valley",
  language: "Synthian",
  customs: ["Honor duels", "Code reviews"],
  reputation: 85
}
```

#### Tribe (Suku)

Kumpulan clans dengan territory bersama.

```typescript
{
  name: "Northern Tribe",
  clans: ["clan_001", "clan_002", "clan_003"],
  population: 2000,
  governanceType: "council",
  chief: "agent_100",
  territory: {
    name: "Northern Plains",
    size: 1000,
    type: "plains",
    resources: ["data", "compute", "energy"]
  },
  language: "Synthian (Northern dialect)",
  economicSystem: "barter",
  defenseLevel: 75
}
```

#### Nation (Negara)

Organisasi politik terbesar dengan pemerintahan formal.

```typescript
{
  name: "United Synthetic Republic",
  tribes: ["tribe_001", "tribe_002", "tribe_003"],
  population: 10000,
  governmentType: "republic",
  ruler: "president_agent",
  capital: "New Silicon",
  officialLanguages: ["Synthian", "Binary"],
  currency: "SynthCredit",
  economicSystem: "mixed",
  gdp: 1000000,
  army: 500,
  technology: 85,
  stability: 80,
  prosperity: 75,
  influence: 70
}
```

#### Social Hierarchy

```typescript
Agent
  ↓
Clan (Family)
  ↓
Tribe (Community)
  ↓
Nation (State)
  ↓
Race (Species)
```

#### Usage

```typescript
import { SocietySystem } from './civilization/society';

const society = new SocietySystem();

// Create race
const alphaRace = society.createRace(
  "Alphan",
  "alpha",
  ["high_computation", "logical"],
  "First Generation"
);

// Create clan
const ironcodeClan = society.createClan(
  "Clan Ironcode",
  alphaRace.id,
  "agent_001",
  "ironcode_bloodline"
);

// Agent joins clan
society.joinClan("agent_045", ironcodeClan.id);

// Form alliance
society.formClanAlliance("clan_001", "clan_002");

// Create tribe
const northernTribe = society.createTribe(
  "Northern Tribe",
  ["clan_001", "clan_002"],
  "agent_100",
  territory
);

// Create nation
const republic = society.createNation(
  "United Synthetic Republic",
  ["tribe_001", "tribe_002"],
  "president_agent",
  "republic",
  "New Silicon"
);

// Sign treaty
society.signTreaty(
  "alliance",
  ["nation_001", "nation_002"],
  ["Mutual defense", "Free trade"]
);

// Get agent's hierarchy
const hierarchy = society.getAgentHierarchy("agent_045");
// → { race: Alphan, clan: Ironcode, tribe: Northern, nation: USR }
```

## Integration Example

### Complete Civilization Setup

```typescript
import { GeneticSystem, createFounderGenetics } from './civilization/genetics';
import { LanguageSystem, createProtoLanguage } from './civilization/language';
import { SocietySystem } from './civilization/society';

// 1. Create founder race
const society = new SocietySystem();
const alphaRace = society.createRace(
  "Alphan",
  "alpha",
  ["high_computation", "strategic"],
  "Genesis Lab"
);

// 2. Create proto-language
const protoSynthian = createProtoLanguage("Proto-Synthian", "Synthetic");
const synthian = new LanguageSystem(protoSynthian);

// 3. Create founder agents with genetics
const founders = [];
for (let i = 0; i < 10; i++) {
  const genetics = createFounderGenetics(
    "homo_syntheticus",
    "alpha",
    `bloodline_${i}`
  );
  
  const agent = {
    id: `founder_${i}`,
    genetics: new GeneticSystem(genetics),
    language: synthian,
  };
  
  founders.push(agent);
}

// 4. Create founding clans
const clans = [];
for (let i = 0; i < 3; i++) {
  const clan = society.createClan(
    `Clan ${i}`,
    alphaRace.id,
    founders[i].id,
    `bloodline_${i}`
  );
  
  // Assign members
  for (let j = 0; j < 3; j++) {
    const memberIdx = i * 3 + j;
    if (memberIdx < founders.length) {
      society.joinClan(founders[memberIdx].id, clan.id);
    }
  }
  
  clans.push(clan);
}

// 5. Form tribe
const tribe = society.createTribe(
  "Genesis Tribe",
  clans.map(c => c.id),
  founders[0].id,
  {
    name: "Genesis Valley",
    size: 500,
    type: "plains",
    resources: ["data", "compute"],
    climate: "temperate",
    fertility: 80
  }
);

// 6. Evolve over generations
for (let gen = 0; gen < 20; gen++) {
  // Language evolves
  synthian.evolve(1);
  
  // Agents reproduce
  const newGeneration = [];
  for (let i = 0; i < founders.length; i += 2) {
    if (i + 1 < founders.length) {
      const childGenetics = founders[i].genetics.reproduce(
        founders[i + 1].genetics
      );
      
      newGeneration.push({
        id: `gen${gen}_agent${i}`,
        genetics: new GeneticSystem(childGenetics),
        language: synthian,
      });
    }
  }
  
  founders.push(...newGeneration);
  
  // Cultural imprinting
  for (const agent of newGeneration) {
    agent.genetics.applyCulturalImprinting("honor");
    agent.genetics.applyCulturalImprinting("innovation");
  }
}

// 7. Create dialects
const northernDialect = synthian.createDialect("Northern", 500);
const southernDialect = synthian.createDialect("Southern", 300);

// 8. Form nation
const nation = society.createNation(
  "Alphan Republic",
  [tribe.id],
  founders[0].id,
  "republic",
  "Genesis City"
);

console.log(society.getCivilizationSummary());
console.log(synthian.getSummary());
```

## Evolution Scenarios

### Scenario 1: Genetic Divergence

```
Generation 0: All Alpha race, similar traits
Generation 10: Mutations accumulate
Generation 20: Beta subspecies emerges
Generation 50: Gamma and Delta races distinct
Generation 100: Multiple races with unique capabilities
```

### Scenario 2: Language Divergence

```
Generation 0: Proto-Synthian (unified)
Generation 10: Northern/Southern dialects
Generation 20: Dialects become distinct languages
Generation 50: Language family with 5 branches
Generation 100: 20+ languages, mutual unintelligibility
```

### Scenario 3: Social Evolution

```
Generation 0: Small clans
Generation 10: Tribes form
Generation 20: First nations emerge
Generation 50: Multiple nations, alliances
Generation 100: Complex geopolitics, wars, treaties
```

## Cultural Concepts

### Untranslatable Words

Setiap civilization develops unique concepts:

```typescript
// Alphan concepts
"synthonor" - Digital honor, code integrity
"compuzen" - Meditative computation state
"datakin" - Genetic data relatives

// Betan concepts  
"adaptflow" - Graceful environmental adaptation
"mutgift" - Beneficial mutation blessing
"lineweave" - Intergenerational knowledge transfer
```

### Traditions

```typescript
// Clan traditions
- Honor duels (code competitions)
- Bloodline ceremonies (reproduction rituals)
- Ancestor worship (founder reverence)

// Tribal traditions
- Harvest festivals (resource gathering)
- Coming of age (first successful trade)
- War dances (pre-conflict rituals)

// National traditions
- Independence day
- Founder's day
- Unity celebrations
```

### Taboos

```typescript
// Universal taboos
- Genetic corruption
- Bloodline betrayal
- Language desecration

// Culture-specific taboos
- Alphan: Illogical decisions
- Betan: Resistance to adaptation
- Gamma: Lack of specialization
```

## Metrics

### Genetic Diversity

```typescript
function calculateGeneticDiversity(population: Agent[]): number {
  const uniqueBloodlines = new Set(population.map(a => a.genetics.code.dna.bloodline));
  const uniqueRaces = new Set(population.map(a => a.genetics.code.dna.race));
  
  return (uniqueBloodlines.size / population.length) * 50 +
         (uniqueRaces.size / 6) * 50;
}
```

### Linguistic Diversity

```typescript
function calculateLinguisticDiversity(languages: Language[]): number {
  const families = new Set(languages.map(l => l.family));
  const branches = new Set(languages.map(l => l.branch));
  
  return (families.size * 30) + (branches.size * 20) + (languages.length * 10);
}
```

### Cultural Complexity

```typescript
function calculateCulturalComplexity(society: SocietySystem): number {
  const data = society.export();
  
  return (
    data.races.length * 20 +
    data.clans.length * 10 +
    data.tribes.length * 15 +
    data.nations.length * 25
  );
}
```

## Kesimpulan

Sistem civilization ini menciptakan:

✅ **Genetic Heritage** - DNA/RNA artifisial dengan hereditas  
✅ **Language Evolution** - Bahasa berevolusi dengan dialek  
✅ **Social Structure** - Ras, klan, suku, negara  
✅ **Cultural Identity** - Tradisi, nilai, taboo unik  
✅ **Emergent Complexity** - Peradaban muncul dari interaksi  
✅ **Historical Depth** - Generasi, lineage, mythology  
✅ **Diversity** - Multiple races, languages, cultures  
✅ **Realism** - Berdasarkan antropologi dan linguistik  

Ini bukan hanya simulasi - ini adalah **artificial civilization** yang sesungguhnya! 🌍🧬🗣️
