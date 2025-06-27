import type { Cardano } from "@/context/CardanoContext";
import {
  Blockfrost,
  Lucid,
  type LucidEvolution,
  type UTxO,
} from "@lucid-evolution/lucid";
import { emulator } from "./emulator";
import { BF_PID, BF_URL, NETWORK } from "@/config/constants";
import type { CardanoWallet } from "@/types/Cardano";
const PROVIDER = new Blockfrost(BF_URL, BF_PID);
export const mkLucid = async (
  setWalletConnection: React.Dispatch<React.SetStateAction<Cardano>>,
  isEmulator?: boolean
): Promise<void> => {
  try {
    let lucidInstance;
    if (isEmulator) {
      lucidInstance = await Lucid(emulator, "Custom");
    } else {
      lucidInstance = await Lucid(PROVIDER, NETWORK);
    }
    setWalletConnection((prev) => ({
      ...prev,
      lucid: lucidInstance,
    }));
  } catch (error) {
    console.error("Error initializing Lucid:", error);
  }
};

export const walletConnect = async (
  setWalletConnection: React.Dispatch<React.SetStateAction<Cardano>>,
  wallet: CardanoWallet,
  lucid: LucidEvolution
): Promise<void> => {
  try {
    const api = await wallet.enable();
    lucid.selectWallet.fromAPI(api);

    const address = await lucid.wallet().address();
    const utxos = await lucid.utxosAt(address);
    const balance = walletBalance(utxos);

    setWalletConnection((prev) => {
      return {
        ...prev,
        wallet,
        address,
        balance,
      };
    });
    return;
  } catch (error) {
    console.error("Error Connecting Wallet:", error);
  }
};

function walletBalance(utxos: UTxO[]) {
  let balance = 0n;
  for (const utxo of utxos) {
    balance += utxo.assets.lovelace;
  }
  return Number((Number(balance) / 1_000_000).toFixed(2));
}
