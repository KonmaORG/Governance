import { Data } from "@lucid-evolution/lucid";
import {
  AssetClassSchema,
  MomentSchema,
  MultisigSchema,
  ProposalActionSchema,
  ProposalStateSchema,
  Voter,
  VotesCountSchema,
  VotesSchema,
} from "./Utils";

export const ConfigDatumSchema = Data.Object({
  fees_address: Data.Bytes(),
  fees_amount: Data.Integer(),
  fees_asset_class: AssetClassSchema,
  spend_address: Data.Bytes(),
  categories: Data.Array(Data.Bytes()),
  multisig_validator_group: MultisigSchema,
  multisig_refutxoupdate: MultisigSchema,
  cet_policyid: Data.Bytes(),
  cot_policyId: Data.Bytes(),
  dao_policyid: Data.Bytes(),
});
export type ConfigDatum = Data.Static<typeof ConfigDatumSchema>;
export const ConfigDatum = ConfigDatumSchema as unknown as ConfigDatum;
// GovernanceDatumSchema
export const GovernanceDatumSchema = Data.Object({
  proposal_id: Data.Bytes(),
  submitted_by: Voter,
  proposal_action: ProposalActionSchema,
  votes: VotesSchema,
  votes_count: VotesCountSchema,
  deadline: MomentSchema,
  proposal_state: ProposalStateSchema,
});
export type GovernanceDatum = Data.Static<typeof GovernanceDatumSchema>;
export const GovernanceDatum =
  GovernanceDatumSchema as unknown as GovernanceDatum;
