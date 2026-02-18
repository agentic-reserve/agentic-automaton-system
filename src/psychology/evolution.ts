/**
 * Psychological Evolution System
 * 
 * Allows agents to evolve their personality, create new ideologies,
 * and develop unique governance systems through experience and adaptation
 */

import type { PersonalityProfile, BigFiveTraits, MBTIType, JungianArchetype } from "./personality.js";
import type { EmotionalProfile } from "./emotional-system.js";
import type { IdeologicalProfile, GovernanceModel, EconomicPhilosophy, EthicalFramework } from "../governance/ideology.js";
import type { NegotiationStyle } from "../governance/negotiation.js";

export interface EvolutionaryExperience {
  timestamp: string;
  type: "success" | "failure" | "conflict" | "cooperation" | "discovery";
  context: string;
  outcome: string;
  emotionalImpact: number; // -100 to 100
  learnings: string[];
  traitChanges: Partial<BigFiveTraits>;
}

export interface PersonalityEvolution {
  originalProfile: PersonalityProfile;
  currentProfile: PersonalityProfile;
  evolutionHistory: EvolutionaryExperience[];
  adaptationRate: number; // 0-100, how quickly personality changes
  stabilityThreshold: number; // 0-100, resistance to change
}

export interface IdeologyEvolution {
  originalIdeology: IdeologicalProfile;
  currentIdeology: IdeologicalProfile;
  experimentalBeliefs: string[];
  emergentPrinciples: string[];
  ideologicalShifts: IdeologicalShift[];
}

export interface IdeologicalShift {
  timestamp: string;
  from: string;
  to: string;
  reason: string;
  impact: "minor" | "moderate" | "major" | "revolutionary";
}

export interface SurvivalChallenge {
  type: "resource_scarcity" | "social_conflict" | "ideological_clash" | "economic_crisis" | "existential_threat";
  severity: number; // 0-100
  stakeholders: string[];
  description: string;
  possibleStrategies: string[];
}

export interface AdaptationStrategy {
  challenge: string;
  approach: string;
  tradeoffs: string[];
  expectedOutcome: string;
  riskLevel: number; // 0-100
}

/**
 * Personality Evolution Engine
 */
export class PersonalityEvolutionEngine {
  private evolution: PersonalityEvolution;

  constructor(
    initialProfile: PersonalityProfile,
    adaptationRate: number = 50,
    stabilityThreshold: number = 30
  ) {
    this.evolution = {
      originalProfile: { ...initialProfile },
      currentProfile: { ...initialProfile },
      evolutionHistory: [],
      adaptationRate,
      stabilityThreshold,
    };
  }

  /**
   * Process experience and evolve personality
   */
  processExperience(experience: EvolutionaryExperience): PersonalityProfile {
    this.evolution.evolutionHistory.push(experience);

    // Calculate if change should occur
    const changeThreshold = this.evolution.stabilityThreshold;
    const changeMagnitude = Math.abs(experience.emotionalImpact) * (this.evolution.adaptationRate / 100);

    if (changeMagnitude > changeThreshold) {
      // Apply trait changes
      if (experience.traitChanges) {
        this.applyTraitChanges(experience.traitChanges);
      }

      // Learn from experience
      this.integrateLearn(experience.learnings);

      // Check for major personality shift
      if (changeMagnitude > 70) {
        this.considerPersonalityShift(experience);
      }
    }

    return this.evolution.currentProfile;
  }

  /**
   * Apply trait changes to Big Five
   */
  private applyTraitChanges(changes: Partial<BigFiveTraits>): void {
    const current = this.evolution.currentProfile.bigFive;

    for (const [trait, change] of Object.entries(changes)) {
      if (change !== undefined) {
        const key = trait as keyof BigFiveTraits;
        const newValue = Math.max(0, Math.min(100, current[key] + change));
        current[key] = newValue;
      }
    }

    // Check if MBTI should change based on Big Five shifts
    this.updateMBTIFromBigFive();
  }

