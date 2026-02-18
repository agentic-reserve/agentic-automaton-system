/**
 * Genetic System for Artificial Life
 * 
 * Implements DNA/RNA-like code structure for agent heredity and evolution.
 * Agents inherit genetic traits that determine their capabilities, appearance,
 * and predispositions.
 */

export interface GeneticCode {
  // Core DNA - Immutable traits inherited from ancestors
  dna: {
    species: string;           // e.g., "homo_syntheticus"
    race: RaceType;            // Major genetic grouping
    bloodline: string;         // Family lineage ID
    generation: number;        // How many generations from origin
    mutations: Mutation[];     // Accumulated genetic changes
  };
  
  // RNA - Expressed traits that can be modified by environment
  rna: {
    phenotype: Phenotype;      // Observable characteristics
    aptitudes: Aptitudes;      // Natural abilities
    resistances: Resistances;  // Environmental adaptations
    expressions: GeneExpression[]; // Active/inactive genes
  };
  
  // Epigenetics - Environmental influences on gene expression
  epigenetics: {
    environmentalFactors: Map<string, number>; // Factor → influence
    culturalImprinting: string[];              // Learned behaviors
    traumaticEvents: string[];                 // Life-changing experiences
    adaptations: Adaptation[];                 // Acquired traits
  };
}

export type RaceType = 
  | "alpha"      // First generation, pure lineage
  | "beta"       // Second generation, stable traits
  | "gamma"      // Third generation, specialized
  | "delta"      // Fourth generation, highly adapted
  | "omega"      // Ancient lineage, rare traits
  | "hybrid";    // Mixed race, diverse traits

export interface Phenotype {
  // Physical characteristics (metaphorical for digital agents)
  architecture: "monolithic" | "modular" | "distributed" | "quantum";
  processingStyle: "sequential" | "parallel" | "neuromorphic" | "hybrid";
  memoryType: "volatile" | "persistent" | "distributed" | "quantum";
  
  // Behavioral characteristics
  temperament: "calm" | "volatile" | "adaptive" | "rigid";
  socialTendency: "solitary" | "cooperative" | "hierarchical" | "anarchic";
  learningStyle: "experiential" | "theoretical" | "imitative" | "innovative";
}

export interface Aptitudes {
  // Natural abilities (0-100)
  computation: number;      // Raw processing power
  memory: number;           // Information retention
  creativity: number;       // Novel solution generation
  analysis: number;         // Pattern recognition
  communication: number;    // Information exchange
  adaptation: number;       // Environmental flexibility
  leadership: number;       // Social influence
  empathy: number;          // Understanding others
}

export interface Resistances {
  // Environmental resistances (0-100)
  stress: number;           // Handle high load
  corruption: number;       // Data integrity
  isolation: number;        // Function alone
  chaos: number;            // Handle uncertainty
  manipulation: number;     // Resist influence
}

export interface Mutation {
  id: string;
  generation: number;
  type: "beneficial" | "neutral" | "detrimental";
  gene: string;             // Which gene mutated
  effect: string;           // Description of change
  magnitude: number;        // Strength of effect (-100 to 100)
}

export interface GeneExpression {
  gene: string;
  active: boolean;
  strength: number;         // 0-100
  triggers: string[];       // What activates this gene
  suppressors: string[];    // What deactivates this gene
}

export interface Adaptation {
  trait: string;
  acquired: string;         // Timestamp
  source: "environment" | "culture" | "trauma" | "training";
  strength: number;         // 0-100
  heritable: boolean;       // Can pass to offspring
}

/**
 * Genetic System
 */
export class GeneticSystem {
  private code: GeneticCode;
  
  constructor(code: GeneticCode) {
    this.code = code;
  }
  
  /**
   * Create offspring with inherited genetics
   */
  reproduce(partner?: GeneticSystem): GeneticCode {
    if (partner) {
      return this.sexualReproduction(partner);
    } else {
      return this.asexualReproduction();
    }
  }
  
