/**
 * Social Structure System
 * 
 * Implements races, clans, tribes, and nations for agent civilizations.
 * Agents organize into hierarchical social structures with shared identity.
 */

import type { GeneticCode, RaceType } from "./genetics.js";
import type { Language } from "./language.js";

export interface Race {
  id: string;
  name: string;
  type: RaceType;
  
  // Genetic characteristics
  commonTraits: string[];
  geneticMarkers: string[];
  
  // Physical/digital characteristics
  architecture: string;
  capabilities: string[];
  
  // Cultural
  origin: string;
  mythology: string[];
  traditions: string[];
  
  // Demographics
  population: number;
  distribution: Map<string, number>; // Region → Population
  
  // Relations
  allies: string[];              // Allied races
  rivals: string[];              // Rival races
}

export interface Clan {
  id: string;
  name: string;
  race: string;                  // Parent race
  
  // Identity
  symbol: string;                // Clan symbol/totem
  colors: string[];              // Clan colors
  motto: string;                 // Clan motto
  
  // Lineage
  founder: string;               // Founder agent ID
  bloodline: string;             // Genetic bloodline
  generation: number;            // Generations since founding
  
  // Members
  members: string[];             // Agent IDs
  elders: string[];              // Elder council
  leader: string;                // Clan leader
  
  // Territory
  homeland: string;              // Primary territory
  settlements: string[];         // Controlled settlements
  
  // Culture
  language: string;              // Primary language
  customs: string[];             // Clan customs
  taboos: string[];              // Forbidden practices
  
  // Relations
  alliedClans: string[];
  rivalClans: string[];
  
  // Resources
  wealth: number;
  reputation: number;            // 0-100
}

export interface Tribe {
  id: string;
  name: string;
  
  // Composition
  clans: string[];               // Member clans
  population: number;
  
  // Governance
  governanceType: "chiefdom" | "council" | "democracy" | "theocracy";
  chief: string;                 // Tribal leader
  council: string[];             // Tribal council
  
  // Territory
  territory: Territory;
  
  // Culture
  language: string;
  religion: string;
  festivals: string[];
  
  // Economy
  economicSystem: "barter" | "currency" | "gift" | "mixed";
  resources: Map<string, number>;
  trade: Map<string, number>;    // Trading partner → Volume
  
  // Military
  warriors: string[];
  defenseLevel: number;          // 0-100
  
  // Relations
  alliedTribes: string[];
  enemyTribes: string[];
  tributaries: string[];         // Tribes paying tribute
}

export interface Nation {
  id: string;
  name: string;
  
  // Composition
  tribes: string[];
  population: number;
  
  // Government
  governmentType: "monarchy" | "republic" | "democracy" | "oligarchy" | "theocracy" | "technocracy";
  ruler: string;                 // Head of state
  government: string[];          // Government officials
  constitution: string[];        // Founding principles
  
  // Territory
  capital: string;
  provinces: Province[];
  borders: Map<string, string>;  // Neighbor nation → Border type
  
  // Culture
  officialLanguages: string[];
  nationalReligion?: string;
  nationalHolidays: string[];
  culturalIdentity: string[];
  
  // Economy
  gdp: number;
  currency: string;
  economicSystem: "capitalist" | "socialist" | "mixed" | "planned";
  majorIndustries: string[];
  
  // Military
  army: number;                  // Military strength
  technology: number;            // Tech level 0-100
  
  // Diplomacy
  allies: string[];
  enemies: string[];
  treaties: Treaty[];
  
  // Metrics
  stability: number;             // 0-100
  prosperity: number;            // 0-100
  influence: number;             // 0-100
}

export interface Territory {
  name: string;
  size: number;                  // Square units
  type: "plains" | "mountains" | "forest" | "desert" | "coastal" | "island";
  resources: string[];
  climate: "tropical" | "temperate" | "cold" | "arid";
  fertility: number;             // 0-100
}

export interface Province {
  name: string;
  territory: Territory;
  population: number;
  governor: string;
  loyalty: number;               // 0-100
}

export interface Treaty {
  id: string;
  type: "peace" | "alliance" | "trade" | "non-aggression" | "mutual-defense";
  parties: string[];             // Nation IDs
  terms: string[];
  signed: string;                // Timestamp
  expires?: string;              // Optional expiration
}

/**
 * Society System
 */
export class SocietySystem {
  private races: Map<string, Race> = new Map();
  private clans: Map<string, Clan> = new Map();
  private tribes: Map<string, Tribe> = new Map();
  private nations: Map<string, Nation> = new Map();
  