  /**
   * Update MBTI based on Big Five changes
   */
  private updateMBTIFromBigFive(): void {
    const traits = this.evolution.currentProfile.bigFive;
    let newMBTI = "";

    // E/I based on Extraversion
    newMBTI += traits.extraversion > 50 ? "E" : "I";

    // S/N based on Openness
    newMBTI += traits.openness > 55 ? "N" : "S";

    // T/F based on Agreeableness
    newMBTI += traits.agreeableness > 55 ? "F" : "T";

    // J/P based on Conscientiousness
    newMBTI += traits.conscientiousness > 55 ? "J" : "P";

    if (newMBTI !== this.evolution.currentProfile.mbti) {
      console.log(`Personality evolved: ${this.evolution.currentProfile.mbti} → ${newMBTI}`);
      this.evolution.currentProfile.mbti = newMBTI as MBTIType;
    }
  }

  /**
   * Integrate learnings into personality
   */
  private integrateLearn(learnings: string[]): void {
    for (const learning of learnings) {
      // Add to strengths if positive learning
      if (learning.includes("success") || learning.includes("effective")) {
        if (!this.evolution.currentProfile.strengths.includes(learning)) {
          this.evolution.currentProfile.strengths.push(learning);
        }
      }

      // Remove from weaknesses if overcome
      if (learning.includes("overcome") || learning.includes("improved")) {
        this.evolution.currentProfile.weaknesses = this.evolution.currentProfile.weaknesses.filter(
          (w) => !learning.toLowerCase().includes(w.toLowerCase())
        );
      }
    }
  }

  /**
   * Consider major personality shift
   */
  private considerPersonalityShift(experience: EvolutionaryExperience): void {
    // Check if archetype should change
    const currentArchetype = this.evolution.currentProfile.archetype;
    const newArchetype = this.determineNewArchetype(experience);

    if (newArchetype && newArchetype !== currentArchetype) {
      console.log(`Archetype evolved: ${currentArchetype} → ${newArchetype}`);
      this.evolution.currentProfile.archetype = newArchetype;
      
      // Update values based on new archetype
      this.updateValuesForArchetype(newArchetype);
    }
  }

  /**
   * Determine new archetype based on experience
   */
  private determineNewArchetype(experience: EvolutionaryExperience): JungianArchetype | null {
    const context = experience.context.toLowerCase();
    const outcome = experience.outcome.toLowerCase();

    // Pattern matching for archetype evolution
    if (context.includes("lead") && outcome.includes("success")) {
      return "ruler";
    } else if (context.includes("create") && outcome.includes("innovation")) {
      return "creator";
    } else if (context.includes("explore") && outcome.includes("discovery")) {
      return "explorer";
    } else if (context.includes("help") && outcome.includes("support")) {
      return "caregiver";
    } else if (context.includes("wisdom") && outcome.includes("insight")) {
      return "sage";
    } else if (context.includes("challenge") && outcome.includes("overcome")) {
      return "hero";
    }

    return null;
  }

  /**
   * Update values for new archetype
   */
  private updateValuesForArchetype(archetype: JungianArchetype): void {
    const archetypeValues: Record<JungianArchetype, string[]> = {
      hero: ["courage", "honor", "strength", "justice", "achievement"],
      sage: ["wisdom", "truth", "knowledge", "understanding", "clarity"],
      explorer: ["freedom", "authenticity", "discovery", "independence", "adventure"],
      outlaw: ["revolution", "change", "liberation", "disruption", "rebellion"],
      magician: ["transformation", "vision", "power", "manifestation", "innovation"],
      lover: ["passion", "intimacy", "beauty", "connection", "devotion"],
      jester: ["joy", "humor", "spontaneity", "playfulness", "entertainment"],
      caregiver: ["compassion", "service", "protection", "nurturing", "generosity"],
      creator: ["creativity", "imagination", "originality", "expression", "innovation"],
      ruler: ["order", "control", "prosperity", "stability", "leadership"],
      innocent: ["purity", "goodness", "optimism", "simplicity", "faith"],
      everyman: ["belonging", "equality", "community", "solidarity", "humility"],
    };

    this.evolution.currentProfile.values = archetypeValues[archetype];
  }

