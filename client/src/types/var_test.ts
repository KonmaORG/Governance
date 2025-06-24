import { Data, fromText } from "@lucid-evolution/lucid";
import { GovernanceDatum } from "./Datum";
import {
  Moment,
  ProposalAction,
  ProposalState,
  Vote,
  Votes,
  VotesArray,
  VoteSchema,
  VotesCount,
} from "./Utils";

const proposalId = fromText("1");
const pkh1_hex = "a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3d0d1d2d3";
const pkh2_hex = "e0e1e2e3e4e5e6e7e8e9f0f1f2f3f4f5f6f7f8f9a0a1a2a3b0b1b2b3";
const datum: GovernanceDatum = {
  proposal_id: proposalId,
  submitted_by: pkh1_hex,
  proposal_action: { FeeAmountUpdate: [1000n] },
  votes: [
    { voter: pkh2_hex, vote: "Pending" },
    { voter: pkh1_hex, vote: "Pending" },
  ],
  votes_count: { yes: 0n, no: 0n, abstain: 0n },
  deadline: { start: 0n, end: 0n },
  proposal_state: "InProgress",
};
const votes: VotesArray = [
  { voter: pkh2_hex, vote: "Pending" },
  { voter: pkh1_hex, vote: "Pending" },
];

export const datumData = Data.to(votes, VotesArray);
