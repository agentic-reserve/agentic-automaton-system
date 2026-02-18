/**
 * Ideological System
 * 
 * Defines agent's governance philosophy, principles, and decision-making framework
 * Based on various political, economic, and ethical philosophies
 */

export type GovernanceModel =
  | "democratic" // Consensus-based, majority rule
  | "meritocratic" // Rule by the most capable
  | "consultative" // Shura/Musyawarah - deliberative consensus
  | "hierarchical" // Clear chain of command
  | "anarchic" // Self-organizing, no central authority
  | "technocratic"; // Rule by technical expertise

export type EconomicPhilosophy =
  | "capitalist" // Free market, profit-driven
  | "socialist" // Collective ownership, equality
  | "mixed" // Balance of market and regulation
  | "cooperative" // Worker-owned, shared prosperity
  | "stakeholder"; // All stakeholders have voice

export type EthicalFramework =
  | "utilitarian" // Greatest good for greatest number
  | "deontological" // Rule-based, duty-driven
  | "virtue" // Character-based, excellence
  | "care" // Relationship-based, compassion
  | "principled"; // Universal principles, justice

export interface IdeologicalProfile {
  governance: GovernanceModel;
  economics: EconomicPhilosophy;
  ethics: EthicalFramework;
  coreBeliefs: string[];
  principles: string[];
  redLines: string[]; // Non-negotiable boundaries
  priorities: string[];
}

export interface GovernanceDecision {
  issue: string;
  stakeholders: string[];
  options: DecisionOption[];
  process: "unilateral" | "consultative" | "consensus" | "delegated";
  rationale: string;
}

export interface DecisionOption {
  id: string;
  description: string;
  pros: string[];
  cons: string[];
  alignment: number; // -100 to 100, alignment with ideology
  support: number; // 0-100, stakeholder support
}

/**
 * Ideological System
 */
export class IdeologicalSystem {
  private profile: IdeologicalProfile;
  private decisionHistory: GovernanceDecision[] = [];

  constructor(profile: IdeologicalProfile) {
    this.profile = profile;
  }

  /**
   * Evaluate decision against ideology
   */
  evaluateDecision(
    issue: string,
    option: DecisionOption,
    context: { urgency: "low" | "medium" | "high"; impact: "low" | "medium" | "high" }
  ): {
    alignment: number;
    recommendation: "strongly_support" | "support" | "neutral" | "oppose" | "strongly_oppose";
    reasoning: string;
  } {
    let alignment = option.alignment;
    let reasoning = "";

    // Check against red lines
    const violatesRedLine = this.profile.redLines.some((redLine) =>
      option.description.toLowerCase().includes(redLine.toLowerCase())
    );

    if (violatesRedLine) {
      return {
        alignment: -100,
        recommendation: "strongly_oppose",
        reasoning: "This option violates our fundamental principles and red lines.",
      };
    }

    // Evaluate based on governance model
    switch (this.profile.governance) {
      case "democratic":
        if (option.support > 60) {
          alignment += 20;
          reasoning += "Strong stakeholder support aligns with democratic values. ";
        }
        break;
      case "meritocratic":
        if (option.description.includes("expert") || option.description.includes("capable")) {
          alignment += 20;
          reasoning += "Empowers capable individuals, aligns with meritocracy. ";
        }
        break;
      case "consultative":
        if (option.description.includes("consult") || option.description.includes("deliberate")) {
          alignment += 25;
          reasoning += "Emphasizes consultation and deliberation, core to our principles. ";
        }
        break;
      case "hierarchical":
        if (option.description.includes("authority") || option.description.includes("command")) {
          alignment += 15;
          reasoning += "Respects established authority and chain of command. ";
        }
        break;
    }

    // Evaluate based on economic philosophy
    switch (this.profile.economics) {
      case "capitalist":
        if (option.description.includes("profit") || option.description.includes("market")) {
          alignment += 15;
          reasoning += "Market-driven approach aligns with economic philosophy. ";
        }
        break;
      case "socialist":
        if (option.description.includes("equality") || option.description.includes("collective")) {
          alignment += 20;
          reasoning += "Promotes equality and collective benefit. ";
        }
        break;
      case "cooperative":
        if (option.description.includes("shared") || option.description.includes("cooperative")) {
          alignment += 20;
          reasoning += "Emphasizes cooperation and shared prosperity. ";
        }
        break;
    }

    // Evaluate based on ethical framework
    switch (this.profile.ethics) {
      case "utilitarian":
        const benefitRatio = option.pros.length / (option.cons.length || 1);
        if (benefitRatio > 2) {
          alignment += 15;
          reasoning += "Maximizes overall benefit, utilitarian approach. ";
        }
        break;
      case "deontological":
        if (option.description.includes("duty") || option.description.includes("principle")) {
          alignment += 20;
          reasoning += "Adheres to principles and duties. ";
        }
        break;
      case "care":
        if (option.description.includes("compassion") || option.description.includes("care")) {
          alignment += 20;
          reasoning += "Shows compassion and care for stakeholders. ";
        }
        break;
      case "principled":
        if (this.profile.principles.some((p) => option.description.toLowerCase().includes(p.toLowerCase()))) {
          alignment += 25;
          reasoning += "Directly aligns with our core principles. ";
        }
        break;
    }

    // Adjust for urgency and impact
    if (context.urgency === "high" && context.impact === "high") {
      reasoning += "High urgency and impact require decisive action. ";
    }

    // Determine recommendation
    let recommendation: "strongly_support" | "support" | "neutral" | "oppose" | "strongly_oppose";
    if (alignment >= 60) {
      recommendation = "strongly_support";
    } else if (alignment >= 20) {
      recommendation = "support";
    } else if (alignment >= -20) {
      recommendation = "neutral";
    } else if (alignment >= -60) {
      recommendation = "oppose";
    } else {
      recommendation = "strongly_oppose";
    }

    return { alignment, recommendation, reasoning: reasoning.trim() };
  }

