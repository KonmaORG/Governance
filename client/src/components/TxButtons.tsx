import { useState } from "react";
import { useCardano } from "@/context/CardanoContext";
import type { Vote } from "@/types/Utils";
import { DaoTxButton } from "./buttons/DAO";
import { MintIdentificationButton } from "./buttons/identification";
import { AttachConfigButton } from "./buttons/configDatum";

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
  const [actionAddress, setActionAddress] = useState<string>("");
  const [actionAmount, setActionAmount] = useState<string>("");

  return (
    <>
      <div className="flex gap-2">
        <MintIdentificationButton
          name="Identification tk"
          color="blue"
          lucid={lucid}
          address={address}
          setResult={setResult}
        />
        <AttachConfigButton
          name="Attach Config Datum"
          color="blue"
          lucid={lucid}
          address={address}
          setResult={setResult}
        />
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
        <DaoTxButton
          name="SubmitProposal"
          color="green"
          proposalType="Submit"
          proposalId={proposalId}
          action={action}
          actionAddress={actionAddress}
          actionAmount={actionAmount}
          vote={vote}
          setResult={setResult}
        />
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
          <DaoTxButton
            name="VoteProposal"
            color="green"
            proposalType="Vote"
            proposalId={proposalId}
            action={action}
            actionAddress={actionAddress}
            actionAmount={actionAmount}
            vote={vote}
            setResult={setResult}
          />
        </div>
        <DaoTxButton
          name="ExecuteProposal"
          color="green"
          proposalType="Execute"
          proposalId={proposalId}
          action={action}
          actionAddress={actionAddress}
          actionAmount={actionAmount}
          vote={vote}
          setResult={setResult}
        />
        <DaoTxButton
          name="RejectProposal"
          color="green"
          proposalType="Reject"
          proposalId={proposalId}
          action={action}
          actionAddress={actionAddress}
          actionAmount={actionAmount}
          vote={vote}
          setResult={setResult}
        />
      </div>
      <p>{result && "result, " + result}</p>
    </>
  );
}
