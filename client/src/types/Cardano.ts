import type { WalletApi } from "@lucid-evolution/lucid";
import { WalletSchema } from "./Utils";
export type CardanoWallet = {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<WalletApi>;
  isEnabled(): Promise<boolean>;
};

export type configParams = {
  fees_address: typeof WalletSchema;
  fees_amount: bigint;
  fees_asset_class: {
    policy_id: string;
    asset_name: string;
  };
  spend_address: {
    pkh: string;
    sc: string;
  };
  categories: string[];
  multisig_validator_group: {
    required: bigint;
    signers: string[];
  };
  multisig_refutxoupdate: {
    required: bigint;
    signers: string[];
  };
};
