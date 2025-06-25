import { useState } from "react";
import { useCardano } from "../context/CardanoContext";
import { SubmitProposal } from "../lib/transactions";

export default function TxButtons() {
  const { address, lucid } = useCardano();
  const [proposalId, setProposalId] = useState<string>("");
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
  return (
    <>
      <input
        type="text"
        placeholder="Proposal ID"
        className="p-3 rounded-lg border-2 border-green-700"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
      />
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
    </>
  );
}
