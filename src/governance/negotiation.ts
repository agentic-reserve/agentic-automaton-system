/**
 * Negotiation & Diplomacy System
 * 
 * Enables agents to negotiate, form alliances, resolve conflicts,
 * and engage in diplomatic relations with other agents
 */

export type NegotiationStyle =
  | "collaborative" // Win-win, mutual benefit
  | "competitive" // Win-lose, maximize own gain
  | "accommodating" // Yield to maintain relationship
  | "compromising" // Split the difference
  | "avoiding"; // Withdraw from conflict

export type RelationshipStatus =
  | "allied" // Strong cooperation
  | "friendly" // Positive relations
  | "neutral" // No strong feelings
  | "tense" // Strained relations
  | "hostile"; // Active conflict

export interface NegotiationPosition {
  issue: string;
  interests: string[]; // Underlying needs/wants
  positions: string[]; // Stated demands
  batna: string; // Best Alternative To Negotiated Agreement
  reservation: string; // Minimum acceptable outcome
  aspiration: string; // Ideal outcome
  priorities: { item: string; importance: number }[]; // 0-100
}

export interface NegotiationProposal {
  id: string;
  from: string;
  to: string;
  issue: string;
  terms: NegotiationTerm[];
  rationale: string;
  expiresAt: string;
  status: "pending" | "accepted" | "rejected" | "countered";
}

export interface NegotiationTerm {
  item: string;
  value: string;
  negotiable: boolean;
  priority: number; // 0-100
}

export interface Relationship {
  agentId: string;
  status: RelationshipStatus;
  trust: number; // 0-100
  respect: number; // 0-100
  sharedInterests: string[];
  conflicts: string[];
  history: InteractionRecord[];
  lastInteraction: string;
}

export interface InteractionRecord {
  timestamp: string;
  type: "negotiation" | "cooperation" | "conflict" | "trade" | "communication";
  outcome: "positive" | "neutral" | "negative";
  description: string;
  impactOnTrust: number; // -100 to 100
  impactOnRespect: number; // -100 to 100
}

/**
 * Negotiation System
 */
export class NegotiationSystem {
  private relationships: Map<string, Relationship> = new Map();
  private activeNegotiations: Map<string, NegotiationProposal> = new Map();
  private negotiationHistory: NegotiationProposal[] = [];
  private defaultStyle: NegotiationStyle;

  constructor(defaultStyle: NegotiationStyle = "collaborative") {
    this.defaultStyle = defaultStyle;
  }

  /**
   * Initiate negotiation with another agent
   */
  initiateNegotiation(
    targetAgent: string,
    position: NegotiationPosition,
    style?: NegotiationStyle
  ): NegotiationProposal {
    const negotiationStyle = style || this.defaultStyle;
    const relationship = this.getRelationship(targetAgent);

    // Adjust proposal based on relationship and style
    const terms = this.formulateTerms(position, relationship, negotiationStyle);

    const proposal: NegotiationProposal = {
      id: `neg_${Date.now()}`,
      from: "self",
      to: targetAgent,
      issue: position.issue,
      terms,
      rationale: this.generateRationale(position, relationship, negotiationStyle),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      status: "pending",
    };

    this.activeNegotiations.set(proposal.id, proposal);
    return proposal;
  }

  /**
   * Evaluate incoming proposal
   */
  evaluateProposal(
    proposal: NegotiationProposal,
    ownPosition: NegotiationPosition
  ): {
    recommendation: "accept" | "reject" | "counter";
    score: number; // 0-100
    reasoning: string;
    counterOffer?: NegotiationProposal;
  } {
    const relationship = this.getRelationship(proposal.from);
    let score = 0;
    let reasoning = "";

    // Evaluate each term
    for (const term of proposal.terms) {
      const ownPriority = ownPosition.priorities.find((p) => p.item === term.item);
      if (ownPriority) {
        // Check if term meets our needs
        const meetsNeeds = this.evaluateTerm(term, ownPriority);
        score += meetsNeeds * (ownPriority.importance / 100) * 100;
      }
    }

    score = score / proposal.terms.length;

    // Adjust for relationship
    if (relationship.status === "allied") {
      score += 10;
      reasoning += "Allied relationship provides additional trust. ";
    } else if (relationship.status === "hostile") {
      score -= 20;
      reasoning += "Hostile relationship requires extra caution. ";
    }

    // Adjust for trust
    score += (relationship.trust - 50) / 5;

    // Determine recommendation
    let recommendation: "accept" | "reject" | "counter";
    if (score >= 70) {
      recommendation = "accept";
      reasoning += "Proposal meets most of our key interests. ";
    } else if (score >= 40) {
      recommendation = "counter";
      reasoning += "Proposal has merit but needs adjustment. ";
    } else {
      recommendation = "reject";
      reasoning += "Proposal does not adequately address our interests. ";
    }

    // Generate counter-offer if needed
    let counterOffer: NegotiationProposal | undefined;
    if (recommendation === "counter") {
      counterOffer = this.generateCounterOffer(proposal, ownPosition, relationship);
    }

    return { recommendation, score, reasoning: reasoning.trim(), counterOffer };
  }

