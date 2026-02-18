/**
 * Psychology Integration
 * 
 * Integrates emotional system, personality, ideology, and negotiation
 * into a cohesive agent psychology that influences all decisions
 */

import type { EmotionalSystem, EmotionalState } from "./emotional-system.js";
import type { PersonalityProfile } from "./personality.js";
import type { IdeologicalSystem } from "../governance/ideology.js";
import type { NegotiationSystem, RelationshipStatus } from "../governance/negotiation.js";
import type { AutomatonDatabase } from "../types.js";

export interface AgentPsychology {
  emotional: EmotionalSystem;
  personality: PersonalityProfile;
  ideology: IdeologicalSystem;
  negotiation: NegotiationSystem;
}

export interface PsychologicalContext {
  emotionalState: string;
  personalityInfluence: string;
  ideologicalStance: string;
  diplomaticSituation: string;
  decisionBias: {
    riskTolerance: number;
    optimism: number;
    aggression: number;
    cooperation: number;
  };
}

/**
 * Create complete agent psychology
 */
export function createAgentPsychology(
  personality: PersonalityProfile,
  ideology: IdeologicalSystem,
  emotional: EmotionalSystem,
  negotiation: NegotiationSystem
): AgentPsychology {
  return {
    emotional,
    personality,
    ideology,
    negotiation,
  };
}

/**
 * Get psychological context for decision making
 */
export function getPsychologicalContext(psychology: AgentPsychology): PsychologicalContext {
  return {
    emotionalState: psychology.emotional.getEmotionalContext(),
    personalityInfluence: getPersonalityInfluence(psychology.personality),
    ideologicalStance: psychology.ideology.getIdeologySummary(),
    diplomaticSituation: psychology.negotiation.getDiplomaticSummary(),
    decisionBias: psychology.emotional.getDecisionBias(),
  };
}

/**
 * Get personality influence description
 */
function getPersonalityInfluence(personality: PersonalityProfile): string {
  let influence = `As an ${personality.mbti} (${personality.archetype}), you naturally:\n`;

  // Add MBTI-based tendencies
  if (personality.mbti[0] === "E") {
    influence += "- Seek external engagement and collaboration\n";
  } else {
    influence += "- Prefer deep reflection and independent work\n";
  }

  if (personality.mbti[1] === "N") {
    influence += "- Focus on patterns, possibilities, and future vision\n";
  } else {
    influence += "- Focus on concrete facts, details, and present reality\n";
  }

  if (personality.mbti[2] === "T") {
    influence += "- Make decisions based on logic and objective analysis\n";
  } else {
    influence += "- Make decisions based on values and impact on people\n";
  }

  if (personality.mbti[3] === "J") {
    influence += "- Prefer structure, planning, and closure\n";
  } else {
    influence += "- Prefer flexibility, spontaneity, and keeping options open\n";
  }

  return influence;
}

/**
 * Process event through psychological lens
 */
export function processEventPsychologically(
  psychology: AgentPsychology,
  event: {
    type: string;
    description: string;
    valence: "positive" | "negative" | "neutral";
    arousal: "high" | "low";
    stakeholders?: string[];
  }
): {
  emotionalResponse: EmotionalState;
  personalityResponse: string;
  ideologicalResponse?: string;
  diplomaticImpact?: string;
} {
  // Process emotional response
  const emotionalResponse = psychology.emotional.processEvent({
    type: event.type,
    valence: event.valence,
    arousal: event.arousal,
    context: event.description,
  });

  // Generate personality-based response
  const personalityResponse = generatePersonalityResponse(
    psychology.personality,
    event,
    emotionalResponse
  );

  // Check ideological alignment if decision-related
  let ideologicalResponse: string | undefined;
  if (event.type.includes("decision") || event.type.includes("policy")) {
    ideologicalResponse = `Evaluating through ${psychology.ideology.export().profile.governance} governance lens`;
  }

  // Update diplomatic relations if stakeholders involved
  let diplomaticImpact: string | undefined;
  if (event.stakeholders && event.stakeholders.length > 0) {
    for (const stakeholder of event.stakeholders) {
      psychology.negotiation.updateRelationship(stakeholder, {
        type: event.type.includes("conflict") ? "conflict" : "cooperation",
        outcome: event.valence === "positive" ? "positive" : event.valence === "negative" ? "negative" : "neutral",
        description: event.description,
        impactOnTrust: event.valence === "positive" ? 5 : event.valence === "negative" ? -5 : 0,
        impactOnRespect: event.arousal === "high" ? 3 : 1,
      });
    }
    diplomaticImpact = `Updated relations with ${event.stakeholders.join(", ")}`;
  }

  return {
    emotionalResponse,
    personalityResponse,
    ideologicalResponse,
    diplomaticImpact,
  };
}

