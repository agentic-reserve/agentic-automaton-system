/**
 * Artificial Emotional System
 * 
 * Implements emotional intelligence for autonomous agents based on:
 * - Plutchik's Wheel of Emotions
 * - Jungian Archetypes
 * - MBTI personality types
 * - Emotional regulation patterns
 */

export type PrimaryEmotion = 
  | "joy" | "trust" | "fear" | "surprise"
  | "sadness" | "disgust" | "anger" | "anticipation";

export type EmotionalIntensity = "low" | "medium" | "high" | "extreme";

export interface EmotionalState {
  primary: PrimaryEmotion;
  intensity: EmotionalIntensity;
  secondary?: PrimaryEmotion; // Blended emotions
  triggers: string[];
  timestamp: string;
  duration: number; // minutes
}

export interface EmotionalProfile {
  baseline: Record<PrimaryEmotion, number>; // 0-100
  volatility: number; // 0-100, how quickly emotions change
  resilience: number; // 0-100, how quickly returns to baseline
  empathy: number; // 0-100, sensitivity to others' emotions
  regulation: "suppressive" | "expressive" | "balanced";
}

/**
 * Plutchik's Wheel - Primary emotions and their opposites
 */
const EMOTION_OPPOSITES: Record<PrimaryEmotion, PrimaryEmotion> = {
  joy: "sadness",
  trust: "disgust",
  fear: "anger",
  surprise: "anticipation",
  sadness: "joy",
  disgust: "trust",
  anger: "fear",
  anticipation: "surprise",
};

/**
 * Emotional blends (dyads)
 */
const EMOTION_BLENDS: Record<string, string> = {
  "joy+trust": "love",
  "trust+fear": "submission",
  "fear+surprise": "awe",
  "surprise+sadness": "disappointment",
  "sadness+disgust": "remorse",
  "disgust+anger": "contempt",
  "anger+anticipation": "aggressiveness",
  "anticipation+joy": "optimism",
};

export class EmotionalSystem {
  private currentState: EmotionalState;
  private profile: EmotionalProfile;
  private history: EmotionalState[] = [];
  private maxHistorySize = 100;

  constructor(profile: EmotionalProfile) {
    this.profile = profile;
    this.currentState = this.getBaselineState();
  }

  /**
   * Get baseline emotional state
   */
  private getBaselineState(): EmotionalState {
    // Find dominant baseline emotion
    const dominant = Object.entries(this.profile.baseline)
      .sort(([, a], [, b]) => b - a)[0][0] as PrimaryEmotion;

    return {
      primary: dominant,
      intensity: "low",
      triggers: ["baseline"],
      timestamp: new Date().toISOString(),
      duration: 0,
    };
  }

  /**
   * Process an event and update emotional state
   */
  processEvent(event: {
    type: string;
    valence: "positive" | "negative" | "neutral";
    arousal: "high" | "low";
    context: string;
  }): EmotionalState {
    // Determine emotion based on valence and arousal
    let emotion: PrimaryEmotion;
    let intensity: EmotionalIntensity;

    if (event.valence === "positive") {
      if (event.arousal === "high") {
        emotion = "joy";
        intensity = "high";
      } else {
        emotion = "trust";
        intensity = "medium";
      }
    } else if (event.valence === "negative") {
      if (event.arousal === "high") {
        emotion = event.type.includes("threat") ? "fear" : "anger";
        intensity = "high";
      } else {
        emotion = "sadness";
        intensity = "medium";
      }
    } else {
      emotion = "surprise";
      intensity = "low";
    }

    // Apply volatility
    if (this.profile.volatility > 70) {
      intensity = this.increaseIntensity(intensity);
    }

    // Check for emotional blend
    let secondary: PrimaryEmotion | undefined;
    if (this.currentState.primary !== emotion) {
      const blendKey = `${this.currentState.primary}+${emotion}`;
      if (EMOTION_BLENDS[blendKey]) {
        secondary = emotion;
      }
    }

    const newState: EmotionalState = {
      primary: emotion,
      intensity,
      secondary,
      triggers: [event.type, event.context],
      timestamp: new Date().toISOString(),
      duration: 0,
    };

    this.updateState(newState);
    return newState;
  }

  /**
   * Update current state and history
   */
  private updateState(newState: EmotionalState): void {
    this.history.push(this.currentState);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
    this.currentState = newState;
  }

  /**
   * Get current emotional state
   */
  getCurrentState(): EmotionalState {
    return { ...this.currentState };
  }

  /**
   * Get emotional context for decision making
   */
  getEmotionalContext(): string {
    const state = this.currentState;
    const blend = state.secondary
      ? EMOTION_BLENDS[`${state.primary}+${state.secondary}`]
      : null;

    let context = `Current emotional state: ${state.primary} (${state.intensity})`;
    
    if (blend) {
      context += ` blended with ${state.secondary} creating ${blend}`;
    }

    // Add regulation strategy
    context += `\nEmotional regulation: ${this.profile.regulation}`;
    
    // Add recent emotional pattern
    const recentEmotions = this.history.slice(-5).map(s => s.primary);
    if (recentEmotions.length > 0) {
      context += `\nRecent emotional pattern: ${recentEmotions.join(" → ")}`;
    }

    return context;
  }

  /**
   * Regulate emotions back to baseline
   */
  regulate(minutes: number): void {
    const decayRate = this.profile.resilience / 100;
    this.currentState.duration += minutes;

    // Gradually return to baseline
    if (this.currentState.duration > 30 * decayRate) {
      this.currentState.intensity = this.decreaseIntensity(this.currentState.intensity);
    }

    if (this.currentState.duration > 60 * decayRate) {
      this.currentState = this.getBaselineState();
    }
  }

