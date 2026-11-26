/**
 * deploy-counter.ts — deploy Counter directly with viem (no Ignition).
 * Ignition's deploy stalled before submitting anything on this network,
 * so this bypasses its confirmation wait. Owner key from .env (testnet only).
 */
import { readFileSync } from "node:fs";
import { createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const CHAIN = defineChain({
  id: 9800,
  name: "QoreChain Diana Testnet",
  nativeCurrency: { name: "QOR", symbol: "QOR", decimals: 18 },
  rpcUrls: { default: { http: ["https://evm-testnet.qore.host"] } },
});

const key = process.env.PRIVATE_KEY as `0x${string}`;
if (!/^0x[0-9a-fA-F]{64}$/.test(key)) throw new Error("PRIVATE_KEY must be 0x + 64 hex chars");
const account = privateKeyToAccount(key);
const publicClient = createPublicClient({ chain: CHAIN, transport: http("https://evm-testnet.qore.host") });
const wallet = createWalletClient({ account, chain: CHAIN, transport: http("https://evm-testnet.qore.host") });

const artifact = JSON.parse(readFileSync("artifacts/contracts/Counter.sol/Counter.json", "utf8")) as {
  abi: never;
  bytecode: `0x${string}`;
};

const hash = await wallet.deployContract({ abi: artifact.abi, bytecode: artifact.bytecode, args: [0n] });
console.log(`deploy tx: ${hash}`);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log(`counter: ${receipt.contractAddress} (block ${receipt.blockNumber}, status ${receipt.status})`);
