use aiken/collection/dict
use cardano/address.{Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{
  InlineDatum, OutputReference, Transaction, find_input, find_script_outputs,
}
use types.{
  Abstain, ExecuteProposal, GovernanceDatum, GovernanceRedeemer, InProgess, No,
  Pending, RejectProposal, Rejected, SubmitProposal, VoteProposal, Yes,
}
use types/moment
use utils

/// A validator for managing DAO proposals.
/// This script controls the lifecycle of a proposal, including voting and resolution.
///
/// # Parameters
/// * `config_nft` - The PolicyId of the configuration NFT. Note: This is not currently used in the spend validator.
validator dao(_config_nft: PolicyId) {
  /// The `spend` validator logic is triggered when a UTxO locked by this script is spent.
  /// It handles actions like voting on proposals and rejecting failed proposals.
  spend(
    datum: Option<Data>,
    redeemer: GovernanceRedeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    when datum is {
      Some(data) -> {
        let datum = utils.governance_datum_from_data(data)

        // The script requires that the proposal UTxO be spent and a new one created
        // in the same transaction, carrying forward the updated state.
        // Find the script's own hash to locate the continuing output.
        let self_hash = {
          expect Some(input) = find_input(tx.inputs, oref)
          expect Script(script_hash) = input.output.address.payment_credential
          script_hash
        }

        // Expect exactly one output to be sent back to the script address.
        let self_output = {
          expect [output] = find_script_outputs(tx.outputs, self_hash)
          output
        }

        // Decode the datum from the continuing output.
        let self_output_datum = {
          expect InlineDatum(data) = self_output.datum
          utils.governance_datum_from_data(data)
        }

        // Handle actions based on the provided redeemer.
        when redeemer is {
          // Proposal submission is not handled by this spend validator.
          // It's handled by a minting policy that creates the initial proposal UTxO.
          SubmitProposal { .. } ->
            fail @"Invalid Redeemer: Proposal submission not allowed"
          // 1. The proposal ID must remain unchanged.
          // 2. The proposal must be in the 'InProgress' state to allow voting.
          // 3. The vote must be cast before the proposal's deadline.
          // 4. The voter must be in the list of eligible voters.
          // 5. The voter must not have already voted (their status must be 'Pending').
          // 6. The output datum must correctly reflect the new vote cast by the voter.
          // 7. The proposal state must remain 'InProgress' after the vote.
          // 8. The relevant vote count must be incremented by exactly one.
          VoteProposal { proposal_id, voter, vote } -> and {
              proposal_id == self_output_datum.proposal_id,
              datum.proposal_state == InProgess,
              moment.is_contained(datum.deadline, tx.validity_range),
              dict.has_key(datum.votes, voter),
              Some(Pending) == dict.get(datum.votes, voter),
              Some(vote) == dict.get(self_output_datum.votes, voter),
              self_output_datum.proposal_state == InProgess,
              when vote is {
                Yes ->
                  datum.votes_count.yes + 1 == self_output_datum.votes_count.yes
                No ->
                  datum.votes_count.no + 1 == self_output_datum.votes_count.no
                Abstain ->
                  datum.votes_count.abstain + 1 == self_output_datum.votes_count.abstain
                _ -> fail @"Invalid Vote type"
              },
            }

          // Proposal execution is not yet implemented.
          // finds address of the configDatum holder using config_nft
          // finds the script output using above address
          // match the datum from config_nft and the new datum that is sent to configDatum
          // the match is done based on the ProposalAction. if its `feesupdate` then we update config_nftDatum's fees field and compare it to the OutputConfigDatum
          ExecuteProposal { .. } -> fail @"Execute not implemented"

          // 1. The proposal ID must match.
          // 2. The proposal must currently be 'InProgress'.
          // 3. The transaction must be after the voting deadline.
          // 4. The number of 'No' votes must be strictly greater than 'Yes' votes.
          // 5. The final state of the proposal in the output datum must be 'Rejected'.
          RejectProposal { proposal_id } -> and {
              proposal_id == self_output_datum.proposal_id,
              datum.proposal_state == InProgess,
              moment.is_after(datum.deadline, tx.validity_range),
              datum.votes_count.no > datum.votes_count.yes,
              self_output_datum.proposal_state == Rejected,
            }
        }
      }
      None -> fail @"Datum is required"
    }
  }

  else(_) {
    fail @"Invalid transaction type"
  }
}