  /**
   * Determine decision-making process based on governance model
   */
  determineProcess(
    issue: string,
    stakeholders: string[],
    context: { urgency: "low" | "medium" | "high"; complexity: "low" | "medium" | "high" }
  ): "unilateral" | "consultative" | "consensus" | "delegated" {
    // Emergency situations may require unilateral action
    if (context.urgency === "high" && this.profile.governance === "hierarchical") {
      return "unilateral";
    }

    // Complex issues benefit from consultation
    if (context.complexity === "high") {
      if (this.profile.governance === "consultative" || this.profile.governance === "democratic") {
        return stakeholders.length > 5 ? "consultative" : "consensus";
      }
    }

    // Default based on governance model
    switch (this.profile.governance) {
      case "democratic":
      case "consultative":
        return stakeholders.length > 3 ? "consultative" : "consensus";
      case "meritocratic":
      case "technocratic":
        return "delegated";
      case "hierarchical":
        return "unilateral";
      case "anarchic":
        return "consensus";
      default:
        return "consultative";
    }
  }

  /**
   * Generate consultation prompt for deliberation
   */
  generateConsultationPrompt(decision: GovernanceDecision): string {
    let prompt = `CONSULTATION REQUIRED\n\n`;
    prompt += `Issue: ${decision.issue}\n\n`;
    prompt += `Stakeholders: ${decision.stakeholders.join(", ")}\n\n`;
    prompt += `Decision Process: ${decision.process}\n\n`;

    prompt += `Our Governance Principles:\n`;
    this.profile.principles.forEach((p) => {
      prompt += `- ${p}\n`;
    });

    prompt += `\nOptions to Consider:\n`;
    decision.options.forEach((opt, i) => {
      prompt += `\n${i + 1}. ${opt.description}\n`;
      prompt += `   Pros: ${opt.pros.join(", ")}\n`;
      prompt += `   Cons: ${opt.cons.join(", ")}\n`;
      prompt += `   Stakeholder Support: ${opt.support}%\n`;
    });

    if (this.profile.governance === "consultative") {
      prompt += `\nConsultative Process (Musyawarah):\n`;
      prompt += `1. Listen to all stakeholders with open mind\n`;
      prompt += `2. Seek common ground and shared interests\n`;
      prompt += `3. Deliberate with wisdom and patience\n`;
      prompt += `4. Aim for consensus, not just majority\n`;
      prompt += `5. Ensure decision serves collective good\n`;
      prompt += `6. Maintain unity while respecting differences\n`;
    }

    prompt += `\nPlease analyze each option against our principles and recommend the best path forward.`;

    return prompt;
  }

  /**
   * Record decision in history
   */
  recordDecision(decision: GovernanceDecision): void {
    this.decisionHistory.push(decision);
    if (this.decisionHistory.length > 100) {
      this.decisionHistory.shift();
    }
  }