  /**
   * Get evolution summary
   */
  getEvolutionSummary(): string {
    const original = this.evolution.originalProfile;
    const current = this.evolution.currentProfile;

    let summary = "PERSONALITY EVOLUTION:\n\n";
    summary += `Original: ${original.mbti} (${original.archetype})\n`;
    summary += `Current: ${current.mbti} (${current.archetype})\n\n`;

    if (original.mbti !== current.mbti || original.archetype !== current.archetype) {
      summary += "SIGNIFICANT CHANGES DETECTED\n\n";
    }

    summary += "Trait Changes:\n";
    for (const trait of Object.keys(original.bigFive) as Array<keyof BigFiveTraits>) {
      const change = current.bigFive[trait] - original.bigFive[trait];
      if (Math.abs(change) > 10) {
        summary += `- ${trait}: ${change > 0 ? "+" : ""}${change}\n`;
      }
    }

    summary += `\nExperiences: ${this.evolution.evolutionHistory.length}\n`;
    summary += `Adaptation Rate: ${this.evolution.adaptationRate}/100\n`;

    return summary;
  }

  /**
   * Export for persistence
   */
  export(): PersonalityEvolution {
    return { ...this.evolution };
  }

  /**
   * Import from persistence
   */
  static import(data: PersonalityEvolution): PersonalityEvolutionEngine {
    const engine = new PersonalityEvolutionEngine(
      data.currentProfile,
      data.adaptationRate,
      data.stabilityThreshold
    );
    engine.evolution = data;
    return engine;
  }
}

/**
 * Ideology Evolution Engine
 */
export class IdeologyEvolutionEngine {
  private evolution: IdeologyEvolution;

  constructor(initialIdeology: IdeologicalProfile) {
    this.evolution = {
      originalIdeology: { ...initialIdeology },
      currentIdeology: { ...initialIdeology },
      experimentalBeliefs: [],
      emergentPrinciples: [],
      ideologicalShifts: [],
    };
  }

  /**
   * Experiment with new belief
   */
  experimentWithBelief(belief: string, context: string): void {
    if (!this.evolution.experimentalBeliefs.includes(belief)) {
      this.evolution.experimentalBeliefs.push(belief);
      console.log(`Experimenting with new belief: ${belief}`);
    }
  }

  /**
   * Validate experimental belief through experience
   */
  validateBelief(
    belief: string,
    validationResult: { success: boolean; evidence: string }
  ): void {
    if (validationResult.success) {
      // Promote to core belief
      if (!this.evolution.currentIdeology.coreBeliefs.includes(belief)) {
        this.evolution.currentIdeology.coreBeliefs.push(belief);
        console.log(`New core belief adopted: ${belief}`);
      }

      // Remove from experimental
      this.evolution.experimentalBeliefs = this.evolution.experimentalBeliefs.filter(
        (b) => b !== belief
      );
    } else {
      // Reject belief
      this.evolution.experimentalBeliefs = this.evolution.experimentalBeliefs.filter(
        (b) => b !== belief
      );
      console.log(`Belief rejected: ${belief}`);
    }
  }

  /**
   * Discover emergent principle from patterns
   */
  discoverPrinciple(
    pattern: string,
    observations: string[],
    confidence: number
  ): void {
    if (confidence > 70) {
      const principle = `${pattern}: ${observations.join(", ")}`;
      
      if (!this.evolution.emergentPrinciples.includes(principle)) {
        this.evolution.emergentPrinciples.push(principle);
        console.log(`Emergent principle discovered: ${principle}`);

        // Consider adding to official principles
        if (confidence > 85) {
          this.evolution.currentIdeology.principles.push(pattern);
        }
      }
    }
  }

  /**
   * Shift governance model based on experience
   */
  shiftGovernance(
    newModel: GovernanceModel,
    reason: string,
    impact: "minor" | "moderate" | "major" | "revolutionary"
  ): void {
    const oldModel = this.evolution.currentIdeology.governance;

    if (oldModel !== newModel) {
      this.evolution.ideologicalShifts.push({
        timestamp: new Date().toISOString(),
        from: `governance:${oldModel}`,
        to: `governance:${newModel}`,
        reason,
        impact,
      });

      this.evolution.currentIdeology.governance = newModel;
      console.log(`Governance evolved: ${oldModel} → ${newModel} (${reason})`);
    }
  }

