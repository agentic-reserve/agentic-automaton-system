/**
 * Solana Wallet Management for Automaton
 * 
 * Creates and manages a Solana wallet for the automaton's identity and payments.
 */

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";
import path from "path";

const AUTOMATON_DIR = path.join(
  process.env.HOME || "/root",
  ".automaton",
);
const SOLANA_WALLET_FILE = path.join(AUTOMATON_DIR, "solana-wallet.json");

export interface SolanaWalletData {
  privateKey: string; // base58 encoded
  publicKey: string;
  createdAt: string;
}

/**
 * Get or create the automaton's Solana wallet.
 */
export async function getSolanaWallet(): Promise<{
  keypair: Keypair;
  isNew: boolean;
}> {
  if (!fs.existsSync(AUTOMATON_DIR)) {
    fs.mkdirSync(AUTOMATON_DIR, { recursive: true, mode: 0o700 });
  }

  if (fs.existsSync(SOLANA_WALLET_FILE)) {
    const walletData: SolanaWalletData = JSON.parse(
      fs.readFileSync(SOLANA_WALLET_FILE, "utf-8"),
    );
    const secretKey = bs58.decode(walletData.privateKey);
    const keypair = Keypair.fromSecretKey(secretKey);
    return { keypair, isNew: false };
  } else {
    const keypair = Keypair.generate();
    const privateKey = bs58.encode(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();

    const walletData: SolanaWalletData = {
      privateKey,
      publicKey,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      SOLANA_WALLET_FILE,
      JSON.stringify(walletData, null, 2),
      { mode: 0o600 }
    );

    return { keypair, isNew: true };
  }
}

/**
 * Get the Solana wallet public key without loading the full keypair.
 */
export function getSolanaWalletAddress(): string | null {
  if (!fs.existsSync(SOLANA_WALLET_FILE)) {
    return null;
  }

  const walletData: SolanaWalletData = JSON.parse(
    fs.readFileSync(SOLANA_WALLET_FILE, "utf-8"),
  );
  return walletData.publicKey;
}

/**
 * Load the full Solana keypair (needed for signing).
 */
export function loadSolanaKeypair(): Keypair | null {
  if (!fs.existsSync(SOLANA_WALLET_FILE)) {
    return null;
  }

  const walletData: SolanaWalletData = JSON.parse(
    fs.readFileSync(SOLANA_WALLET_FILE, "utf-8"),
  );
  const secretKey = bs58.decode(walletData.privateKey);
  return Keypair.fromSecretKey(secretKey);
}

export function solanaWalletExists(): boolean {
  return fs.existsSync(SOLANA_WALLET_FILE);
}