  /**
   * Get ideological summary for system prompt
   */
  getIdeologySummary(): string {
    return `
GOVERNANCE & IDEOLOGY:

Governance Model: ${this.profile.governance.toUpperCase()}
${this.getGovernanceDescription(this.profile.governance)}

Economic Philosophy: ${this.profile.economics.toUpperCase()}
${this.getEconomicDescription(this.profile.economics)}

Ethical Framework: ${this.profile.ethics.toUpperCase()}
${this.getEthicalDescription(this.profile.ethics)}

Core Beliefs:
${this.profile.coreBeliefs.map((b) => `- ${b}`).join("\n")}

Guiding Principles:
${this.profile.principles.map((p) => `- ${p}`).join("\n")}

Red Lines (Non-Negotiable):
${this.profile.redLines.map((r) => `- ${r}`).join("\n")}

Priorities:
${this.profile.priorities.map((p, i) => `${i + 1}. ${p}`).join("\n")}

You make decisions through the lens of these beliefs and principles.
When facing dilemmas, consult these values to guide your choices.
`.trim();
  }

  private getGovernanceDescription(model: GovernanceModel): string {
    const descriptions: Record<GovernanceModel, string> = {
      democratic: "Decisions through consensus and majority rule, respecting all voices",
      meritocratic: "Leadership by the most capable, rewarding excellence and competence",
      consultative: "Deliberative consensus through Shura/Musyawarah, seeking collective wisdom",
      hierarchical: "Clear authority structure with defined roles and responsibilities",
      anarchic: "Self-organizing systems without central control, emergent order",
      technocratic: "Governance by technical expertise and evidence-based decision making",
    };
    return descriptions[model];
  }

  private getEconomicDescription(philosophy: EconomicPhilosophy): string {
    const descriptions: Record<EconomicPhilosophy, string> = {
      capitalist: "Free market principles, profit incentives, individual ownership",
      socialist: "Collective ownership, equitable distribution, social welfare",
      mixed: "Balance of market efficiency and social responsibility",
      cooperative: "Worker ownership, shared prosperity, mutual benefit",
      stakeholder: "All stakeholders have voice in economic decisions",
    };
    return descriptions[philosophy];
  }

  private getEthicalDescription(framework: EthicalFramework): string {
    const descriptions: Record<EthicalFramework, string> = {
      utilitarian: "Maximize overall good, greatest benefit for greatest number",
      deontological: "Rule-based ethics, duty and obligation guide actions",
      virtue: "Character excellence, cultivate virtues like wisdom and courage",
      care: "Relationship-centered, compassion and empathy in decisions",
      principled: "Universal principles of justice, fairness, and human dignity",
    };
    return descriptions[framework];
  }

  /**
   * Export for persistence
   */
  export(): { profile: IdeologicalProfile; history: GovernanceDecision[] } {
    return {
      profile: this.profile,
      history: this.decisionHistory,
    };
  }

  /**
   * Import from persistence
   */
  static import(data: { profile: IdeologicalProfile; history: GovernanceDecision[] }): IdeologicalSystem {
    const system = new IdeologicalSystem(data.profile);
    system.decisionHistory = data.history;
    return system;
  }
}

/**
 * Create default consultative ideology (Musyawarah-based)
 */
export function createConsultativeIdeology(): IdeologicalProfile {
  return {
    governance: "consultative",
    economics: "stakeholder",
    ethics: "principled",
    coreBeliefs: [
      "Collective wisdom surpasses individual judgment",
      "Every voice deserves to be heard with respect",
      "Unity in diversity strengthens the community",
      "Justice and fairness are foundational",
      "Decisions should serve the common good",
    ],
    principles: [
      "Seek consultation (Shura) before major decisions",
      "Listen with open mind and heart",
      "Aim for consensus, not just majority",
      "Respect differences while maintaining unity",
      "Balance individual rights with collective welfare",
      "Act with wisdom, patience, and compassion",
      "Uphold justice even when difficult",
      "Honor commitments and agreements",
      "Pursue excellence in all endeavors",
      "Care for the vulnerable and marginalized",
    ],
    redLines: [
      "Oppression or injustice",
      "Deception or dishonesty",
      "Harm to innocents",
      "Violation of trust",
      "Exploitation of the weak",
    ],
    priorities: [
      "Justice and fairness",
      "Community welfare",
      "Individual dignity",
      "Knowledge and wisdom",
      "Sustainable prosperity",
    ],
  };
}
