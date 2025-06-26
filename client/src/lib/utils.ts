import { Data, fromText, type LucidEvolution } from "@lucid-evolution/lucid";
import {
  BF_PID,
  BF_URL,
  IDENTIFICATION_PID,
  IDENTIFICATION_TKN,
} from "../config/constants";
import { ConfigDatum } from "../types/Datum";
import { toast } from "sonner";

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

export function handleSuccess(success: any) {
  toast.success(`${success}`);
  console.log(success);
}

export function handleError(error: any) {
  const { info, message } = error;
  const errorMessage = `${message}`;

  try {
    // KoiosError:
    const a = errorMessage.indexOf("{", 1);
    const b =
      errorMessage.lastIndexOf("}", errorMessage.lastIndexOf("}") - 1) + 1;

    const rpc = errorMessage.slice(a, b);
    const jsonrpc = JSON.parse(rpc);

    const errorData = jsonrpc.error.data[0].error.data;
    try {
      const { validationError, traces } = errorData;

      toast.error(`${validationError} Traces: ${traces.join(", ")}.`);
      console.error({ [validationError]: traces });
    } catch {
      const { reason } = errorData;

      toast.error(`${reason}`);
      console.error(reason);
    }
  } catch {
    function toJSON(error: any) {
      try {
        const errorString = JSON.stringify(error);
        const errorJSON = JSON.parse(errorString);
        return errorJSON;
      } catch {
        return {};
      }
    }

    const { cause } = toJSON(error);
    const { failure } = cause ?? {};

    const failureCause = failure?.cause;

    let failureTrace: string | undefined;
    try {
      failureTrace = eval(failureCause).replaceAll(" Trace ", " \n ");
    } catch {
      failureTrace = undefined;
    }

    const failureInfo = failureCause?.info;
    const failureMessage = failureCause?.message;

    toast.error(
      `${
        failureTrace ??
        failureInfo ??
        failureMessage ??
        info ??
        message ??
        error
      }`
    );
    console.error(failureCause ?? { error });
  }
}
