import { Data } from "@lucid-evolution/lucid";

// AssetClass ---
export const AssetClassSchema = Data.Object({
  policy_id: Data.Bytes(),
  asset_name: Data.Bytes(),
});

export type AssetClass = Data.Static<typeof AssetClassSchema>;
export const AssetClass = AssetClassSchema as unknown as AssetClass;
// Atleast ---
export const Atleast = Data.Integer();
// Multisig ---
export const MultisigSchema = Data.Object({
  required: Atleast,
  signers: Data.Array(Data.Bytes()),
});
export type Multisig = Data.Static<typeof MultisigSchema>;
export const Multisig = MultisigSchema as unknown as Multisig;
// ProposalState ---
export const ProposalStateSchema = Data.Enum([
  Data.Literal("InProgress"),
  Data.Literal("Executed"),
  Data.Literal("Rejected"),
]);
export type ProposalState = Data.Static<typeof ProposalStateSchema>;
export const ProposalState = ProposalStateSchema as unknown as ProposalState;
// Vote ---
export const VoteSchema = Data.Enum([
  Data.Literal("Yes"),
  Data.Literal("No"),
  Data.Literal("Abstain"),
]);
// Voter ---
export const Voter = Data.Bytes();
// votesCount ---
export const VotesCountSchema = Data.Object({
  yes: Data.Integer(),
  no: Data.Integer(),
  abstain: Data.Integer(),
});
export type VotesCount = Data.Static<typeof VotesCountSchema>;
export const VotesCount = VotesCountSchema as unknown as VotesCount;
//  Votes ---
export const VotesSchema = Data.Object({
  voter: Voter,
  vote: VoteSchema,
});
export type Votes = Data.Static<typeof VotesSchema>;
export const Votes = VotesSchema as unknown as Votes;
// ProposalAction ---
export const ProposalActionSchema = Data.Enum([
  Data.Object({
    ValidatorAdd: Data.Tuple([Data.Bytes()]),
  }),
  Data.Object({
    ValidatorRemove: Data.Tuple([Data.Bytes()]),
  }),
  Data.Object({
    FeeAmountUpdate: Data.Tuple([Data.Integer()]),
  }),
  Data.Object({
    FeeAddressUpdate: Data.Tuple([Data.Bytes()]),
  }),
]);
export type ProposalAction = Data.Static<typeof ProposalActionSchema>;
export const ProposalAction = ProposalActionSchema as unknown as ProposalAction;

// Moment ---
export const MomentSchema = Data.Object({
  start: Data.Integer(),
  end: Data.Integer(),
});
export type Moment = Data.Static<typeof MomentSchema>;
export const Moment = MomentSchema as unknown as Moment;
