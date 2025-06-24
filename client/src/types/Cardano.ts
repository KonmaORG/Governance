import type { WalletApi } from "@lucid-evolution/lucid";

export type CardanoWallet = {
  name: string;
  icon: string;
  enable(): Promise<WalletApi>;
};