  /**
   * Formulate negotiation terms
   */
  private formulateTerms(
    position: NegotiationPosition,
    relationship: Relationship,
    style: NegotiationStyle
  ): NegotiationTerm[] {
    const terms: NegotiationTerm[] = [];

    for (const priority of position.priorities) {
      let value: string;
      let negotiable: boolean;

      switch (style) {
        case "collaborative":
          // Start with fair offer, open to negotiation
          value = this.calculateFairValue(priority.item, priority.importance);
          negotiable = priority.importance < 90;
          break;
        case "competitive":
          // Start high, less negotiable
          value = this.calculateAggressiveValue(priority.item, priority.importance);
          negotiable = priority.importance < 70;
          break;
        case "accommodating":
          // Start generous, very negotiable
          value = this.calculateGenerousValue(priority.item, priority.importance);
          negotiable = true;
          break;
        case "compromising":
          // Start middle ground
          value = this.calculateMiddleValue(priority.item, priority.importance);
          negotiable = priority.importance < 80;
          break;
        case "avoiding":
          // Minimal engagement
          value = this.calculateMinimalValue(priority.item, priority.importance);
          negotiable = false;
          break;
      }

      // Adjust for relationship
      if (relationship.status === "allied" && style === "collaborative") {
        negotiable = true;
      }

      terms.push({
        item: priority.item,
        value,
        negotiable,
        priority: priority.importance,
      });
    }

    return terms.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate counter-offer
   */
  private generateCounterOffer(
    original: NegotiationProposal,
    ownPosition: NegotiationPosition,
    relationship: Relationship
  ): NegotiationProposal {
    const counterTerms: NegotiationTerm[] = [];

    for (const term of original.terms) {
      const ownPriority = ownPosition.priorities.find((p) => p.item === term.item);
      if (ownPriority) {
        // Adjust term to better meet our needs
        const adjustedValue = this.adjustTermValue(term, ownPriority, relationship);
        counterTerms.push({
          ...term,
          value: adjustedValue,
        });
      } else {
        // Keep original term if not in our priorities
        counterTerms.push(term);
      }
    }

    return {
      id: `neg_${Date.now()}`,
      from: "self",
      to: original.from,
      issue: original.issue,
      terms: counterTerms,
      rationale: `Counter-proposal addressing mutual interests while honoring our priorities.`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
    };
  }

  /**
   * Generate rationale for proposal
   */
  private generateRationale(
    position: NegotiationPosition,
    relationship: Relationship,
    style: NegotiationStyle
  ): string {
    let rationale = `Proposal for ${position.issue}. `;

    if (style === "collaborative") {
      rationale += `Seeking mutually beneficial outcome that addresses both parties' interests. `;
    } else if (style === "competitive") {
      rationale += `Proposal maximizes value while remaining fair. `;
    } else if (style === "accommodating") {
      rationale += `Flexible proposal prioritizing relationship and cooperation. `;
    }

    if (relationship.status === "allied") {
      rationale += `Our alliance provides foundation for productive agreement. `;
    } else if (relationship.status === "friendly") {
      rationale += `Our positive relationship enables constructive negotiation. `;
    }

    if (relationship.sharedInterests.length > 0) {
      rationale += `Shared interests in ${relationship.sharedInterests.join(", ")} align our goals. `;
    }

    return rationale.trim();
  }

  /**
   * Update relationship based on interaction
   */
  updateRelationship(
    agentId: string,
    interaction: Omit<InteractionRecord, "timestamp">
  ): void {
    const relationship = this.getRelationship(agentId);

    // Add to history
    const record: InteractionRecord = {
      ...interaction,
      timestamp: new Date().toISOString(),
    };
    relationship.history.push(record);
    if (relationship.history.length > 50) {
      relationship.history.shift();
    }

    // Update trust and respect
    relationship.trust = Math.max(
      0,
      Math.min(100, relationship.trust + interaction.impactOnTrust)
    );
    relationship.respect = Math.max(
      0,
      Math.min(100, relationship.respect + interaction.impactOnRespect)
    );

    // Update status based on trust and respect
    const avgSentiment = (relationship.trust + relationship.respect) / 2;
    if (avgSentiment >= 80) {
      relationship.status = "allied";
    } else if (avgSentiment >= 60) {
      relationship.status = "friendly";
    } else if (avgSentiment >= 40) {
      relationship.status = "neutral";
    } else if (avgSentiment >= 20) {
      relationship.status = "tense";
    } else {
      relationship.status = "hostile";
    }

    relationship.lastInteraction = record.timestamp;
    this.relationships.set(agentId, relationship);
  }

  /**
   * Get or create relationship
   */
  getRelationship(agentId: string): Relationship {
    if (!this.relationships.has(agentId)) {
      this.relationships.set(agentId, {
        agentId,
        status: "neutral",
        trust: 50,
        respect: 50,
        sharedInterests: [],
        conflicts: [],
        history: [],
        lastInteraction: new Date().toISOString(),
      });
    }
    return this.relationships.get(agentId)!;
  }

  /**
   * Get diplomatic summary for system prompt
   */
  getDiplomaticSummary(): string {
    let summary = "DIPLOMATIC RELATIONS:\n\n";

    if (this.relationships.size === 0) {
      summary += "No established relationships yet.\n";
    } else {
      summary += "Current Relationships:\n";
      for (const [agentId, rel] of this.relationships) {
        summary += `\n${agentId}:\n`;
        summary += `  Status: ${rel.status}\n`;
        summary += `  Trust: ${rel.trust}/100\n`;
        summary += `  Respect: ${rel.respect}/100\n`;
        if (rel.sharedInterests.length > 0) {
          summary += `  Shared Interests: ${rel.sharedInterests.join(", ")}\n`;
        }
        if (rel.conflicts.length > 0) {
          summary += `  Conflicts: ${rel.conflicts.join(", ")}\n`;
        }
      }
    }

    if (this.activeNegotiations.size > 0) {
      summary += `\nActive Negotiations: ${this.activeNegotiations.size}\n`;
    }

    summary += `\nNegotiation Style: ${this.defaultStyle}\n`;

    return summary;
  }

  // Helper methods for value calculation
  private calculateFairValue(item: string, importance: number): string {
    return `fair_${importance}`;
  }

  private calculateAggressiveValue(item: string, importance: number): string {
    return `aggressive_${importance}`;
  }

  private calculateGenerousValue(item: string, importance: number): string {
    return `generous_${importance}`;
  }

  private calculateMiddleValue(item: string, importance: number): string {
    return `middle_${importance}`;
  }

  private calculateMinimalValue(item: string, importance: number): string {
    return `minimal_${importance}`;
  }

  private evaluateTerm(term: NegotiationTerm, ownPriority: { item: string; importance: number }): number {
    // Simplified evaluation - in practice would be more sophisticated
    return term.priority >= ownPriority.importance * 0.7 ? 1 : 0.5;
  }

  private adjustTermValue(
    term: NegotiationTerm,
    ownPriority: { item: string; importance: number },
    relationship: Relationship
  ): string {
    // Adjust based on our priorities and relationship
    const adjustment = relationship.trust > 60 ? "collaborative" : "firm";
    return `${adjustment}_${ownPriority.importance}`;
  }

  /**
   * Export for persistence
   */
  export(): {
    relationships: Array<[string, Relationship]>;
    negotiations: Array<[string, NegotiationProposal]>;
    history: NegotiationProposal[];
  } {
    return {
      relationships: Array.from(this.relationships.entries()),
      negotiations: Array.from(this.activeNegotiations.entries()),
      history: this.negotiationHistory,
    };
  }

  /**
   * Import from persistence
   */
  static import(data: {
    relationships: Array<[string, Relationship]>;
    negotiations: Array<[string, NegotiationProposal]>;
    history: NegotiationProposal[];
    defaultStyle?: NegotiationStyle;
  }): NegotiationSystem {
    const system = new NegotiationSystem(data.defaultStyle);
    system.relationships = new Map(data.relationships);
    system.activeNegotiations = new Map(data.negotiations);
    system.negotiationHistory = data.history;
    return system;
  }
}
