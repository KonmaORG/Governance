import type { WalletApi } from "@lucid-evolution/lucid";

export type CardanoWallet = {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<WalletApi>;
  isEnabled(): Promise<boolean>;
};