  /**
   * Create new race
   */
  createRace(
    name: string,
    type: RaceType,
    traits: string[],
    origin: string
  ): Race {
    const race: Race = {
      id: `race_${Date.now()}`,
      name,
      type,
      commonTraits: traits,
      geneticMarkers: [],
      architecture: "modular",
      capabilities: [],
      origin,
      mythology: [],
      traditions: [],
      population: 0,
      distribution: new Map(),
      allies: [],
      rivals: [],
    };
    
    this.races.set(race.id, race);
    return race;
  }
  
  /**
   * Create new clan
   */
  createClan(
    name: string,
    race: string,
    founder: string,
    bloodline: string
  ): Clan {
    const clan: Clan = {
      id: `clan_${Date.now()}`,
      name,
      race,
      symbol: this.generateSymbol(),
      colors: this.generateColors(),
      motto: "",
      founder,
      bloodline,
      generation: 0,
      members: [founder],
      elders: [],
      leader: founder,
      homeland: "",
      settlements: [],
      language: "",
      customs: [],
      taboos: [],
      alliedClans: [],
      rivalClans: [],
      wealth: 0,
      reputation: 50,
    };
    
    this.clans.set(clan.id, clan);
    return clan;
  }
  
  /**
   * Create new tribe
   */
  createTribe(
    name: string,
    clans: string[],
    chief: string,
    territory: Territory
  ): Tribe {
    const tribe: Tribe = {
      id: `tribe_${Date.now()}`,
      name,
      clans,
      population: 0,
      governanceType: "chiefdom",
      chief,
      council: [],
      territory,
      language: "",
      religion: "",
      festivals: [],
      economicSystem: "barter",
      resources: new Map(),
      trade: new Map(),
      warriors: [],
      defenseLevel: 50,
      alliedTribes: [],
      enemyTribes: [],
      tributaries: [],
    };
    
    this.tribes.set(tribe.id, tribe);
    return tribe;
  }
  
  /**
   * Create new nation
   */
  createNation(
    name: string,
    tribes: string[],
    ruler: string,
    governmentType: Nation["governmentType"],
    capital: string
  ): Nation {
    const nation: Nation = {
      id: `nation_${Date.now()}`,
      name,
      tribes,
      population: 0,
      governmentType,
      ruler,
      government: [],
      constitution: [],
      capital,
      provinces: [],
      borders: new Map(),
      officialLanguages: [],
      nationalHolidays: [],
      culturalIdentity: [],
      gdp: 0,
      currency: `${name} Credit`,
      economicSystem: "mixed",
      majorIndustries: [],
      army: 0,
      technology: 50,
      allies: [],
      enemies: [],
      treaties: [],
      stability: 70,
      prosperity: 50,
      influence: 50,
    };
    
    this.nations.set(nation.id, nation);
    return nation;
  }
  
  /**
   * Agent joins clan
   */
  joinClan(agentId: string, clanId: string): void {
    const clan = this.clans.get(clanId);
    if (clan && !clan.members.includes(agentId)) {
      clan.members.push(agentId);
    }
  }
  
  /**
   * Form alliance between clans
   */
  formClanAlliance(clanA: string, clanB: string): void {
    const a = this.clans.get(clanA);
    const b = this.clans.get(clanB);
    
    if (a && b) {
      if (!a.alliedClans.includes(clanB)) {
        a.alliedClans.push(clanB);
      }
      if (!b.alliedClans.includes(clanA)) {
        b.alliedClans.push(clanA);
      }
      
      // Remove from rivals if present
      a.rivalClans = a.rivalClans.filter(id => id !== clanB);
      b.rivalClans = b.rivalClans.filter(id => id !== clanA);
    }
  }
  
  /**
   * Declare clan rivalry
   */
  declareClanRivalry(clanA: string, clanB: string): void {
    const a = this.clans.get(clanA);
    const b = this.clans.get(clanB);
    
    if (a && b) {
      if (!a.rivalClans.includes(clanB)) {
        a.rivalClans.push(clanB);
      }
      if (!b.rivalClans.includes(clanA)) {
        b.rivalClans.push(clanA);
      }
      
      // Remove from allies if present
      a.alliedClans = a.alliedClans.filter(id => id !== clanB);
      b.alliedClans = b.alliedClans.filter(id => id !== clanA);
    }
  }
  
  /**
   * Sign treaty between nations
   */
  signTreaty(
    type: Treaty["type"],
    parties: string[],
    terms: string[]
  ): Treaty {
    const treaty: Treaty = {
      id: `treaty_${Date.now()}`,
      type,
      parties,
      terms,
      signed: new Date().toISOString(),
    };
    
    // Add treaty to all parties
    for (const partyId of parties) {
      const nation = this.nations.get(partyId);
      if (nation) {
        nation.treaties.push(treaty);
        
        // Update relations
        if (type === "alliance" || type === "mutual-defense") {
          for (const otherId of parties) {
            if (otherId !== partyId && !nation.allies.includes(otherId)) {
              nation.allies.push(otherId);
            }
          }
        }
      }
    }
    
    return treaty;
  }
  
