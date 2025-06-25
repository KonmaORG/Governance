import { Data, fromText } from "@lucid-evolution/lucid";
import { GovernanceDatum } from "./Datum";
import {
  Moment,
  ProposalAction,
  ProposalState,
  VotesArray,
  VotesCount,
} from "./Utils";
import { GovernanceRedeemer } from "./Redeemer";

const proposalId = fromText("1");
const pkh1_hex = "a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3d0d1d2d3";
const pkh2_hex = "e0e1e2e3e4e5e6e7e8e9f0f1f2f3f4f5f6f7f8f9a0a1a2a3b0b1b2b3";

const votes_var: VotesArray = [
  { voter: pkh2_hex, vote: "Pending" },
  { voter: pkh1_hex, vote: "Pending" },
];
// Datum----------
const datum: GovernanceDatum = {
  proposal_id: proposalId,
  submitted_by: pkh1_hex,
  proposal_action: { FeeAmountUpdate: [1000n] },
  votes: votes_var,
  votes_count: { yes: 0n, no: 0n, abstain: 0n },
  deadline: { start: 0n, end: 0n },
  proposal_state: "InProgress",
};
// Redeemer----------
const submitProposal: GovernanceRedeemer = {
  SubmitProposal: {
    proposal_id: proposalId,
  },
};
const voteProposal: GovernanceRedeemer = {
  VoteProposal: {
    proposal_id: proposalId,
    voter: pkh2_hex,
    vote: "Yes",
  },
};
const executeProposal: GovernanceRedeemer = {
  ExecuteProposal: {
    proposal_id: proposalId,
  },
};
const rejectProposal: GovernanceRedeemer = {
  RejectProposal: {
    proposal_id: proposalId,
  },
};

export function datumData() {
  console.clear();
  console.log(
    "\n ------------------------DATUM------------------------\n",
    "datum",
    Data.to(datum, GovernanceDatum).toUpperCase(),
    "\n proposal_id",
    Data.to(datum.proposal_id).toUpperCase(),
    "\n submitted_by",
    Data.to(datum.submitted_by).toUpperCase(),
    "\n proposal_action",
    Data.to(datum.proposal_action, ProposalAction).toUpperCase(),
    "\n votes",
    Data.to(votes_var, VotesArray).toUpperCase(),
    "\n votes_count",
    Data.to(datum.votes_count, VotesCount).toUpperCase(),
    "\n deadline",
    Data.to(datum.deadline, Moment).toUpperCase(),
    "\n proposal_state",
    Data.to(datum.proposal_state, ProposalState).toUpperCase(),
    "\n ------------------------REDEEMER------------------------\n",
    "submitProposal",
    Data.to(submitProposal, GovernanceRedeemer).toUpperCase(),
    "\n voteProposal",
    Data.to(voteProposal, GovernanceRedeemer).toUpperCase(),
    "\n executeProposal",
    Data.to(executeProposal, GovernanceRedeemer).toUpperCase(),
    "\n rejectProposal",
    Data.to(rejectProposal, GovernanceRedeemer).toUpperCase()
  );
}
