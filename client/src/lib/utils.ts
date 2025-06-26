import { Data, fromText, type LucidEvolution } from "@lucid-evolution/lucid";
import {
  BF_PID,
  BF_URL,
  IDENTIFICATION_PID,
  IDENTIFICATION_TKN,
} from "../config/constants";
import { ConfigDatum } from "../types/Datum";

export async function refConfigUtxo(lucid: LucidEvolution) {
  const unit = IDENTIFICATION_PID + fromText(IDENTIFICATION_TKN);
  const utxo = await lucid.utxoByUnit(unit);
  return utxo;
}

export async function refConfigDatum(lucid: LucidEvolution) {
  const utxo = await refConfigUtxo(lucid);
  const data = await lucid.datumOf(utxo);
  const datum = Data.castFrom(data, ConfigDatum);
  return datum;
}

export const blockfrost = {
  getLatestTime: async () => {
    const url = `${BF_URL}/blocks/latest`;

    try {
      const assetResponse = await fetch(url, {
        method: "GET",
        headers: {
          project_id: BF_PID as string,
        },
      });

      if (!assetResponse.ok) {
        throw new Error(`Error: ${assetResponse.statusText}`);
      }

      const result = await assetResponse.json();
      return result.time * 1000;
    } catch (err: any) {
      return err.message;
    }
  },
};
