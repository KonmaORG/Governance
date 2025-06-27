import {
  applyParamsToScript,
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  slotToUnixTime,
  validatorToAddress,
  type Address,
  type LucidEvolution,
  type Network,
  type PolicyId,
  type Validator,
} from "@lucid-evolution/lucid";
import { script } from "@/config/script";
import { Action, GovernanceRedeemer } from "@/types/Redeemer";
import { ConfigDatum, GovernanceDatum } from "@/types/Datum";
import { IDENTIFICATION_PID, IDENTIFICATION_TKN } from "@/config/constants";
import {
  ProposalAction,
  Vote,
  VotesArray,
  Wallet,
  type AssetClass,
} from "@/types/Utils";
import {
  blockfrost,
  handleError,
  handleSuccess,
  refConfigDatum,
  refConfigUtxo,
} from "./utils";

export async function MintIdentificationToken(
  lucid: LucidEvolution,
  address: Address
) {
  try {
    const utxos = await lucid.utxosAt(address);
    const orefHash = String(utxos[0].txHash);
    const orefIndex = BigInt(utxos[0].outputIndex);
    const oref = new Constr(0, [orefHash, orefIndex]);

    const mintingValidator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.IdentificationNft, [oref]),
    };
    const policyID = mintingPolicyToId(mintingValidator);
    const ref_assetName = IDENTIFICATION_TKN;
    const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n };
    const mint: Action = "Mint";
    const redeemer = Data.to(mint, Action);

    const tx = await lucid
      .newTx()
      .collectFrom([utxos[0]])
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("-----------IdentificationNFT---------");
    console.log("policyId: ", policyID);
    handleSuccess(txHash);
    return txHash;
  } catch (e) {
    return handleError(e);
  }
}

export async function AttachConfigDatum(
  lucid: LucidEvolution,
  configParams: {
    fees_address: {
      pkh: string;
      sc: string;
    };
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
  }
) {
  try {
    const ref_assetName = IDENTIFICATION_TKN;
    const karbonAsset = { [IDENTIFICATION_PID + fromText(ref_assetName)]: 1n };

    const configValidator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.ConfigDatumHolder, [
        IDENTIFICATION_PID as string,
      ]),
    };
    const configAddress = validatorToAddress(
      lucid.config().network as Network,
      configValidator
    );
    const daoValidator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.Dao, [IDENTIFICATION_PID as string]),
    };
    const daoPolicyId = mintingPolicyToId(daoValidator);
    const assetClass: AssetClass = configParams?.fees_asset_class || {
      policy_id: "",
      asset_name: fromText(""),
    };
    const datum: ConfigDatum = {
      fees_address: configParams.fees_address,
      fees_amount: configParams.fees_amount,
      fees_asset_class: assetClass,
      spend_address: configParams.spend_address,
      categories: configParams.categories,
      multisig_validator_group: configParams.multisig_validator_group,
      multisig_refutxoupdate: configParams.multisig_refutxoupdate,
      cet_policyid: IDENTIFICATION_PID,
      cot_policyId: IDENTIFICATION_PID,
      dao_policyid: daoPolicyId,
    };

    const tx = await lucid
      .newTx()
      .pay.ToAddressWithData(
        configAddress,
        { kind: "inline", value: Data.to(datum, ConfigDatum) },
        { lovelace: 5_000_000n, ...karbonAsset }
      )
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();

    handleSuccess(txHash);
    return txHash;
  } catch (e) {
    return handleError(e);
  }
}