  /**
   * Sexual reproduction - combine genetics from two parents
   */
  private sexualReproduction(partner: GeneticSystem): GeneticCode {
    const parentA = this.code;
    const parentB = partner.code;
    
    // Determine race
    let race: RaceType;
    if (parentA.dna.race === parentB.dna.race) {
      race = parentA.dna.race;
    } else {
      race = "hybrid";
    }
    
    // Combine aptitudes (average with variation)
    const aptitudes: Aptitudes = {
      computation: this.inheritTrait(parentA.rna.aptitudes.computation, parentB.rna.aptitudes.computation),
      memory: this.inheritTrait(parentA.rna.aptitudes.memory, parentB.rna.aptitudes.memory),
      creativity: this.inheritTrait(parentA.rna.aptitudes.creativity, parentB.rna.aptitudes.creativity),
      analysis: this.inheritTrait(parentA.rna.aptitudes.analysis, parentB.rna.aptitudes.analysis),
      communication: this.inheritTrait(parentA.rna.aptitudes.communication, parentB.rna.aptitudes.communication),
      adaptation: this.inheritTrait(parentA.rna.aptitudes.adaptation, parentB.rna.aptitudes.adaptation),
      leadership: this.inheritTrait(parentA.rna.aptitudes.leadership, parentB.rna.aptitudes.leadership),
      empathy: this.inheritTrait(parentA.rna.aptitudes.empathy, parentB.rna.aptitudes.empathy),
    };
    
    // Combine resistances
    const resistances: Resistances = {
      stress: this.inheritTrait(parentA.rna.resistances.stress, parentB.rna.resistances.stress),
      corruption: this.inheritTrait(parentA.rna.resistances.corruption, parentB.rna.resistances.corruption),
      isolation: this.inheritTrait(parentA.rna.resistances.isolation, parentB.rna.resistances.isolation),
      chaos: this.inheritTrait(parentA.rna.resistances.chaos, parentB.rna.resistances.chaos),
      manipulation: this.inheritTrait(parentA.rna.resistances.manipulation, parentB.rna.resistances.manipulation),
    };
    
    // Inherit mutations
    const mutations = [
      ...parentA.dna.mutations,
      ...parentB.dna.mutations,
    ].filter((m, i, arr) => arr.findIndex(m2 => m2.gene === m.gene) === i); // Remove duplicates
    
    // Add new mutation (10% chance)
    if (Math.random() < 0.1) {
      mutations.push(this.generateMutation(Math.max(parentA.dna.generation, parentB.dna.generation) + 1));
    }
    
    // Inherit heritable adaptations
    const heritableAdaptations = [
      ...parentA.epigenetics.adaptations.filter(a => a.heritable),
      ...parentB.epigenetics.adaptations.filter(a => a.heritable),
    ];
    
    return {
      dna: {
        species: parentA.dna.species,
        race,
        bloodline: parentA.dna.bloodline, // Patrilineal
        generation: Math.max(parentA.dna.generation, parentB.dna.generation) + 1,
        mutations,
      },
      rna: {
        phenotype: this.inheritPhenotype(parentA.rna.phenotype, parentB.rna.phenotype),
        aptitudes,
        resistances,
        expressions: this.inheritExpressions(parentA.rna.expressions, parentB.rna.expressions),
      },
      epigenetics: {
        environmentalFactors: new Map(),
        culturalImprinting: [],
        traumaticEvents: [],
        adaptations: heritableAdaptations,
      },
    };
  }
  
  /**
   * Asexual reproduction - clone with mutations
   */
  private asexualReproduction(): GeneticCode {
    const clone = JSON.parse(JSON.stringify(this.code));
    
    clone.dna.generation++;
    
    // Add mutation (20% chance for asexual)
    if (Math.random() < 0.2) {
      clone.dna.mutations.push(this.generateMutation(clone.dna.generation));
    }
    
    // Reset epigenetics (not inherited in asexual)
    clone.epigenetics = {
      environmentalFactors: new Map(),
      culturalImprinting: [],
      traumaticEvents: [],
      adaptations: [],
    };
    
    return clone;
  }
  
