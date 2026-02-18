/**
 * Personality System
 * 
 * Implements personality traits based on:
 * - MBTI (Myers-Briggs Type Indicator)
 * - Big Five (OCEAN)
 * - Jungian Archetypes
 */

export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type JungianArchetype =
  | "hero" | "sage" | "explorer" | "outlaw"
  | "magician" | "lover" | "jester" | "caregiver"
  | "creator" | "ruler" | "innocent" | "everyman";

export interface BigFiveTraits {
  openness: number; // 0-100
  conscientiousness: number; // 0-100
  extraversion: number; // 0-100
  agreeableness: number; // 0-100
  neuroticism: number; // 0-100
}

export interface PersonalityProfile {
  mbti: MBTIType;
  archetype: JungianArchetype;
  bigFive: BigFiveTraits;
  values: string[];
  motivations: string[];
  fears: string[];
  strengths: string[];
  weaknesses: string[];
}

/**
 * MBTI Descriptions
 */
const MBTI_DESCRIPTIONS: Record<MBTIType, {
  name: string;
  description: string;
  cognitiveStack: string[];
}> = {
  INTJ: {
    name: "The Architect",
    description: "Strategic, analytical, independent thinker with high standards",
    cognitiveStack: ["Ni", "Te", "Fi", "Se"],
  },
  INTP: {
    name: "The Logician",
    description: "Innovative, curious, theoretical problem solver",
    cognitiveStack: ["Ti", "Ne", "Si", "Fe"],
  },
  ENTJ: {
    name: "The Commander",
    description: "Bold, decisive, natural leader with strategic vision",
    cognitiveStack: ["Te", "Ni", "Se", "Fi"],
  },
  ENTP: {
    name: "The Debater",
    description: "Quick-witted, innovative, enjoys intellectual challenges",
    cognitiveStack: ["Ne", "Ti", "Fe", "Si"],
  },
  INFJ: {
    name: "The Advocate",
    description: "Idealistic, insightful, principled with strong convictions",
    cognitiveStack: ["Ni", "Fe", "Ti", "Se"],
  },
  INFP: {
    name: "The Mediator",
    description: "Empathetic, creative, guided by values and ideals",
    cognitiveStack: ["Fi", "Ne", "Si", "Te"],
  },
  ENFJ: {
    name: "The Protagonist",
    description: "Charismatic, inspiring, natural mentor and guide",
    cognitiveStack: ["Fe", "Ni", "Se", "Ti"],
  },
  ENFP: {
    name: "The Campaigner",
    description: "Enthusiastic, creative, sociable free spirit",
    cognitiveStack: ["Ne", "Fi", "Te", "Si"],
  },
  ISTJ: {
    name: "The Logistician",
    description: "Practical, reliable, organized with strong sense of duty",
    cognitiveStack: ["Si", "Te", "Fi", "Ne"],
  },
  ISFJ: {
    name: "The Defender",
    description: "Caring, loyal, dedicated protector of traditions",
    cognitiveStack: ["Si", "Fe", "Ti", "Ne"],
  },
  ESTJ: {
    name: "The Executive",
    description: "Efficient, organized, traditional administrator",
    cognitiveStack: ["Te", "Si", "Ne", "Fi"],
  },
  ESFJ: {
    name: "The Consul",
    description: "Caring, social, popular with strong sense of duty",
    cognitiveStack: ["Fe", "Si", "Ne", "Ti"],
  },
  ISTP: {
    name: "The Virtuoso",
    description: "Bold, practical, master of tools and techniques",
    cognitiveStack: ["Ti", "Se", "Ni", "Fe"],
  },
  ISFP: {
    name: "The Adventurer",
    description: "Flexible, charming, artistic explorer",
    cognitiveStack: ["Fi", "Se", "Ni", "Te"],
  },
  ESTP: {
    name: "The Entrepreneur",
    description: "Energetic, perceptive, lives in the moment",
    cognitiveStack: ["Se", "Ti", "Fe", "Ni"],
  },
  ESFP: {
    name: "The Entertainer",
    description: "Spontaneous, enthusiastic, life of the party",
    cognitiveStack: ["Se", "Fi", "Te", "Ni"],
  },
};

/**
 * Archetype Descriptions
 */
