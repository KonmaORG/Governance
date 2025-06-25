import { Data } from "@lucid-evolution/lucid";
import { VoteSchema, Voter } from "./Utils.js";

export const ActionSchema = Data.Enum([
  Data.Literal("Mint"),
  Data.Literal("Burn"),
]);
export type Action = Data.Static<typeof ActionSchema>;
export const Action = ActionSchema as unknown as Action;
// Governance ---
export const GovernanceRedeemerSchema = Data.Enum([
  // SubmitProposal { proposal_id: ByteArray }
  Data.Object({
    SubmitProposal: Data.Object({
      proposal_id: Data.Bytes(),
    }),
  }),
  // VoteProposal { proposal_id: ByteArray, voter: Voter, vote: Vote }
  Data.Object({
    VoteProposal: Data.Object({
      proposal_id: Data.Bytes(),
      voter: Voter,
      vote: VoteSchema,
    }),
  }),
  // ExecuteProposal { proposal_id: ByteArray }
  Data.Object({
    ExecuteProposal: Data.Object({
      proposal_id: Data.Bytes(),
    }),
  }),
  // RejectProposal { proposal_id: ByteArray }
  Data.Object({
    RejectProposal: Data.Object({
      proposal_id: Data.Bytes(),
    }),
  }),
]);

export type GovernanceRedeemer = Data.Static<typeof GovernanceRedeemerSchema>;
export const GovernanceRedeemer =
  GovernanceRedeemerSchema as unknown as GovernanceRedeemer;
