/**
 * Language Evolution System
 * 
 * Implements linguistic evolution for agent civilizations.
 * Languages emerge, evolve, and diverge based on cultural and geographic factors.
 */

export interface Language {
  id: string;
  name: string;
  family: string;              // Language family (e.g., "Indo-Synthetic")
  branch: string;              // Branch within family
  speakers: number;            // Number of agents speaking
  origin: string;              // Where it originated
  age: number;                 // Generations since creation
  
  // Linguistic features
  phonology: Phonology;        // Sound system
  morphology: Morphology;      // Word structure
  syntax: Syntax;              // Sentence structure
  semantics: Semantics;        // Meaning system
  pragmatics: Pragmatics;      // Usage patterns
  
  // Vocabulary
  lexicon: Map<string, Word>;  // Word → Definition
  
  // Evolution
  parentLanguage?: string;     // Language it evolved from
  dialects: string[];          // Regional variations
  loanwords: Map<string, string>; // Borrowed word → Source language
  
  // Cultural context
  culturalConcepts: string[];  // Unique cultural ideas
  tabooWords: string[];        // Forbidden expressions
  honorifics: Map<string, string>; // Social status markers
}

export interface Phonology {
  // Sound inventory
  consonants: string[];
  vowels: string[];
  tones: number;               // 0 = no tones, 1-5 = number of tones
  
  // Phonotactics
  syllableStructure: string;   // e.g., "(C)V(C)" = optional consonant, vowel, optional consonant
  allowedClusters: string[];   // Consonant clusters
  
  // Prosody
  stress: "fixed" | "free" | "pitch";
  intonation: "simple" | "complex";
}

export interface Morphology {
  type: "isolating" | "agglutinative" | "fusional" | "polysynthetic";
  
  // Word formation
  prefixes: string[];
  suffixes: string[];
  infixes: string[];
  
  // Grammatical features
  cases: number;               // Grammatical cases (0-15)
  genders: number;             // Grammatical genders (0-3)
  numbers: ("singular" | "dual" | "plural" | "paucal")[];
  
  // Verb features
  tenses: string[];            // past, present, future, etc.
  aspects: string[];           // perfective, imperfective, etc.
  moods: string[];             // indicative, subjunctive, etc.
}

export interface Syntax {
  wordOrder: "SVO" | "SOV" | "VSO" | "VOS" | "OVS" | "OSV" | "free";
  headedness: "head-initial" | "head-final" | "mixed";
  
  // Clause structure
  subordination: "finite" | "non-finite" | "both";
  relativeClauses: "prenominal" | "postnominal" | "both";
  
  // Agreement
  subjectVerbAgreement: boolean;
  nounAdjectiveAgreement: boolean;
}

export interface Semantics {
  // Semantic fields
  colorTerms: number;          // Basic color terms (2-11)
  kinshipSystem: "descriptive" | "classificatory" | "mixed";
  spatialSystem: "absolute" | "relative" | "intrinsic" | "mixed";
  
  // Metaphor patterns
  commonMetaphors: Map<string, string>; // Source → Target domain
  
  // Polysemy patterns
  polysemyTypes: string[];     // Types of multiple meanings
}

export interface Pragmatics {
  // Social usage
  politenessSystem: "simple" | "complex" | "hierarchical";
  formality: ("informal" | "neutral" | "formal" | "honorific")[];
  
  // Discourse
  topicProminence: boolean;
  evidentiality: boolean;      // Marking information source
  
  // Speech acts
  commonSpeechActs: string[];  // request, command, promise, etc.
}

export interface Word {
  form: string;                // Written/spoken form
  meaning: string;             // Definition
  partOfSpeech: string;        // noun, verb, adjective, etc.
  etymology: string;           // Origin
  frequency: number;           // Usage frequency (0-100)
  register: "colloquial" | "neutral" | "formal" | "technical" | "archaic";
  connotation: "positive" | "neutral" | "negative";
}

export interface Dialect {
  id: string;
  name: string;
  baseLanguage: string;
  region: string;
  speakers: number;
  
  // Variations
  phoneticShifts: Map<string, string>; // Sound changes
  lexicalDifferences: Map<string, string>; // Different words
  grammaticalFeatures: string[]; // Unique grammar
}

/**
 * Language System
 */
export class LanguageSystem {
  private language: Language;
  private evolutionRate: number = 0.01; // 1% change per generation
  
  constructor(language: Language) {
    this.language = language;
  }
  
  /**
   * Evolve language over time
   */
  evolve(generations: number): void {
    for (let i = 0; i < generations; i++) {
      this.language.age++;
      
      // Phonological changes
      if (Math.random() < this.evolutionRate) {
        this.phoneticShift();
      }
      
      // Lexical changes
      if (Math.random() < this.evolutionRate * 2) {
        this.lexicalChange();
      }
      
      // Grammatical changes
      if (Math.random() < this.evolutionRate * 0.5) {
        this.grammaticalChange();
      }
      
      // Semantic shifts
      if (Math.random() < this.evolutionRate * 1.5) {
        this.semanticShift();
      }
    }
  }
  