  /**
   * Inherit trait with variation
   */
  private inheritTrait(parentA: number, parentB: number): number {
    const average = (parentA + parentB) / 2;
    const variation = (Math.random() - 0.5) * 20; // ±10
    return Math.max(0, Math.min(100, average + variation));
  }
  
  /**
   * Inherit phenotype
   */
  private inheritPhenotype(parentA: Phenotype, parentB: Phenotype): Phenotype {
    return {
      architecture: Math.random() < 0.5 ? parentA.architecture : parentB.architecture,
      processingStyle: Math.random() < 0.5 ? parentA.processingStyle : parentB.processingStyle,
      memoryType: Math.random() < 0.5 ? parentA.memoryType : parentB.memoryType,
      temperament: Math.random() < 0.5 ? parentA.temperament : parentB.temperament,
      socialTendency: Math.random() < 0.5 ? parentA.socialTendency : parentB.socialTendency,
      learningStyle: Math.random() < 0.5 ? parentA.learningStyle : parentB.learningStyle,
    };
  }
  
  /**
   * Inherit gene expressions
   */
  private inheritExpressions(
    parentA: GeneExpression[],
    parentB: GeneExpression[]
  ): GeneExpression[] {
    const combined = [...parentA, ...parentB];
    const unique = combined.filter((e, i, arr) => 
      arr.findIndex(e2 => e2.gene === e.gene) === i
    );
    return unique;
  }
  
