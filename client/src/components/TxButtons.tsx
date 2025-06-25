import { useState } from "react";
import { useCardano } from "../context/CardanoContext";
import {
  AttachConfigDatum,
  MintIdentificationToken,
  SubmitProposal,
} from "../lib/transactions";

export default function TxButtons() {
  const { address, lucid } = useCardano();
  const [proposalId, setProposalId] = useState<string>("");
  const [result, setResult] = useState<string>("");
  async function ProposalTx(
    proposalType: "Submit" | "Vote" | "Execute" | "Reject"
  ) {
    if (!address || !lucid || !proposalId) {
      console.log("Values Missing (Address, Lucid, ProposalId)");
      return;
    }
    if (proposalType === "Submit") {
      SubmitProposal(lucid, proposalId, address);
    } else if (proposalType === "Vote") {
      console.log(`Executing ${proposalType} Proposal Transaction...`);
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
      <input
        type="text"
        placeholder="Proposal ID"
        className="p-3 rounded-lg border-2 border-green-700"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
      />
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
      <div className="flex gap-2 ">
        <button
          onClick={() => ProposalTx("Submit")}
          className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
        >
          SubmitProposal
        </button>
        <button
          onClick={() => ProposalTx("Vote")}
          className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
        >
          VoteProposal
        </button>
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