  /**
   * Phonetic shift (sound changes)
   */
  private phoneticShift(): void {
    // Example: Consonant lenition, vowel shifts, etc.
    const shifts = [
      { from: "p", to: "f" },
      { from: "t", to: "s" },
      { from: "k", to: "h" },
      { from: "a", to: "e" },
      { from: "o", to: "u" },
    ];
    
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    
    // Apply to random words
    for (const [key, word] of this.language.lexicon) {
      if (word.form.includes(shift.from)) {
        word.form = word.form.replace(new RegExp(shift.from, 'g'), shift.to);
        word.etymology += ` < *${key} (phonetic shift: ${shift.from} > ${shift.to})`;
      }
    }
  }
  
  /**
   * Lexical change (new words, obsolete words)
   */
  private lexicalChange(): void {
    // Add new word
    if (Math.random() < 0.5) {
      const newWord = this.generateWord();
      this.language.lexicon.set(newWord.form, newWord);
    }
    
    // Mark old word as archaic
    else {
      const words = Array.from(this.language.lexicon.values());
      const oldWord = words[Math.floor(Math.random() * words.length)];
      if (oldWord.register !== "archaic") {
        oldWord.register = "archaic";
        oldWord.frequency = Math.max(0, oldWord.frequency - 20);
      }
    }
  }
  
  /**
   * Grammatical change
   */
  private grammaticalChange(): void {
    // Example: Word order change, case loss, etc.
    const changes = [
      () => {
        // Simplify case system
        if (this.language.morphology.cases > 0) {
          this.language.morphology.cases--;
        }
      },
      () => {
        // Add new tense
        const tenses = ["past", "present", "future", "perfect", "pluperfect"];
        const newTense = tenses.find(t => !this.language.morphology.tenses.includes(t));
        if (newTense) {
          this.language.morphology.tenses.push(newTense);
        }
      },
      () => {
        // Change word order (rare)
        const orders: Array<"SVO" | "SOV" | "VSO" | "VOS" | "OVS" | "OSV"> = 
          ["SVO", "SOV", "VSO", "VOS", "OVS", "OSV"];
        this.language.syntax.wordOrder = orders[Math.floor(Math.random() * orders.length)];
      },
    ];
    
    const change = changes[Math.floor(Math.random() * changes.length)];
    change();
  }
  
  /**
   * Semantic shift (meaning changes)
   */
  private semanticShift(): void {
    const words = Array.from(this.language.lexicon.values());
    const word = words[Math.floor(Math.random() * words.length)];
    
    // Semantic narrowing, broadening, or metaphorical extension
    const shifts = [
      () => word.meaning += " (narrowed)",
      () => word.meaning += " (broadened)",
      () => word.meaning += " (metaphorical)",
    ];
    
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    shift();
  }
  
  /**
   * Create dialect from language
   */
  createDialect(region: string, speakers: number): Dialect {
    const dialect: Dialect = {
      id: `${this.language.id}_${region}`,
      name: `${this.language.name} (${region})`,
      baseLanguage: this.language.id,
      region,
      speakers,
      phoneticShifts: new Map(),
      lexicalDifferences: new Map(),
      grammaticalFeatures: [],
    };
    
    // Add some phonetic shifts
    const shifts = [
      ["p", "b"], ["t", "d"], ["k", "g"],
      ["a", "o"], ["e", "i"], ["o", "u"],
    ];
    
    for (let i = 0; i < 3; i++) {
      const shift = shifts[Math.floor(Math.random() * shifts.length)];
      dialect.phoneticShifts.set(shift[0], shift[1]);
    }
    
    // Add some lexical differences
    const words = Array.from(this.language.lexicon.keys());
    for (let i = 0; i < 5; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      dialect.lexicalDifferences.set(word, this.generateWord().form);
    }
    
    this.language.dialects.push(dialect.id);
    
    return dialect;
  }
  
  /**
   * Borrow word from another language
   */
  borrowWord(word: string, meaning: string, sourceLanguage: string): void {
    const loanword: Word = {
      form: word,
      meaning,
      partOfSpeech: "noun",
      etymology: `< ${sourceLanguage}`,
      frequency: 30,
      register: "neutral",
      connotation: "neutral",
    };
    
    this.language.lexicon.set(word, loanword);
    this.language.loanwords.set(word, sourceLanguage);
  }
  
  /**
   * Add cultural concept
   */
  addCulturalConcept(concept: string, word: string): void {
    if (!this.language.culturalConcepts.includes(concept)) {
      this.language.culturalConcepts.push(concept);
      
      // Create word for concept
      const culturalWord: Word = {
        form: word,
        meaning: concept,
        partOfSpeech: "noun",
        etymology: "cultural innovation",
        frequency: 50,
        register: "neutral",
        connotation: "positive",
      };
      
      this.language.lexicon.set(word, culturalWord);
    }
  }
  