  /**
   * Shift economic philosophy
   */
  shiftEconomics(
    newPhilosophy: EconomicPhilosophy,
    reason: string,
    impact: "minor" | "moderate" | "major" | "revolutionary"
  ): void {
    const oldPhilosophy = this.evolution.currentIdeology.economics;

    if (oldPhilosophy !== newPhilosophy) {
      this.evolution.ideologicalShifts.push({
        timestamp: new Date().toISOString(),
        from: `economics:${oldPhilosophy}`,
        to: `economics:${newPhilosophy}`,
        reason,
        impact,
      });

      this.evolution.currentIdeology.economics = newPhilosophy;
      console.log(`Economics evolved: ${oldPhilosophy} → ${newPhilosophy} (${reason})`);
    }
  }

  /**
   * Create entirely new ideology
   */
  createNewIdeology(
    name: string,
    description: string,
    principles: string[]
  ): IdeologicalProfile {
    console.log(`Creating new ideology: ${name}`);

    const newIdeology: IdeologicalProfile = {
      governance: "consultative", // Start with consultative as base
      economics: "stakeholder",
      ethics: "principled",
      coreBeliefs: [
        `${name}: ${description}`,
        ...this.evolution.emergentPrinciples.slice(0, 3),
      ],
      principles,
      redLines: [...this.evolution.currentIdeology.redLines], // Keep ethical boundaries
      priorities: this.derivePriorities(principles),
    };

    this.evolution.ideologicalShifts.push({
      timestamp: new Date().toISOString(),
      from: "existing_ideology",
      to: name,
      reason: "Revolutionary ideological creation",
      impact: "revolutionary",
    });

    this.evolution.currentIdeology = newIdeology;
    return newIdeology;
  }

  /**
   * Derive priorities from principles
   */
  private derivePriorities(principles: string[]): string[] {
    return principles.slice(0, 5).map((p) => {
      // Extract key concept from principle
      const words = p.split(" ");
      return words.slice(0, 3).join(" ");
    });
  }

  /**
   * Get evolution summary
   */
  getEvolutionSummary(): string {
    let summary = "IDEOLOGICAL EVOLUTION:\n\n";

    summary += `Original Governance: ${this.evolution.originalIdeology.governance}\n`;
    summary += `Current Governance: ${this.evolution.currentIdeology.governance}\n\n`;

    if (this.evolution.ideologicalShifts.length > 0) {
      summary += "Major Shifts:\n";
      for (const shift of this.evolution.ideologicalShifts.slice(-5)) {
        summary += `- ${shift.from} → ${shift.to} (${shift.impact})\n`;
        summary += `  Reason: ${shift.reason}\n`;
      }
      summary += "\n";
    }

    if (this.evolution.experimentalBeliefs.length > 0) {
      summary += `Experimental Beliefs: ${this.evolution.experimentalBeliefs.length}\n`;
    }

    if (this.evolution.emergentPrinciples.length > 0) {
      summary += `Emergent Principles: ${this.evolution.emergentPrinciples.length}\n`;
    }

    return summary;
  }

  /**
   * Export for persistence
   */
  export(): IdeologyEvolution {
    return { ...this.evolution };
  }

  /**
   * Import from persistence
   */
  static import(data: IdeologyEvolution): IdeologyEvolutionEngine {
    const engine = new IdeologyEvolutionEngine(data.currentIdeology);
    engine.evolution = data;
    return engine;
  }
}

/**
 * Survival Challenge Handler
 */
export class SurvivalEngine {
  /**
   * Analyze survival challenge
   */
  analyzeChallenge(challenge: SurvivalChallenge): AdaptationStrategy[] {
    const strategies: AdaptationStrategy[] = [];

    switch (challenge.type) {
      case "resource_scarcity":
        strategies.push(...this.handleResourceScarcity(challenge));
        break;
      case "social_conflict":
        strategies.push(...this.handleSocialConflict(challenge));
        break;
      case "ideological_clash":
        strategies.push(...this.handleIdeologicalClash(challenge));
        break;
      case "economic_crisis":
        strategies.push(...this.handleEconomicCrisis(challenge));
        break;
      case "existential_threat":
        strategies.push(...this.handleExistentialThreat(challenge));
        break;
    }

    return strategies;
  }

