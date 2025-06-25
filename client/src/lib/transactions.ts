import {
  applyParamsToScript,
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  slotToUnixTime,
  stakeCredentialOf,
  validatorToAddress,
  type Address,
  type LucidEvolution,
  type Network,
  type PolicyId,
  type Validator,
} from "@lucid-evolution/lucid";
import { script } from "../config/script";
import { Action, GovernanceRedeemer } from "../types/Redeemer";
import { ConfigDatum, GovernanceDatum } from "../types/Datum";
import {
  CATEGORIES,
  IDENTIFICATION_PID,
  IDENTIFICATION_TKN,
} from "../config/constants";
import {
  Vote,
  VotesArray,
  type AssetClass,
  type Multisig,
} from "../types/Utils";
import { refConfigDatum, refConfigUtxo } from "./utils";

export async function MintIdentificationToken(
  lucid: LucidEvolution,
  address: Address
) {
  const utxos = await lucid.utxosAt(address);
  const orefHash = String(utxos[0].txHash);
  const orefIndex = BigInt(utxos[0].outputIndex);
  const oref = new Constr(0, [orefHash, orefIndex]);
  console.log(oref);
  const mintingValidator: Validator = {
    type: "PlutusV3",
    script: applyParamsToScript(script.IdentificationNft, [oref]),
  };
  const policyID = mintingPolicyToId(mintingValidator);
  const ref_assetName = IDENTIFICATION_TKN;
  const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n };
  const mint: Action = "Mint";
  const redeemer = Data.to(mint, Action);
  console.log(redeemer, mintedAssets);
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
  return txHash;
}

export async function AttachConfigDatum(lucid: LucidEvolution) {
  // try {
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
  const daoValidator: Validator = {
    type: "PlutusV3",
    script: applyParamsToScript(script.Dao, [IDENTIFICATION_PID as PolicyId]),
  };
  const daoPolicyId = mintingPolicyToId(daoValidator);
  const assestClass: AssetClass = {
    policy_id: "",
    asset_name: fromText(""),
  };
  const signer: Multisig = {
    required: 3n,
    signers: [
      paymentCredentialOf(
        "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
      ).hash,
      paymentCredentialOf(
        "addr_test1qppjp6z53cr6axg59ezf93vlcqqva7wg6d5zfxr5fctnsuveaxzar94mukjwdp323ahhs3tsn0nmawextjtkfztcs20q6fmam2"
      ).hash,
      paymentCredentialOf(
        "addr_test1qzzxrfxg6hq8zerw8g85cvcpxutjtgez5v75rs99kdnn404cfuf2xydw2zrehxmvd3k9nqywe3d6mn64a08ncc5h5s3qd5ewlk"
      ).hash,
      paymentCredentialOf(
        "addr_test1qr3deh8jxn9ejxmuunv6krgtt6q600tt289pkdhg0vrfcvvrm9x488u4tefkkjay9k49yvdwc459uxc2064eulk2raaqjzwsv3"
      ).hash,
      paymentCredentialOf(
        "addr_test1qzs3pj8vvkhu8d7g0p3sfj8896wds459gqcdes04c5fp7pcs2k7ckl5mly9f89s6zpnx9av7qnl59edp0jy2ac6twtmss44zee"
      ).hash,
    ],
  };
  // scriptHashToCredential
  const datum: ConfigDatum = {
    fees_address: {
      pkh: paymentCredentialOf(
        "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
      ).hash,
      sc: stakeCredentialOf(
        "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
      ).hash,
    },
    fees_amount: 100_000_000n,
    fees_asset_class: assestClass,
    spend_address: {
      pkh: paymentCredentialOf(
        "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
      ).hash,
      sc: "",
    }, // need verification form sourabh (how to pass address directly?)
    categories: CATEGORIES.map((category) => fromText(category)),
    multisig_validator_group: signer,
    multisig_refutxoupdate: signer,
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

  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();
  console.log("-------ConfigDatum__Deposite------------");
  console.log(configAddress);
  return txHash;
  // } catch (error) {
  //   console.log(error);
  // }
}

export async function SubmitProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address
): Promise<string> {
  if (!lucid || !proposalId || !address) {
    throw new Error("Lucid, proposal, or address is not defined.");
  }
  const configValidator: Validator = {
    type: "PlutusV3",
    script: script.ConfigDatumHolder,
  };
  const configPolicyId = mintingPolicyToId(configValidator);
  const validator: Validator = {
    type: "PlutusV3",
    script: applyParamsToScript(script.Dao, [configPolicyId]), // config_nft
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
  const proposalEnd = proposalStart + BigInt(60 * 60 * 24 * 30 * 1000); // 30 days
  const configDatum = await refConfigDatum(lucid);
  const votes_var: VotesArray = Array.from(
    configDatum.multisig_validator_group.signers
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
      validatorAddress,
      { kind: "inline", value: Data.to(datum, GovernanceDatum) },
      { lovelace: 1n, ...proposalAsset }
    )
    .attach.MintingPolicy(validator)
    .addSigner(address)
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  return txHash;
}

export async function VoteProposal(
  lucid: LucidEvolution,
  proposalId: string,
  address: Address,
  vote: Vote
) {
  const configValidator: Validator = {
    type: "PlutusV3",
    script: script.ConfigDatumHolder,
  };
  const configPolicyId = mintingPolicyToId(configValidator);
  const validator: Validator = {
    type: "PlutusV3",
    script: applyParamsToScript(script.Dao, [configPolicyId]), // config_nft
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
        vote === "No" ? oldDatum.votes_count.no + 1n : oldDatum.votes_count.no,
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
    .addSigner(address)
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  return txHash;
}
