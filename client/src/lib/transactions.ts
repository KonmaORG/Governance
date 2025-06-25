import {
  applyParamsToScript,
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  slotToUnixTime,
  type Address,
  type LucidEvolution,
  type Network,
  type Validator,
} from "@lucid-evolution/lucid";
import { script } from "../config/script";
import { GovernanceRedeemer } from "../types/Redeemer";
import type { GovernanceDatum } from "../types/Datum";

export async function MintIdentificationToken(lucid: LucidEvolution) {
  const mint = new Constr(0, []);
  const redeemer = Data.to(mint);

  const tx = await lucid
    .newTx()
    .collectFrom([utxos[0]])
    .mintAssets(mintedAssets, redeemer)
    .attach.MintingPolicy(mintingValidator)
    .complete();

  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();
  console.log("-----------IdentificationNFT__Mint---------");
  console.log("policyId: ", policyID);
}

export async function AttachConfigDatum(lucid: LucidEvolution) {}

export async function SubmitProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address
): Promise<string> {
  if (!lucid || !proposalId || !address) {
    throw new Error("Lucid, proposal, or address is not defined.");
  }
  const configValidator: Validator = {
    type: "PlutusV2",
    script: script.ConfigDatumHolder,
  };
  const configPolicyId = mintingPolicyToId(configValidator);
  const validator: Validator = {
    type: "PlutusV2",
    script: applyParamsToScript(script.Dao, [configPolicyId]), // config_nft
  };
  const policyId = mintingPolicyToId(validator);
  // mintingPolicyToId()
  const proposalAsset = { [policyId + fromText(proposalId)]: 1n };
  const redeemer: GovernanceRedeemer = {
    SubmitProposal: {
      proposal_id: fromText(proposalId),
    },
  };

  const proposalStart = BigInt(
    slotToUnixTime(lucid.config().network as Network, lucid.currentSlot())
  );
  const proposalEnd = proposalStart + BigInt(60 * 60 * 24 * 30 * 1000); // 30 days

  const datum: GovernanceDatum = {
    proposal_id: fromText(proposalId),
    submitted_by: paymentCredentialOf(address).hash,
    proposal_action: { FeeAmountUpdate: [101_000_000n] },
    votes: votes_var, //votes can be extracted from the config datum.multisig, for that we need to have Identification script
    votes_count: { yes: 0n, no: 0n, abstain: 0n },
    deadline: { start: proposalStart, end: proposalEnd },
    proposal_state: "InProgress",
  };
  // MINT
  //  mint asset, with tkn and proposal_id
  //  redeemer includes the proposal_id SubmitProposal{proposal_id}
  //  send the asset and datum to script address
  //  signed by the submitter

  const tx = await lucid
    .newTx()
    .mintAssets(proposalAsset, Data.to(redeemer, GovernanceRedeemer))
    .pay.ToContract(
      address,
      { kind: "inline", value: Data.to(redeemer, GovernanceRedeemer) },
      { lovelace: 1n, ...proposalAsset }
    )
    .attach.MintingPolicy(validator)
    .addSigner(address)
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  return txHash;
}