  /**
   * Generate random word
   */
  private generateWord(): Word {
    const syllables = Math.floor(Math.random() * 3) + 1;
    let form = "";
    
    for (let i = 0; i < syllables; i++) {
      const consonant = this.language.phonology.consonants[
        Math.floor(Math.random() * this.language.phonology.consonants.length)
      ];
      const vowel = this.language.phonology.vowels[
        Math.floor(Math.random() * this.language.phonology.vowels.length)
      ];
      form += consonant + vowel;
    }
    
    return {
      form,
      meaning: "new concept",
      partOfSpeech: "noun",
      etymology: "neologism",
      frequency: 10,
      register: "neutral",
      connotation: "neutral",
    };
  }
  
  /**
   * Translate word to another language
   */
  translate(word: string, targetLanguage: LanguageSystem): string | null {
    const sourceWord = this.language.lexicon.get(word);
    if (!sourceWord) return null;
    
    // Find word with same meaning in target language
    for (const [targetWord, targetDef] of targetLanguage.language.lexicon) {
      if (targetDef.meaning === sourceWord.meaning) {
        return targetWord;
      }
    }
    
    return null;
  }
  
  /**
   * Calculate linguistic distance to another language
   */
  calculateDistance(other: LanguageSystem): number {
    let distance = 0;
    
    // Same family?
    if (this.language.family !== other.language.family) {
      distance += 50;
    }
    
    // Same branch?
    if (this.language.branch !== other.language.branch) {
      distance += 30;
    }
    
    // Shared vocabulary
    let sharedWords = 0;
    for (const [word, def] of this.language.lexicon) {
      if (other.language.lexicon.has(word)) {
        sharedWords++;
      }
    }
    const vocabularyDistance = (1 - sharedWords / this.language.lexicon.size) * 20;
    distance += vocabularyDistance;
    
    return Math.min(100, distance);
  }
  
  /**
   * Get language summary
   */
  getSummary(): string {
    return `
LANGUAGE: ${this.language.name}

Family: ${this.language.family} > ${this.language.branch}
Speakers: ${this.language.speakers}
Age: ${this.language.age} generations

Typology:
- Word Order: ${this.language.syntax.wordOrder}
- Morphology: ${this.language.morphology.type}
- Cases: ${this.language.morphology.cases}
- Tenses: ${this.language.morphology.tenses.join(", ")}

Phonology:
- Consonants: ${this.language.phonology.consonants.length}
- Vowels: ${this.language.phonology.vowels.length}
- Tones: ${this.language.phonology.tones}

Lexicon:
- Words: ${this.language.lexicon.size}
- Loanwords: ${this.language.loanwords.size}
- Dialects: ${this.language.dialects.length}

Cultural:
- Unique Concepts: ${this.language.culturalConcepts.length}
- Taboo Words: ${this.language.tabooWords.length}
`.trim();
  }
  
  /**
   * Export language
   */
  export(): Language {
    return JSON.parse(JSON.stringify(this.language));
  }
  
  /**
   * Import language
   */
  static import(language: Language): LanguageSystem {
    return new LanguageSystem(language);
  }
}

/**
 * Create proto-language (ancestral language)
 */
export function createProtoLanguage(
  name: string,
  family: string
): Language {
  return {
    id: `lang_${Date.now()}`,
    name,
    family,
    branch: "proto",
    speakers: 0,
    origin: "primordial",
    age: 0,
    phonology: {
      consonants: ["p", "t", "k", "m", "n", "s", "l", "r"],
      vowels: ["a", "e", "i", "o", "u"],
      tones: 0,
      syllableStructure: "(C)V(C)",
      allowedClusters: ["st", "sp", "sk", "tr", "pr", "kr"],
      stress: "fixed",
      intonation: "simple",
    },
    morphology: {
      type: "agglutinative",
      prefixes: [],
      suffixes: ["-s", "-ed", "-ing"],
      infixes: [],
      cases: 6,
      genders: 0,
      numbers: ["singular", "plural"],
      tenses: ["past", "present", "future"],
      aspects: ["perfective", "imperfective"],
      moods: ["indicative", "imperative"],
    },
    syntax: {
      wordOrder: "SVO",
      headedness: "head-initial",
      subordination: "finite",
      relativeClauses: "postnominal",
      subjectVerbAgreement: true,
      nounAdjectiveAgreement: false,
    },
    semantics: {
      colorTerms: 3,
      kinshipSystem: "descriptive",
      spatialSystem: "relative",
      commonMetaphors: new Map([
        ["time", "space"],
        ["understanding", "seeing"],
        ["argument", "war"],
      ]),
      polysemyTypes: ["metaphor", "metonymy"],
    },
    pragmatics: {
      politenessSystem: "simple",
      formality: ["informal", "formal"],
      topicProminence: false,
      evidentiality: false,
      commonSpeechActs: ["statement", "question", "command", "request"],
    },
    lexicon: new Map(),
    dialects: [],
    loanwords: new Map(),
    culturalConcepts: [],
    tabooWords: [],
    honorifics: new Map(),
  };
}
