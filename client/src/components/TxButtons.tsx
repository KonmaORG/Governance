import { useState } from "react";
import { useCardano } from "../context/CardanoContext";
import {
  AttachConfigDatum,
  ExecuteProposal,
  MintIdentificationToken,
  SubmitProposal,
  VoteProposal,
} from "../lib/transactions";
import type { ProposalAction, Vote } from "../types/Utils";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";

export default function TxButtons() {
  const { address, lucid } = useCardano();
  const [proposalId, setProposalId] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [vote, setVote] = useState<Vote | null>(null);
  const [action, setAction] = useState<
    | "ValidatorAdd"
    | "ValidatorRemove"
    | "FeeAmountUpdate"
    | "FeeAddressUpdate"
    | null
  >(null);
  const [actionAddress, setActionAddress] = useState<string>(""); // Store the address input
  const [actionAmount, setActionAmount] = useState<string>(""); // Store amount for FeeAmountUpdate

  async function ProposalTx(
    proposalType: "Submit" | "Vote" | "Execute" | "Reject"
  ) {
    if (!address || !lucid || !proposalId) {
      console.log("Values Missing (Address, Lucid, ProposalId)");
      return;
    }

    if (proposalType === "Submit") {
      if (!action) {
        console.log("Select action");
        return;
      }

      let proposalAction: ProposalAction;
      switch (action) {
        case "ValidatorAdd":
          if (!actionAddress) {
            console.log("Address is required");
            return;
          }
          try {
            const pkh = paymentCredentialOf(actionAddress).hash;
            proposalAction = { [action]: [pkh] };
          } catch (error) {
            console.log("Invalid address for PKH derivation");
            return;
          }
          break;
        case "ValidatorRemove":
          if (!actionAddress) {
            console.log("Address is required");
            return;
          }
          try {
            const pkh = paymentCredentialOf(actionAddress).hash;
            proposalAction = { [action]: [pkh] };
          } catch (error) {
            console.log("Invalid address for PKH derivation");
            return;
          }
          break;
        case "FeeAmountUpdate":
          if (!actionAmount) {
            console.log("Amount is required");
            return;
          }
          proposalAction = { [action]: [BigInt(actionAmount)] };
          break;
        case "FeeAddressUpdate":
          if (!actionAddress) {
            console.log("Address is required");
            return;
          }
          try {
            const pkh = paymentCredentialOf(actionAddress).hash;
            const sc = stakeCredentialOf(actionAddress)?.hash;
            if (!sc) {
              console.log("Stake credential is required for FeeAddressUpdate");
              return;
            }
            proposalAction = { [action]: [{ pkh, sc }] };
          } catch (error) {
            console.log("Invalid address for PKH/SC derivation");
            return;
          }
          break;
        default:
          console.log("Invalid action");
          return;
      }

      const result = await SubmitProposal(
        lucid,
        proposalId,
        address,
        proposalAction
      );
      setResult(result);
    } else if (proposalType === "Vote") {
      if (!vote) {
        console.log("Select vote");
        return;
      }
      const result = await VoteProposal(lucid, proposalId, address, vote);
      setResult(result);
    } else if (proposalType === "Execute") {
      const result = await ExecuteProposal(lucid, proposalId, address);
      setResult(result);
    } else if (proposalType === "Reject") {
      console.log(`Executing ${proposalType} Proposal Transaction...`);
    } else {
      console.log(`Invalid Proposal Transaction Type...`);
    }
  }

  async function mintIdentificationToken() {
    if (!lucid || !address) return;
    const result = await MintIdentificationToken(lucid, address);
    setResult(result);
  }

  async function attachConfigDatum() {
    if (!lucid || !address) return;
    const result = await AttachConfigDatum(lucid);
    setResult(result);
  }
  console.log(
    paymentCredentialOf(
      "addr_test1wr9zgr9sn2wzrk85fz4qaprwtsnhnl9dxdk8hfssxl9rhmggg3n9m"
    ).hash
  );
  return (
    <>
      <div className="flex gap-2">
        <button
          className="bg-blue-700 p-3 rounded-lg disabled:bg-blue-800"
          onClick={mintIdentificationToken}
        >
          Identification tk
        </button>
        <button
          className="bg-blue-700 p-3 rounded-lg disabled:bg-blue-800"
          onClick={attachConfigDatum}
        >
          Attach Config Datum
        </button>
      </div>
      <input
        type="text"
        placeholder="Proposal ID"
        className="p-3 rounded-lg border-2 border-green-700"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <select
          value={action || ""}
          onChange={(e) =>
            setAction(
              e.target.value as
                | "ValidatorAdd"
                | "ValidatorRemove"
                | "FeeAmountUpdate"
                | "FeeAddressUpdate"
                | null
            )
          }
          className="text-black bg-green-800 p-2 rounded-lg"
        >
          <option value="">Select Action</option>
          <option value="ValidatorAdd">Validator Add</option>
          <option value="ValidatorRemove">Validator Remove</option>
          <option value="FeeAmountUpdate">Fee Amount Update</option>
          <option value="FeeAddressUpdate">Fee Address Update</option>
        </select>

        {(action === "ValidatorAdd" ||
          action === "ValidatorRemove" ||
          action === "FeeAddressUpdate") && (
          <input
            type="text"
            placeholder="Address"
            className="p-3 rounded-lg border-2 border-green-700"
            value={actionAddress}
            onChange={(e) => setActionAddress(e.target.value)}
          />
        )}

        {action === "FeeAmountUpdate" && (
          <input
            type="number"
            placeholder="Amount"
            className="p-3 rounded-lg border-2 border-green-700"
            value={actionAmount}
            onChange={(e) => setActionAmount(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => ProposalTx("Submit")}
          className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
        >
          SubmitProposal
        </button>
        <div className="flex flex-col">
          <select
            value={vote || ""}
            onChange={(e) => setVote(e.target.value as Vote)}
            className="text-black bg-green-800 p-2 rounded-lg"
          >
            <option value="">Select Vote</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Abstain">Abstain</option>
          </select>
          <button
            onClick={() => ProposalTx("Vote")}
            className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
          >
            VoteProposal
          </button>
        </div>
        <button
          onClick={() => ProposalTx("Execute")}
          className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
        >
          ExecuteProposal
        </button>
        <button
          onClick={() => ProposalTx("Reject")}
          className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
        >
          RejectProposal
        </button>
      </div>
      <p>{result && "result, " + result}</p>
    </>
  );
}