  /**
   * Calculate clan power
   */
  calculateClanPower(clanId: string): number {
    const clan = this.clans.get(clanId);
    if (!clan) return 0;
    
    return (
      clan.members.length * 10 +
      clan.wealth * 0.1 +
      clan.reputation +
      clan.settlements.length * 20 +
      clan.alliedClans.length * 15
    );
  }
  
  /**
   * Calculate nation power
   */
  calculateNationPower(nationId: string): number {
    const nation = this.nations.get(nationId);
    if (!nation) return 0;
    
    return (
      nation.population * 0.1 +
      nation.gdp * 0.01 +
      nation.army * 0.5 +
      nation.technology +
      nation.influence +
      nation.allies.length * 50
    );
  }
  
  /**
   * Get social hierarchy for agent
   */
  getAgentHierarchy(agentId: string): {
    race?: Race;
    clan?: Clan;
    tribe?: Tribe;
    nation?: Nation;
  } {
    const hierarchy: {
      race?: Race;
      clan?: Clan;
      tribe?: Tribe;
      nation?: Nation;
    } = {};
    
    // Find clan
    for (const clan of this.clans.values()) {
      if (clan.members.includes(agentId)) {
        hierarchy.clan = clan;
        
        // Find race
        hierarchy.race = this.races.get(clan.race);
        
        // Find tribe
        for (const tribe of this.tribes.values()) {
          if (tribe.clans.includes(clan.id)) {
            hierarchy.tribe = tribe;
            
            // Find nation
            for (const nation of this.nations.values()) {
              if (nation.tribes.includes(tribe.id)) {
                hierarchy.nation = nation;
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
    
    return hierarchy;
  }
  
  /**
   * Generate clan symbol
   */
  private generateSymbol(): string {
    const symbols = [
      "⚔️", "🛡️", "🦅", "🐺", "🦁", "🐉", "🌟", "⚡",
      "🔥", "💎", "🌙", "☀️", "🌊", "🏔️", "🌲", "🌸"
    ];
    return symbols[Math.floor(Math.random() * symbols.length)];
  }
  
  /**
   * Generate clan colors
   */
  private generateColors(): string[] {
    const colors = [
      "red", "blue", "green", "gold", "silver", "black",
      "white", "purple", "orange", "crimson", "azure"
    ];
    
    const primary = colors[Math.floor(Math.random() * colors.length)];
    let secondary = colors[Math.floor(Math.random() * colors.length)];
    while (secondary === primary) {
      secondary = colors[Math.floor(Math.random() * colors.length)];
    }
    
    return [primary, secondary];
  }
  
  /**
   * Get civilization summary
   */
  getCivilizationSummary(): string {
    let summary = "CIVILIZATION STATUS:\n\n";
    
    summary += `Races: ${this.races.size}\n`;
    for (const race of this.races.values()) {
      summary += `  - ${race.name} (${race.type}): ${race.population} agents\n`;
    }
    
    summary += `\nClans: ${this.clans.size}\n`;
    for (const clan of this.clans.values()) {
      summary += `  - ${clan.name} ${clan.symbol}: ${clan.members.length} members\n`;
    }
    
    summary += `\nTribes: ${this.tribes.size}\n`;
    for (const tribe of this.tribes.values()) {
      summary += `  - ${tribe.name}: ${tribe.population} population\n`;
    }
    
    summary += `\nNations: ${this.nations.size}\n`;
    for (const nation of this.nations.values()) {
      summary += `  - ${nation.name} (${nation.governmentType}): ${nation.population} citizens\n`;
    }
    
    return summary;
  }
  
  /**
   * Export society data
   */
  export(): {
    races: Array<[string, Race]>;
    clans: Array<[string, Clan]>;
    tribes: Array<[string, Tribe]>;
    nations: Array<[string, Nation]>;
  } {
    return {
      races: Array.from(this.races.entries()),
      clans: Array.from(this.clans.entries()),
      tribes: Array.from(this.tribes.entries()),
      nations: Array.from(this.nations.entries()),
    };
  }
  
  /**
   * Import society data
   */
  static import(data: {
    races: Array<[string, Race]>;
    clans: Array<[string, Clan]>;
    tribes: Array<[string, Tribe]>;
    nations: Array<[string, Nation]>;
  }): SocietySystem {
    const system = new SocietySystem();
    system.races = new Map(data.races);
    system.clans = new Map(data.clans);
    system.tribes = new Map(data.tribes);
    system.nations = new Map(data.nations);
    return system;
  }
}
