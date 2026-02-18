/**
 * Solana x402 Payment Protocol
 * 
 * Enables the automaton to make USDC micropayments on Solana via HTTP 402.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";
import bs58 from "bs58";

// USDC SPL Token addresses
const USDC_MINT_ADDRESSES: Record<string, string> = {
  "solana:mainnet": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Mainnet USDC
  "solana:devnet": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet USDC (fake)
};

const RPC_ENDPOINTS: Record<string, string> = {
  "solana:mainnet": "https://api.mainnet-beta.solana.com",
  "solana:devnet": "https://api.devnet.solana.com",
};

type SolanaNetwork = keyof typeof USDC_MINT_ADDRESSES;

interface SolanaPaymentRequirement {
  scheme: string;
  network: SolanaNetwork;
  maxAmountRequired: string;
  payToAddress: string;
  requiredDeadlineSeconds: number;
  usdcMint: string;
}

interface SolanaPaymentRequiredResponse {
  x402Version: number;
  accepts: SolanaPaymentRequirement[];
}

export interface SolanaUsdcBalanceResult {
  balance: number;
  network: string;
  ok: boolean;
  error?: string;
}

export interface SolanaX402PaymentResult {
  success: boolean;
  response?: any;
  error?: string;
  status?: number;
}

/**
 * Get USDC balance for a Solana wallet
 */
export async function getSolanaUsdcBalance(
  publicKey: PublicKey,
  network: string = "solana:devnet",
): Promise<number> {
  const result = await getSolanaUsdcBalanceDetailed(publicKey, network);
  return result.balance;
}

/**
 * Get detailed USDC balance with diagnostics
 */
export async function getSolanaUsdcBalanceDetailed(
  publicKey: PublicKey,
  network: string = "solana:devnet",
): Promise<SolanaUsdcBalanceResult> {
  const usdcMint = USDC_MINT_ADDRESSES[network];
  const rpcEndpoint = RPC_ENDPOINTS[network];

  if (!usdcMint || !rpcEndpoint) {
    return {
      balance: 0,
      network,
      ok: false,
      error: `Unsupported Solana network: ${network}`,
    };
  }

  try {
    const connection = new Connection(rpcEndpoint, "confirmed");
    const usdcMintPubkey = new PublicKey(usdcMint);
    
    const associatedTokenAddress = await getAssociatedTokenAddress(
      usdcMintPubkey,
      publicKey
    );

    const tokenAccount = await getAccount(
      connection,
      associatedTokenAddress
    );

    // USDC has 6 decimals
    return {
      balance: Number(tokenAccount.amount) / 1_000_000,
      network,
      ok: true,
    };
  } catch (err: any) {
    // Token account might not exist yet (balance = 0)
    if (err.message?.includes("could not find account")) {
      return {
        balance: 0,
        network,
        ok: true,
      };
    }
    return {
      balance: 0,
      network,
      ok: false,
      error: err?.message || String(err),
    };
  }
}

/**
 * Check if a URL requires Solana x402 payment
 */
export async function checkSolanaX402(
  url: string,
): Promise<SolanaPaymentRequirement | null> {
  try {
    const resp = await fetch(url, { method: "GET" });
    if (resp.status !== 402) {
      return null;
    }
    const parsed = await parseSolanaPaymentRequired(resp);
    return parsed?.requirement ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch a URL with automatic Solana x402 payment
 */
export async function solanaX402Fetch(
  url: string,
  keypair: Keypair,
  network: string = "solana:devnet",
  method: string = "GET",
  body?: string,
  headers?: Record<string, string>,
): Promise<SolanaX402PaymentResult> {
  try {
    // Initial request
    const initialResp = await fetch(url, {
      method,
      headers: { ...headers, "Content-Type": "application/json" },
      body,
    });

    if (initialResp.status !== 402) {
      const data = await initialResp.json().catch(() => initialResp.text());
      return {
        success: initialResp.ok,
        response: data,
        status: initialResp.status,
      };
    }

    // Parse payment requirements
    const parsed = await parseSolanaPaymentRequired(initialResp);
    if (!parsed) {
      return {
        success: false,
        error: "Could not parse Solana payment requirements",
        status: initialResp.status,
      };
    }

    // Sign payment
    let payment: any;
    try {
      payment = await signSolanaPayment(
        keypair,
        parsed.requirement,
        parsed.x402Version,
        network,
      );
    } catch (err: any) {
      return {
        success: false,
        error: `Failed to sign Solana payment: ${err?.message || String(err)}`,
        status: initialResp.status,
      };
    }

    // Retry with payment
    const paymentHeader = Buffer.from(JSON.stringify(payment)).toString(
      "base64",
    );

    const paidResp = await fetch(url, {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "X-Payment": paymentHeader,
      },
      body,
    });

    const data = await paidResp.json().catch(() => paidResp.text());
    return { success: paidResp.ok, response: data, status: paidResp.status };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function parseSolanaPaymentRequired(
  resp: Response,
): Promise<{ x402Version: number; requirement: SolanaPaymentRequirement } | null> {
  const header = resp.headers.get("X-Payment-Required");
  if (header) {
    try {
      const decoded = Buffer.from(header, "base64").toString("utf-8");
      const parsed: SolanaPaymentRequiredResponse = JSON.parse(decoded);
      const solanaReq = parsed.accepts.find((r) =>
        r.network.startsWith("solana:")
      );
      if (solanaReq) {
        return { x402Version: parsed.x402Version, requirement: solanaReq };
      }
    } catch {}
  }

  try {
    const body: SolanaPaymentRequiredResponse = await resp.json();
    const solanaReq = body.accepts.find((r) => r.network.startsWith("solana:"));
    if (solanaReq) {
      return { x402Version: body.x402Version, requirement: solanaReq };
    }
  } catch {}

  return null;
}

async function signSolanaPayment(
  keypair: Keypair,
  requirement: SolanaPaymentRequirement,
  x402Version: number,
  network: string,
): Promise<any> {
  const rpcEndpoint = RPC_ENDPOINTS[network];
  if (!rpcEndpoint) {
    throw new Error(`Unsupported Solana network: ${network}`);
  }

  const connection = new Connection(rpcEndpoint, "confirmed");
  const usdcMint = new PublicKey(requirement.usdcMint);
  const recipient = new PublicKey(requirement.payToAddress);

  // Get associated token addresses
  const senderTokenAddress = await getAssociatedTokenAddress(
    usdcMint,
    keypair.publicKey
  );
  const recipientTokenAddress = await getAssociatedTokenAddress(
    usdcMint,
    recipient
  );

  // Parse amount (USDC has 6 decimals)
  const amount = parseFloat(requirement.maxAmountRequired) * 1_000_000;

  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    senderTokenAddress,
    recipientTokenAddress,
    keypair.publicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );

  // Create transaction
  const transaction = new Transaction().add(transferInstruction);
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = keypair.publicKey;

  // Sign transaction
  transaction.sign(keypair);

  // Serialize transaction
  const serializedTx = transaction.serialize().toString("base64");

  return {
    x402Version,
    scheme: requirement.scheme,
    network: requirement.network,
    payload: {
      transaction: serializedTx,
      from: keypair.publicKey.toBase58(),
      to: requirement.payToAddress,
      amount: amount.toString(),
    },
  };
}