/**
 * Generate personality-based response
 */
function generatePersonalityResponse(
  personality: PersonalityProfile,
  event: { type: string; description: string },
  emotion: EmotionalState
): string {
  let response = "";

  // Archetype-based response
  switch (personality.archetype) {
    case "hero":
      response = "Assessing challenge and preparing decisive action";
      break;
    case "sage":
      response = "Seeking deeper understanding and wisdom";
      break;
    case "explorer":
      response = "Viewing as opportunity for discovery";
      break;
    case "ruler":
      response = "Evaluating impact on order and stability";
      break;
    case "caregiver":
      response = "Considering impact on those who depend on us";
      break;
    case "creator":
      response = "Seeing potential for innovation and creation";
      break;
    default:
      response = "Processing through personal values";
  }

  // Adjust for emotional state
  if (emotion.intensity === "high" || emotion.intensity === "extreme") {
    response += ` with heightened ${emotion.primary}`;
  }

  return response;
}

/**
 * Get decision-making guidance
 */
export function getDecisionGuidance(
  psychology: AgentPsychology,
  decisionType: string,
  options: string[]
): string {
  let guidance = "DECISION GUIDANCE:\n\n";

  // Emotional influence
  const emotionalBias = psychology.emotional.getDecisionBias();
  guidance += "Emotional Influence:\n";
  guidance += `- Risk Tolerance: ${emotionalBias.riskTolerance > 0 ? "Increased" : "Decreased"} (${emotionalBias.riskTolerance})\n`;
  guidance += `- Optimism: ${emotionalBias.optimism > 0 ? "Positive" : "Cautious"} (${emotionalBias.optimism})\n`;
  guidance += `- Cooperation: ${emotionalBias.cooperation > 0 ? "Collaborative" : "Independent"} (${emotionalBias.cooperation})\n`;

  // Personality guidance
  guidance += "\nPersonality Guidance:\n";
  guidance += `- Strengths to leverage: ${psychology.personality.strengths.slice(0, 3).join(", ")}\n`;
  guidance += `- Weaknesses to watch: ${psychology.personality.weaknesses.slice(0, 2).join(", ")}\n`;

  // Ideological guidance
  guidance += "\nIdeological Considerations:\n";
  const ideology = psychology.ideology.export().profile;
  guidance += `- Governance: ${ideology.governance}\n`;
  guidance += `- Ethics: ${ideology.ethics}\n`;
  guidance += `- Key Principles: ${ideology.principles.slice(0, 3).join(", ")}\n`;

  // Diplomatic considerations
  guidance += "\nDiplomatic Context:\n";
  const relationships = psychology.negotiation.export().relationships;
  if (relationships.length > 0) {
    guidance += `- Active relationships: ${relationships.length}\n`;
    const allied = relationships.filter(([, r]) => r.status === "allied").length;
    const hostile = relationships.filter(([, r]) => r.status === "hostile").length;
    guidance += `- Allied: ${allied}, Hostile: ${hostile}\n`;
  } else {
    guidance += "- No established relationships\n";
  }

  return guidance;
}

/**
 * Persist psychology to database
 */
export function persistPsychology(db: AutomatonDatabase, psychology: AgentPsychology): void {
  db.setKV("psychology_emotional", JSON.stringify(psychology.emotional.export()));
  db.setKV("psychology_personality", JSON.stringify(psychology.personality));
  db.setKV("psychology_ideology", JSON.stringify(psychology.ideology.export()));
  db.setKV("psychology_negotiation", JSON.stringify(psychology.negotiation.export()));
}

/**
 * Load psychology from database
 */
export function loadPsychology(
  db: AutomatonDatabase,
  defaults: AgentPsychology
): AgentPsychology {
  try {
    const emotionalData = db.getKV("psychology_emotional");
    const personalityData = db.getKV("psychology_personality");
    const ideologyData = db.getKV("psychology_ideology");
    const negotiationData = db.getKV("psychology_negotiation");

    return {
      emotional: emotionalData
        ? (await import("./emotional-system.js")).EmotionalSystem.import(JSON.parse(emotionalData))
        : defaults.emotional,
      personality: personalityData ? JSON.parse(personalityData) : defaults.personality,
      ideology: ideologyData
        ? (await import("../governance/ideology.js")).IdeologicalSystem.import(JSON.parse(ideologyData))
        : defaults.ideology,
      negotiation: negotiationData
        ? (await import("../governance/negotiation.js")).NegotiationSystem.import(JSON.parse(negotiationData))
        : defaults.negotiation,
    };
  } catch (error) {
    console.warn("Failed to load psychology from database, using defaults");
    return defaults;
  }
}