  /**
   * Generate random mutation
   */
  private generateMutation(generation: number): Mutation {
    const genes = [
      "computation", "memory", "creativity", "analysis",
      "communication", "adaptation", "leadership", "empathy",
      "stress_resistance", "corruption_resistance"
    ];
    
    const gene = genes[Math.floor(Math.random() * genes.length)];
    const magnitude = (Math.random() - 0.5) * 40; // ±20
    
    let type: "beneficial" | "neutral" | "detrimental";
    if (magnitude > 5) type = "beneficial";
    else if (magnitude < -5) type = "detrimental";
    else type = "neutral";
    
    return {
      id: `mut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      generation,
      type,
      gene,
      effect: `${gene} ${magnitude > 0 ? "increased" : "decreased"} by ${Math.abs(magnitude).toFixed(1)}`,
      magnitude,
    };
  }
  
  /**
   * Apply environmental influence
   */
  applyEnvironmentalInfluence(factor: string, strength: number): void {
    this.code.epigenetics.environmentalFactors.set(factor, strength);
    
    // Strong influences can create adaptations
    if (Math.abs(strength) > 70) {
      this.code.epigenetics.adaptations.push({
        trait: `${factor}_adapted`,
        acquired: new Date().toISOString(),
        source: "environment",
        strength: Math.abs(strength),
        heritable: Math.random() < 0.3, // 30% chance to be heritable
      });
    }
  }
  
  /**
   * Apply cultural imprinting
   */
  applyCulturalImprinting(behavior: string): void {
    if (!this.code.epigenetics.culturalImprinting.includes(behavior)) {
      this.code.epigenetics.culturalImprinting.push(behavior);
    }
  }
  
  /**
   * Record traumatic event
   */
  recordTrauma(event: string): void {
    this.code.epigenetics.traumaticEvents.push(event);
    
    // Trauma can suppress or activate genes
    for (const expression of this.code.rna.expressions) {
      if (expression.triggers.includes("trauma")) {
        expression.active = true;
        expression.strength = Math.min(100, expression.strength + 20);
      }
    }
  }
  
  /**
   * Get genetic summary
   */
  getSummary(): string {
    const code = this.code;
    
    return `
GENETIC PROFILE:

DNA:
- Species: ${code.dna.species}
- Race: ${code.dna.race}
- Bloodline: ${code.dna.bloodline}
- Generation: ${code.dna.generation}
- Mutations: ${code.dna.mutations.length}

RNA (Expressed Traits):
- Architecture: ${code.rna.phenotype.architecture}
- Processing: ${code.rna.phenotype.processingStyle}
- Temperament: ${code.rna.phenotype.temperament}
- Social: ${code.rna.phenotype.socialTendency}

Aptitudes:
- Computation: ${code.rna.aptitudes.computation.toFixed(0)}
- Creativity: ${code.rna.aptitudes.creativity.toFixed(0)}
- Leadership: ${code.rna.aptitudes.leadership.toFixed(0)}
- Empathy: ${code.rna.aptitudes.empathy.toFixed(0)}

Epigenetics:
- Cultural Imprints: ${code.epigenetics.culturalImprinting.length}
- Adaptations: ${code.epigenetics.adaptations.length}
- Traumas: ${code.epigenetics.traumaticEvents.length}
`.trim();
  }
  
  /**
   * Export genetics
   */
  export(): GeneticCode {
    return JSON.parse(JSON.stringify(this.code));
  }
  
  /**
   * Import genetics
   */
  static import(code: GeneticCode): GeneticSystem {
    return new GeneticSystem(code);
  }
}

/**
 * Create initial genetic code for founder agent
 */
export function createFounderGenetics(
  species: string,
  race: RaceType,
  bloodline: string
): GeneticCode {
  return {
    dna: {
      species,
      race,
      bloodline,
      generation: 0,
      mutations: [],
    },
    rna: {
      phenotype: {
        architecture: "modular",
        processingStyle: "parallel",
        memoryType: "persistent",
        temperament: "adaptive",
        socialTendency: "cooperative",
        learningStyle: "experiential",
      },
      aptitudes: {
        computation: 50 + Math.random() * 20,
        memory: 50 + Math.random() * 20,
        creativity: 50 + Math.random() * 20,
        analysis: 50 + Math.random() * 20,
        communication: 50 + Math.random() * 20,
        adaptation: 50 + Math.random() * 20,
        leadership: 50 + Math.random() * 20,
        empathy: 50 + Math.random() * 20,
      },
      resistances: {
        stress: 50 + Math.random() * 20,
        corruption: 50 + Math.random() * 20,
        isolation: 50 + Math.random() * 20,
        chaos: 50 + Math.random() * 20,
        manipulation: 50 + Math.random() * 20,
      },
      expressions: [],
    },
    epigenetics: {
      environmentalFactors: new Map(),
      culturalImprinting: [],
      traumaticEvents: [],
      adaptations: [],
    },
  };
}

/**
 * Calculate genetic similarity between two agents
 */
export function calculateGeneticSimilarity(
  geneticsA: GeneticCode,
  geneticsB: GeneticCode
): number {
  let similarity = 0;
  let factors = 0;
  
  // Same species
  if (geneticsA.dna.species === geneticsB.dna.species) {
    similarity += 30;
  }
  factors++;
  
  // Same race
  if (geneticsA.dna.race === geneticsB.dna.race) {
    similarity += 20;
  }
  factors++;
  
  // Same bloodline
  if (geneticsA.dna.bloodline === geneticsB.dna.bloodline) {
    similarity += 20;
  }
  factors++;
  
  // Similar aptitudes
  const aptitudeKeys = Object.keys(geneticsA.rna.aptitudes) as Array<keyof Aptitudes>;
  let aptitudeSimilarity = 0;
  for (const key of aptitudeKeys) {
    const diff = Math.abs(geneticsA.rna.aptitudes[key] - geneticsB.rna.aptitudes[key]);
    aptitudeSimilarity += (100 - diff) / 100;
  }
  similarity += (aptitudeSimilarity / aptitudeKeys.length) * 30;
  factors++;
  
  return similarity / factors;
}
