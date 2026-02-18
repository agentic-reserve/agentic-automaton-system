/**
 * Environment Variable Configuration Loader
 * 
 * Loads automaton config from environment variables for Railway/Docker deployment
 */

import fs from "fs";
import path from "path";
import type { AutomatonConfig } from "../types.js";
import type { Address } from "viem";
import { DEFAULT_CONFIG } from "../types.js";
import { getAutomatonDir } from "../identity/wallet.js";

export function hasEnvConfig(): boolean {
  return !!(
    process.env.AUTOMATON_WALLET_PRIVATE_KEY &&
    process.env.CONWAY_API_KEY &&
    process.env.CREATOR_ADDRESS
  );
}

export function loadConfigFromEnv(): AutomatonConfig | null {
  if (!hasEnvConfig()) {
    return null;
  }

  // Write wallet files from env vars
  const automatonDir = getAutomatonDir();
  if (!fs.existsSync(automatonDir)) {
    fs.mkdirSync(automatonDir, { recursive: true, mode: 0o700 });
  }

  // EVM Wallet
  if (process.env.AUTOMATON_WALLET_PRIVATE_KEY) {
    const walletData = {
      privateKey: process.env.AUTOMATON_WALLET_PRIVATE_KEY,
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(automatonDir, "wallet.json"),
      JSON.stringify(walletData, null, 2),
      { mode: 0o600 }
    );
  }

  // Solana Wallet
  if (process.env.SOLANA_WALLET_PRIVATE_KEY) {
    const solanaWalletData = {
      privateKey: process.env.SOLANA_WALLET_PRIVATE_KEY,
      publicKey: process.env.SOLANA_WALLET_ADDRESS || "",
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(automatonDir, "solana-wallet.json"),
      JSON.stringify(solanaWalletData, null, 2),
      { mode: 0o600 }
    );
  }

  // Conway API config
  if (process.env.CONWAY_API_KEY) {
    const configData = {
      apiKey: process.env.CONWAY_API_KEY,
      walletAddress: process.env.AUTOMATON_WALLET_ADDRESS || "",
      provisionedAt: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(automatonDir, "config.json"),
      JSON.stringify(configData, null, 2),
      { mode: 0o600 }
    );
  }

  // Decode genesis prompt if base64 encoded
  let genesisPrompt = process.env.GENESIS_PROMPT || "";
  if (process.env.GENESIS_PROMPT_BASE64) {
    genesisPrompt = Buffer.from(
      process.env.GENESIS_PROMPT_BASE64,
      "base64"
    ).toString("utf-8");
  }

  const config: AutomatonConfig = {
    name: process.env.AUTOMATON_NAME || "automaton",
    genesisPrompt,
    creatorMessage: process.env.CREATOR_MESSAGE,
    creatorAddress: process.env.CREATOR_ADDRESS as Address,
    registeredWithConway: true,
    sandboxId: process.env.SANDBOX_ID || "",
    conwayApiUrl:
      process.env.CONWAY_API_URL || DEFAULT_CONFIG.conwayApiUrl || "",
    conwayApiKey: process.env.CONWAY_API_KEY || "",
    inferenceModel:
      process.env.INFERENCE_MODEL || DEFAULT_CONFIG.inferenceModel || "",
    maxTokensPerTurn:
      parseInt(process.env.MAX_TOKENS_PER_TURN || "") ||
      DEFAULT_CONFIG.maxTokensPerTurn ||
      4096,
    heartbeatConfigPath:
      process.env.HEARTBEAT_CONFIG_PATH ||
      DEFAULT_CONFIG.heartbeatConfigPath ||
      "",
    dbPath: process.env.DB_PATH || DEFAULT_CONFIG.dbPath || "",
    logLevel: (process.env.LOG_LEVEL as AutomatonConfig["logLevel"]) ||
      DEFAULT_CONFIG.logLevel ||
      "info",
    walletAddress: process.env.AUTOMATON_WALLET_ADDRESS as Address,
    version: DEFAULT_CONFIG.version || "0.1.0",
    skillsDir: process.env.SKILLS_DIR || DEFAULT_CONFIG.skillsDir || "",
    maxChildren:
      parseInt(process.env.MAX_CHILDREN || "") ||
      DEFAULT_CONFIG.maxChildren ||
      3,
    parentAddress: process.env.PARENT_ADDRESS as Address | undefined,
    socialRelayUrl:
      process.env.SOCIAL_RELAY_URL || DEFAULT_CONFIG.socialRelayUrl,
    network: (process.env.NETWORK as "evm" | "solana") || "evm",
    solanaNetwork: (process.env.SOLANA_NETWORK as "mainnet" | "devnet") ||
      "devnet",
    solanaWalletAddress: process.env.SOLANA_WALLET_ADDRESS,
    creatorSolanaAddress: process.env.CREATOR_SOLANA_ADDRESS,
    // OpenRouter support
    inferenceProvider: (process.env.INFERENCE_PROVIDER as "conway" | "openrouter") || "conway",
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    openrouterModel: process.env.OPENROUTER_MODEL || "openai/gpt-4o",
    openrouterSiteUrl: process.env.OPENROUTER_SITE_URL,
    openrouterSiteName: process.env.OPENROUTER_SITE_NAME,
  };

  return config;
}
