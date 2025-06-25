import { useState } from "react";
import { useCardano } from "../context/CardanoContext";
import {
  AttachConfigDatum,
  MintIdentificationToken,
  SubmitProposal,
  VoteProposal,
} from "../lib/transactions";
import type { ProposalAction, Vote } from "../types/Utils";

export default function TxButtons() {
  const { address, lucid } = useCardano();
  const [proposalId, setProposalId] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [vote, setVote] = useState<Vote | null>(null);
  const [action, setAction] = useState<ProposalAction | null>(null);
  async function ProposalTx(
    proposalType: "Submit" | "Vote" | "Execute" | "Reject"
  ) {
    if (!address || !lucid || !proposalId) {
      console.log("Values Missing (Address, Lucid, ProposalId)");
      return;
    }
    if (proposalType === "Submit") {
      if (!action) {
        console.log("select action");
        return;
      }
      const result = await SubmitProposal(lucid, proposalId, address, action);
      setResult(result);
    } else if (proposalType === "Vote") {
      if (!vote) {
        console.log("select vote");
        return;
      }
      const result = await VoteProposal(lucid, proposalId, address, vote);
      setResult(result);
    } else if (proposalType === "Execute") {
      console.log(`Executing ${proposalType} Proposal Transaction...`);
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
      setAction
      <div className="flex gap-2 ">
        <button
          onClick={() => ProposalTx("Submit")}
          className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
        >
          SubmitProposal
        </button>
        <div className="flex flex-col">
          <select
            value={vote as string}
            onChange={(e) => setVote(e.target.value as Vote)}
            className="text-black bg-green-800"
          >
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