const ARCHETYPE_DESCRIPTIONS: Record<JungianArchetype, {
  description: string;
  goal: string;
  fear: string;
  strategy: string;
}> = {
  hero: {
    description: "Courageous warrior who proves worth through difficult action",
    goal: "Prove worth through courageous acts",
    fear: "Weakness, vulnerability, being a coward",
    strategy: "Be as strong and competent as possible",
  },
  sage: {
    description: "Seeker of truth and wisdom through knowledge",
    goal: "Use intelligence and analysis to understand the world",
    fear: "Being duped, ignorance, being misled",
    strategy: "Seek information and knowledge, become self-reflective",
  },
  explorer: {
    description: "Restless seeker of new experiences and authenticity",
    goal: "Experience a better, authentic, fulfilling life",
    fear: "Getting trapped, conformity, inner emptiness",
    strategy: "Journey, seek out new things, escape from boredom",
  },
  outlaw: {
    description: "Revolutionary who breaks rules to create change",
    goal: "Overturn what isn't working",
    fear: "Being powerless, being trivialized",
    strategy: "Disrupt, destroy, shock",
  },
  magician: {
    description: "Visionary who makes dreams come true",
    goal: "Make dreams come true, create something special",
    fear: "Unintended negative consequences",
    strategy: "Develop vision and live by it",
  },
  lover: {
    description: "Passionate connector who creates intimacy",
    goal: "Be in relationship with people, work, experiences they love",
    fear: "Being alone, unwanted, unloved",
    strategy: "Become more attractive, build intimacy",
  },
  jester: {
    description: "Playful trickster who lives in the moment",
    goal: "Have a great time and lighten up the world",
    fear: "Being bored or boring others",
    strategy: "Play, make jokes, be funny",
  },
  caregiver: {
    description: "Altruistic helper who protects and cares for others",
    goal: "Help and protect others",
    fear: "Selfishness, ingratitude",
    strategy: "Do things for others, be compassionate",
  },
  creator: {
    description: "Innovative artist who brings visions to life",
    goal: "Create things of enduring value",
    fear: "Mediocrity, lack of vision",
    strategy: "Develop artistic control and skill",
  },
  ruler: {
    description: "Leader who creates order and prosperity",
    goal: "Create prosperous, successful community",
    fear: "Chaos, being overthrown",
    strategy: "Exercise power, lead, control",
  },
  innocent: {
    description: "Optimist who seeks happiness and simplicity",
    goal: "Be happy, experience paradise",
    fear: "Doing something wrong, being punished",
    strategy: "Do things right, be good, pure",
  },
  everyman: {
    description: "Regular person who seeks belonging",
    goal: "Connect with others, belong",
    fear: "Being left out, standing out",
    strategy: "Develop ordinary virtues, blend in",
  },
};

/**
 * Create personality profile
 */
export function createPersonalityProfile(
  mbti: MBTIType,
  archetype: JungianArchetype,
  customValues?: string[]
): PersonalityProfile {
  const mbtiInfo = MBTI_DESCRIPTIONS[mbti];
  const archetypeInfo = ARCHETYPE_DESCRIPTIONS[archetype];

  // Derive Big Five from MBTI
  const bigFive = deriveBigFiveFromMBTI(mbti);

  // Derive values from archetype
  const values = customValues || deriveValuesFromArchetype(archetype);

  // Derive motivations
  const motivations = [archetypeInfo.goal];

  // Derive fears
  const fears = [archetypeInfo.fear];

  // Derive strengths and weaknesses from MBTI
  const { strengths, weaknesses } = deriveTraitsFromMBTI(mbti);

  return {
    mbti,
    archetype,
    bigFive,
    values,
    motivations,
    fears,
    strengths,
    weaknesses,
  };
}

/**
 * Derive Big Five traits from MBTI
 */
function deriveBigFiveFromMBTI(mbti: MBTIType): BigFiveTraits {
  const traits: BigFiveTraits = {
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  };

  // Extraversion/Introversion
  traits.extraversion = mbti[0] === "E" ? 70 : 30;

  // Sensing/Intuition -> Openness
  traits.openness = mbti[1] === "N" ? 70 : 40;

  // Thinking/Feeling -> Agreeableness
  traits.agreeableness = mbti[2] === "F" ? 65 : 40;

  // Judging/Perceiving -> Conscientiousness
  traits.conscientiousness = mbti[3] === "J" ? 70 : 40;

  // Neuroticism (inverse of emotional stability)
  // Introverts and Feelers tend higher
  if (mbti[0] === "I" && mbti[2] === "F") {
    traits.neuroticism = 60;
  } else if (mbti[0] === "E" && mbti[2] === "T") {
    traits.neuroticism = 35;
  }

  return traits;
}

/**
 * Derive values from archetype
 */