export async function SubmitProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address,
  action: ProposalAction
): Promise<string> {
  try {
    if (!lucid || !proposalId || !address) {
      throw new Error("Lucid, proposal, or address is not defined.");
    }
    const validator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.Dao, [IDENTIFICATION_PID as PolicyId]), // config_nft
    };
    const policyId = mintingPolicyToId(validator);
    const validatorAddress = validatorToAddress(
      lucid.config().network as Network,
      validator
    );
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
    // console.log(emulator.now(), proposalStart);
    const proposalEnd = proposalStart + BigInt(30 * 60 * 1000); //(60 * 60 * 24 * 30 * 1000); // 30 days //(180 * 1000); //
    const configDatum = await refConfigDatum(lucid);
    const votes_var: VotesArray = Array.from(
      configDatum.multisig_refutxoupdate.signers
    ).map((signer) => {
      const voter: { voter: string; vote: Vote } = {
        voter: signer,
        vote: "Pending",
      };
      return voter;
    });
    const datum: GovernanceDatum = {
      proposal_id: fromText(proposalId),
      submitted_by: paymentCredentialOf(address).hash,
      proposal_action: action,
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
        validatorAddress,
        { kind: "inline", value: Data.to(datum, GovernanceDatum) },
        { lovelace: 1n, ...proposalAsset }
      )
      .attach.MintingPolicy(validator)
      .addSigner(address)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();

    handleSuccess(txHash);
    return txHash;
  } catch (e) {
    return handleError(e);
  }
}

export async function VoteProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address,
  vote: Vote
) {
  try {
    const date = await blockfrost.getLatestTime();
    const validator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.Dao, [IDENTIFICATION_PID as PolicyId]), // config_nft
    };
    const policyId = mintingPolicyToId(validator);
    const validatorAddress = validatorToAddress(
      lucid.config().network as Network,
      validator
    );
    // mintingPolicyToId()
    const proposalAsset = { [policyId + fromText(proposalId)]: 1n };
    const configDatumUtxo = await refConfigUtxo(lucid);
    const redeemer: GovernanceRedeemer = {
      VoteProposal: {
        proposal_id: fromText(proposalId),
        vote,
        voter: paymentCredentialOf(address).hash,
      },
    };
    const unit = policyId + fromText(proposalId);
    const proposalUTXO = await lucid.utxoByUnit(unit);
    const data = await lucid.datumOf(proposalUTXO);
    const oldDatum = Data.castFrom(data, GovernanceDatum);
    const updatedVotes = oldDatum.votes.map((voterEntry) =>
      voterEntry.voter === paymentCredentialOf(address).hash
        ? { ...voterEntry, vote }
        : voterEntry
    );
    const datum: GovernanceDatum = {
      ...oldDatum,
      votes: updatedVotes,
      votes_count: {
        yes:
          vote === "Yes"
            ? oldDatum.votes_count.yes + 1n
            : oldDatum.votes_count.yes,
        no:
          vote === "No"
            ? oldDatum.votes_count.no + 1n
            : oldDatum.votes_count.no,
        abstain:
          vote === "Abstain"
            ? oldDatum.votes_count.abstain + 1n
            : oldDatum.votes_count.abstain,
      },
    };

    const tx = await lucid
      .newTx()
      .readFrom([configDatumUtxo])
      .collectFrom([proposalUTXO], Data.to(redeemer, GovernanceRedeemer))
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: Data.to(datum, GovernanceDatum) },
        { lovelace: 1n, ...proposalAsset }
      )
      .attach.MintingPolicy(validator)
      .validFrom(date)
      .validTo(Number(oldDatum.deadline.end) - 10000)
      .addSigner(address)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    handleSuccess(txHash);
    return txHash;
  } catch (e) {
    return handleError(e);
  }
}