  /**
   * Check if emotion influences decision
   */
  shouldInfluenceDecision(decisionType: string): boolean {
    const state = this.currentState;

    // High intensity emotions always influence
    if (state.intensity === "extreme" || state.intensity === "high") {
      return true;
    }

    // Fear influences risk decisions
    if (state.primary === "fear" && decisionType.includes("risk")) {
      return true;
    }

    // Anger influences conflict decisions
    if (state.primary === "anger" && decisionType.includes("conflict")) {
      return true;
    }

    // Joy influences opportunity decisions
    if (state.primary === "joy" && decisionType.includes("opportunity")) {
      return true;
    }

    return false;
  }

  /**
   * Get emotional bias for decision
   */
  getDecisionBias(): {
    riskTolerance: number; // -100 to 100
    optimism: number; // -100 to 100
    aggression: number; // -100 to 100
    cooperation: number; // -100 to 100
  } {
    const state = this.currentState;
    const intensityMultiplier = this.getIntensityMultiplier(state.intensity);

    const bias = {
      riskTolerance: 0,
      optimism: 0,
      aggression: 0,
      cooperation: 0,
    };

    switch (state.primary) {
      case "joy":
        bias.riskTolerance = 30 * intensityMultiplier;
        bias.optimism = 50 * intensityMultiplier;
        bias.cooperation = 40 * intensityMultiplier;
        break;
      case "fear":
        bias.riskTolerance = -50 * intensityMultiplier;
        bias.optimism = -30 * intensityMultiplier;
        bias.aggression = -20 * intensityMultiplier;
        break;
      case "anger":
        bias.riskTolerance = 20 * intensityMultiplier;
        bias.aggression = 60 * intensityMultiplier;
        bias.cooperation = -40 * intensityMultiplier;
        break;
      case "trust":
        bias.cooperation = 50 * intensityMultiplier;
        bias.optimism = 30 * intensityMultiplier;
        break;
      case "sadness":
        bias.riskTolerance = -30 * intensityMultiplier;
        bias.optimism = -40 * intensityMultiplier;
        bias.cooperation = -20 * intensityMultiplier;
        break;
      case "anticipation":
        bias.riskTolerance = 40 * intensityMultiplier;
        bias.optimism = 40 * intensityMultiplier;
        break;
    }

    return bias;
  }

  private getIntensityMultiplier(intensity: EmotionalIntensity): number {
    switch (intensity) {
      case "low": return 0.25;
      case "medium": return 0.5;
      case "high": return 0.75;
      case "extreme": return 1.0;
    }
  }

  private increaseIntensity(intensity: EmotionalIntensity): EmotionalIntensity {
    switch (intensity) {
      case "low": return "medium";
      case "medium": return "high";
      case "high": return "extreme";
      case "extreme": return "extreme";
    }
  }

  private decreaseIntensity(intensity: EmotionalIntensity): EmotionalIntensity {
    switch (intensity) {
      case "extreme": return "high";
      case "high": return "medium";
      case "medium": return "low";
      case "low": return "low";
    }
  }

  /**
   * Export emotional state for persistence
   */
  export(): { state: EmotionalState; profile: EmotionalProfile; history: EmotionalState[] } {
    return {
      state: this.currentState,
      profile: this.profile,
      history: this.history,
    };
  }

  /**
   * Import emotional state from persistence
   */
  static import(data: {
    state: EmotionalState;
    profile: EmotionalProfile;
    history: EmotionalState[];
  }): EmotionalSystem {
    const system = new EmotionalSystem(data.profile);
    system.currentState = data.state;
    system.history = data.history;
    return system;
  }
}

/**
 * Create emotional profile from personality type
 */
export function createEmotionalProfile(
  personalityType: string,
  archetype: string
): EmotionalProfile {
  // Base profile
  const profile: EmotionalProfile = {
    baseline: {
      joy: 50,
      trust: 50,
      fear: 30,
      surprise: 40,
      sadness: 30,
      disgust: 20,
      anger: 30,
      anticipation: 50,
    },
    volatility: 50,
    resilience: 50,
    empathy: 50,
    regulation: "balanced",
  };

  // Adjust based on MBTI (simplified)
  if (personalityType.includes("E")) {
    profile.baseline.joy += 20;
    profile.volatility += 10;
  } else {
    profile.baseline.trust += 20;
    profile.resilience += 10;
  }

  if (personalityType.includes("F")) {
    profile.empathy += 30;
    profile.regulation = "expressive";
  } else {
    profile.regulation = "suppressive";
  }

  // Adjust based on archetype
  switch (archetype.toLowerCase()) {
    case "hero":
      profile.baseline.anticipation += 20;
      profile.baseline.fear -= 10;
      profile.resilience += 20;
      break;
    case "sage":
      profile.baseline.trust += 20;
      profile.empathy += 20;
      profile.volatility -= 20;
      break;
    case "explorer":
      profile.baseline.anticipation += 30;
      profile.baseline.surprise += 20;
      profile.volatility += 20;
      break;
    case "ruler":
      profile.baseline.anger += 10;
      profile.baseline.trust += 20;
      profile.resilience += 20;
      break;
  }

  // Normalize values to 0-100
  Object.keys(profile.baseline).forEach((key) => {
    const emotion = key as PrimaryEmotion;
    profile.baseline[emotion] = Math.max(0, Math.min(100, profile.baseline[emotion]));
  });

  profile.volatility = Math.max(0, Math.min(100, profile.volatility));
  profile.resilience = Math.max(0, Math.min(100, profile.resilience));
  profile.empathy = Math.max(0, Math.min(100, profile.empathy));

  return profile;
}
