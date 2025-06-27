import { useCardano } from "@/context/CardanoContext";
import {
  ExecuteProposal,
  RejectProposal,
  SubmitProposal,
  VoteProposal,
} from "@/lib/cardano/transactions";
import type { ProposalAction, Vote } from "@/types/Utils";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export function DaoTxButton({
  name,
  color,
  proposalType,
  proposalId,
  action,
  actionAddress,
  actionAmount,
  vote,
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
}) {
  const { address, lucid } = useCardano();
  const [submitting, setSubmitting] = useState(false);

  async function ProposalTx() {
    if (!address || !lucid || !proposalId) {
      console.log("Values Missing (Address, Lucid, ProposalId)");
      return;
    }
    setSubmitting(true);

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

      await SubmitProposal(lucid, proposalId, address, proposalAction);
    } else if (proposalType === "Vote") {
      if (!vote) {
        console.log("Select vote");
        return;
      }
      await VoteProposal(lucid, proposalId, address, vote);
    } else if (proposalType === "Execute") {
      await ExecuteProposal(lucid, proposalId, address);
    } else if (proposalType === "Reject") {
      await RejectProposal(lucid, proposalId, address);
    }
    setSubmitting(false);
  }

  return (
    <Button
      className={`bg-${color}-700 p-3 rounded-lg hover:bg-${color}-800`}
      onClick={ProposalTx}
      disabled={
        submitting ||
        !lucid ||
        !address ||
        !proposalId ||
        (proposalType === "Vote" && !vote) ||
        (proposalType === "Submit" && !action)
      }
    >
      {submitting && <LoaderCircle className="animate-spin" />}
      {name}
    </Button>
  );
}