export async function ExecuteProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address
) {
  try {
    const date = await blockfrost.getLatestTime();
    const ref_assetName = IDENTIFICATION_TKN;
    const karbonAsset = { [IDENTIFICATION_PID + fromText(ref_assetName)]: 1n };
    const configValidator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.ConfigDatumHolder, [
        IDENTIFICATION_PID as PolicyId,
      ]),
    };
    const configAddress = validatorToAddress(
      lucid.config().network as Network,
      configValidator
    );
    const validator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.Dao, [IDENTIFICATION_PID as PolicyId]), // config_nft
    };
    const policyId = mintingPolicyToId(validator);
    const validatorAddress = validatorToAddress(
      lucid.config().network as Network,
      validator
    );
    // mintingPolicyToId()
    const proposalAsset = { [policyId + fromText(proposalId)]: 1n };
    const configDatumUtxo = await refConfigUtxo(lucid);
    const oldConfigDatum = await refConfigDatum(lucid);
    const configRedeemer = fromText(proposalId);
    const redeemer: GovernanceRedeemer = {
      ExecuteProposal: {
        proposal_id: fromText(proposalId),
      },
    };
    const unit = policyId + fromText(proposalId);
    const proposalUTXO = await lucid.utxoByUnit(unit);

    const data = await lucid.datumOf(proposalUTXO);
    const oldDatum = Data.castFrom(data, GovernanceDatum);
    const datum: GovernanceDatum = {
      ...oldDatum,
      proposal_state: "Executed",
    };

    const action = datum.proposal_action;
    const updatedConfigDatum: ConfigDatum = {
      ...oldConfigDatum,
      fees_amount:
        "FeeAmountUpdate" in action
          ? action.FeeAmountUpdate[0]
          : oldConfigDatum.fees_amount,
      fees_address:
        "FeeAddressUpdate" in action
          ? (action.FeeAddressUpdate[0] as unknown as Wallet)
          : oldConfigDatum.fees_address,
      multisig_validator_group:
        "ValidatorAdd" in action
          ? {
              ...oldConfigDatum.multisig_validator_group,
              signers: [
                ...oldConfigDatum.multisig_validator_group.signers,
                action.ValidatorAdd[0],
              ],
            }
          : "ValidatorRemove" in action
          ? {
              ...oldConfigDatum.multisig_validator_group,
              signers: oldConfigDatum.multisig_validator_group.signers.filter(
                (signer) => signer !== action.ValidatorRemove[0]
              ),
            }
          : oldConfigDatum.multisig_validator_group,
    };

    const tx = await lucid
      .newTx()
      .collectFrom([configDatumUtxo], Data.to(configRedeemer))
      .collectFrom([proposalUTXO], Data.to(redeemer, GovernanceRedeemer))
      .pay.ToContract(
        configAddress,
        { kind: "inline", value: Data.to(updatedConfigDatum, ConfigDatum) },
        { lovelace: 1n, ...karbonAsset }
      )
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: Data.to(datum, GovernanceDatum) },
        { lovelace: 1n, ...proposalAsset }
      )
      .attach.SpendingValidator(configValidator)
      .attach.SpendingValidator(validator)
      .validFrom(date) //exclusivity onchain
      .addSigner(address)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();

    handleSuccess(txHash);
    return txHash;
  } catch (e) {
    return handleError(e);
  }
}

export async function RejectProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address
) {
  try {
    const date = await blockfrost.getLatestTime();
    const validator: Validator = {
      type: "PlutusV3",
      script: applyParamsToScript(script.Dao, [IDENTIFICATION_PID as PolicyId]), // config_nft
    };
    const policyId = mintingPolicyToId(validator);
    const validatorAddress = validatorToAddress(
      lucid.config().network as Network,
      validator
    );
    // mintingPolicyToId()
    const proposalAsset = { [policyId + fromText(proposalId)]: 1n };
    const redeemer: GovernanceRedeemer = {
      RejectProposal: {
        proposal_id: fromText(proposalId),
      },
    };
    const unit = policyId + fromText(proposalId);
    const proposalUTXO = await lucid.utxoByUnit(unit);

    const data = await lucid.datumOf(proposalUTXO);
    const oldDatum = Data.castFrom(data, GovernanceDatum);
    const datum: GovernanceDatum = {
      ...oldDatum,
      proposal_state: "Rejected",
    };

    const tx = await lucid
      .newTx()
      .collectFrom([proposalUTXO], Data.to(redeemer, GovernanceRedeemer))
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: Data.to(datum, GovernanceDatum) },
        { lovelace: 1n, ...proposalAsset }
      )
      .attach.SpendingValidator(validator)
      .validFrom(date)
      .addSigner(address)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();

    handleSuccess(txHash);
    return txHash;
  } catch (e) {
    return handleError(e);
  }
}