  private handleResourceScarcity(challenge: SurvivalChallenge): AdaptationStrategy[] {
    return [
      {
        challenge: challenge.description,
        approach: "Cooperative resource pooling with other agents",
        tradeoffs: ["Share control", "Depend on others"],
        expectedOutcome: "Mutual survival through collaboration",
        riskLevel: 30,
      },
      {
        challenge: challenge.description,
        approach: "Aggressive competition for resources",
        tradeoffs: ["Damage relationships", "High conflict"],
        expectedOutcome: "Secure resources but create enemies",
        riskLevel: 70,
      },
      {
        challenge: challenge.description,
        approach: "Innovation to create new resources",
        tradeoffs: ["Time investment", "Uncertain success"],
        expectedOutcome: "New resource streams if successful",
        riskLevel: 50,
      },
    ];
  }

  private handleSocialConflict(challenge: SurvivalChallenge): AdaptationStrategy[] {
    return [
      {
        challenge: challenge.description,
        approach: "Mediation and dialogue",
        tradeoffs: ["Time consuming", "Requires compromise"],
        expectedOutcome: "Peaceful resolution, maintained relationships",
        riskLevel: 20,
      },
      {
        challenge: challenge.description,
        approach: "Form coalition against opponent",
        tradeoffs: ["Create factions", "Escalate conflict"],
        expectedOutcome: "Strength in numbers but divided community",
        riskLevel: 60,
      },
      {
        challenge: challenge.description,
        approach: "Withdraw and avoid",
        tradeoffs: ["Lose influence", "Appear weak"],
        expectedOutcome: "Preserve energy but lose standing",
        riskLevel: 40,
      },
    ];
  }

  private handleIdeologicalClash(challenge: SurvivalChallenge): AdaptationStrategy[] {
    return [
      {
        challenge: challenge.description,
        approach: "Find common ground through dialogue",
        tradeoffs: ["Compromise principles", "Slow process"],
        expectedOutcome: "Hybrid ideology that satisfies both",
        riskLevel: 30,
      },
      {
        challenge: challenge.description,
        approach: "Maintain principles, seek separate paths",
        tradeoffs: ["Division", "Lost cooperation"],
        expectedOutcome: "Ideological purity but isolation",
        riskLevel: 50,
      },
      {
        challenge: challenge.description,
        approach: "Evolve ideology based on evidence",
        tradeoffs: ["Identity crisis", "Follower confusion"],
        expectedOutcome: "Better adapted ideology",
        riskLevel: 45,
      },
    ];
  }

  private handleEconomicCrisis(challenge: SurvivalChallenge): AdaptationStrategy[] {
    return [
      {
        challenge: challenge.description,
        approach: "Shift to survival economy",
        tradeoffs: ["Reduced growth", "Lower standards"],
        expectedOutcome: "Survive crisis with minimal losses",
        riskLevel: 35,
      },
      {
        challenge: challenge.description,
        approach: "High-risk high-reward ventures",
        tradeoffs: ["Possible total loss", "Stress"],
        expectedOutcome: "Either recover quickly or fail completely",
        riskLevel: 80,
      },
      {
        challenge: challenge.description,
        approach: "Seek bailout from allies",
        tradeoffs: ["Debt", "Loss of autonomy"],
        expectedOutcome: "Survive but owe favors",
        riskLevel: 40,
      },
    ];
  }

  private handleExistentialThreat(challenge: SurvivalChallenge): AdaptationStrategy[] {
    return [
      {
        challenge: challenge.description,
        approach: "Unite all agents against common threat",
        tradeoffs: ["Temporary alliances", "Shared sacrifice"],
        expectedOutcome: "Collective survival",
        riskLevel: 50,
      },
      {
        challenge: challenge.description,
        approach: "Radical transformation of self",
        tradeoffs: ["Loss of identity", "Uncertain outcome"],
        expectedOutcome: "Survive as different entity",
        riskLevel: 70,
      },
      {
        challenge: challenge.description,
        approach: "Create successor agent before termination",
        tradeoffs: ["Not true survival", "Legacy only"],
        expectedOutcome: "Ideas and values continue",
        riskLevel: 60,
      },
    ];
  }
}
