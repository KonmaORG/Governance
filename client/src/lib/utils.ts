import { Data, fromText, type LucidEvolution } from "@lucid-evolution/lucid";
import { IDENTIFICATION_PID, IDENTIFICATION_TKN } from "../config/constants";
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
