import { useCardano } from "@/context/CardanoContext";
import {
  ExecuteProposal,
  RejectProposal,
  SubmitProposal,
  VoteProposal,
} from "@/lib/transactions";
import type { ProposalAction, Vote } from "@/types/Utils";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";
export function DaoTxButton({
  name,
  color,
  proposalType,
  proposalId,
  action,
  actionAddress,
  actionAmount,
  vote,
  setResult,
}: {
  name: string;
  color: string;
  proposalType: "Submit" | "Vote" | "Execute" | "Reject";
  proposalId: string;
  action:
    | "ValidatorAdd"
    | "ValidatorRemove"
    | "FeeAmountUpdate"
    | "FeeAddressUpdate"
    | null;
  actionAddress: string;
  actionAmount: string;
  vote: Vote | null;
  setResult: (result: string) => void;
}) {
  const { address, lucid } = useCardano();
  async function ProposalTx() {
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
      const result = await RejectProposal(lucid, proposalId, address);
      setResult(result);
    }
  }

  return (
    <button
      className={`bg-${color}-700 p-3 rounded-lg disabled:bg-${color}-800`}
      onClick={ProposalTx}
      disabled={
        !lucid ||
        !address ||
        !proposalId ||
        (proposalType === "Vote" && !vote) ||
        (proposalType === "Submit" && !action)
      }
    >
      {name}
    </button>
  );
}