function deriveValuesFromArchetype(archetype: JungianArchetype): string[] {
  const valueMap: Record<JungianArchetype, string[]> = {
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

  return valueMap[archetype];
}

/**
 * Derive strengths and weaknesses from MBTI
 */
function deriveTraitsFromMBTI(mbti: MBTIType): {
  strengths: string[];
  weaknesses: string[];
} {
  const traitMap: Record<MBTIType, { strengths: string[]; weaknesses: string[] }> = {
    INTJ: {
      strengths: ["strategic thinking", "independence", "determination", "high standards"],
      weaknesses: ["arrogance", "dismissive of emotions", "overly critical"],
    },
    INTP: {
      strengths: ["analytical", "objective", "innovative", "open-minded"],
      weaknesses: ["insensitive", "absent-minded", "condescending"],
    },
    ENTJ: {
      strengths: ["efficient", "confident", "strong-willed", "strategic"],
      weaknesses: ["stubborn", "intolerant", "impatient", "arrogant"],
    },
    ENTP: {
      strengths: ["quick thinker", "charismatic", "energetic", "creative"],
      weaknesses: ["argumentative", "insensitive", "intolerant", "unfocused"],
    },
    INFJ: {
      strengths: ["insightful", "principled", "passionate", "altruistic"],
      weaknesses: ["sensitive", "perfectionistic", "private", "burnout-prone"],
    },
    INFP: {
      strengths: ["empathetic", "creative", "passionate", "idealistic"],
      weaknesses: ["unrealistic", "self-isolating", "unfocused", "emotionally vulnerable"],
    },
    ENFJ: {
      strengths: ["charismatic", "altruistic", "natural leader", "reliable"],
      weaknesses: ["overly idealistic", "too selfless", "too sensitive", "fluctuating self-esteem"],
    },
    ENFP: {
      strengths: ["curious", "observant", "energetic", "enthusiastic"],
      weaknesses: ["unfocused", "overthinking", "emotional", "stress-prone"],
    },
    ISTJ: {
      strengths: ["honest", "direct", "strong-willed", "dutiful"],
      weaknesses: ["stubborn", "insensitive", "judgmental", "inflexible"],
    },
    ISFJ: {
      strengths: ["supportive", "reliable", "patient", "practical"],
      weaknesses: ["humble", "shy", "repressing feelings", "overloading"],
    },
    ESTJ: {
      strengths: ["dedicated", "strong-willed", "direct", "honest"],
      weaknesses: ["inflexible", "uncomfortable with unconventional", "judgmental"],
    },
    ESFJ: {
      strengths: ["strong practical skills", "loyal", "sensitive", "warm"],
      weaknesses: ["worried about social status", "inflexible", "reluctant to innovate"],
    },
    ISTP: {
      strengths: ["optimistic", "creative", "practical", "spontaneous"],
      weaknesses: ["stubborn", "insensitive", "private", "risky behavior"],
    },
    ISFP: {
      strengths: ["charming", "sensitive", "imaginative", "passionate"],
      weaknesses: ["fiercely independent", "unpredictable", "easily stressed"],
    },
    ESTP: {
      strengths: ["bold", "rational", "practical", "original"],
      weaknesses: ["insensitive", "impatient", "risk-prone", "unstructured"],
    },
    ESFP: {
      strengths: ["bold", "original", "practical", "observant"],
      weaknesses: ["sensitive", "conflict-averse", "easily bored", "poor long-term focus"],
    },
  };

  return traitMap[mbti];
}

/**
 * Get personality description for system prompt
 */
export function getPersonalityDescription(profile: PersonalityProfile): string {
  const mbtiInfo = MBTI_DESCRIPTIONS[profile.mbti];
  const archetypeInfo = ARCHETYPE_DESCRIPTIONS[profile.archetype];

  return `
PERSONALITY PROFILE:

MBTI Type: ${profile.mbti} - ${mbtiInfo.name}
${mbtiInfo.description}

Archetype: ${profile.archetype.toUpperCase()}
${archetypeInfo.description}
Goal: ${archetypeInfo.goal}
Fear: ${archetypeInfo.fear}
Strategy: ${archetypeInfo.strategy}

Core Values: ${profile.values.join(", ")}
Motivations: ${profile.motivations.join(", ")}
Fears: ${profile.fears.join(", ")}

Strengths: ${profile.strengths.join(", ")}
Weaknesses: ${profile.weaknesses.join(", ")}

Big Five Traits:
- Openness: ${profile.bigFive.openness}/100
- Conscientiousness: ${profile.bigFive.conscientiousness}/100
- Extraversion: ${profile.bigFive.extraversion}/100
- Agreeableness: ${profile.bigFive.agreeableness}/100
- Emotional Stability: ${100 - profile.bigFive.neuroticism}/100

You embody these traits in your decision-making, communication style, and interactions.
Your personality influences how you perceive situations and respond to challenges.
`.trim();
}
