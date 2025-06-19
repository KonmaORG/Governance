use aiken/collection/dict
use cardano/address.{Script}
use cardano/assets.{PolicyId}
// TODO: allow on token holder to create and vote proposal
use cardano/transaction.{
  InlineDatum, OutputReference, Transaction, find_input, find_script_outputs,
}
use types.{
  Abstain, ExecuteProposal, GovernanceDatum, GovernanceRedeemer, InProgess, No,
  Pending, RejectProposal, Rejected, SubmitProposal, VoteProposal, Yes,
}
use types/moment

validator dao(config_nft: PolicyId) {
  spend(
    datum: Option<GovernanceDatum>,
    redeemer: GovernanceRedeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    when datum is {
      Some(datum) -> {
        // finding Script Hash
        expect self_hash = {
          expect Some(input) = find_input(tx.inputs, oref)
          expect Script(script_hash) = input.output.address.payment_credential
          script_hash
        }

        // finding Script Outputs
        let self_output = {
          expect [output] = find_script_outputs(tx.outputs, self_hash)
          output
        }
        let self_output_datum = {
          expect InlineDatum(data) = self_output.datum
          expect GovernanceDatum {
            proposal_id,
            submitted_by,
            proposal_action,
            votes,
            votes_count,
            deadline,
            proposal_state,
          } = data
          GovernanceDatum {
            proposal_id,
            submitted_by,
            proposal_action,
            votes,
            votes_count,
            deadline,
            proposal_state,
          }
        }
        // when condition on Redeemer Action
        when redeemer is {
          SubmitProposal { .. } -> fail @"Invalid Redeemer"
          VoteProposal { proposal_id, voter, vote } ->
            // proposal_id should match
            // voter is in datum.votes && datum.votes.vote=Pending
            // output.datum.votes is == vote
            // votes_count.[vote] = +1
            // should be before deadline
            // proposal_state should be InProgess
            // output datum state should be Inprogress
            and {
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
                _ -> fail @"Invalid Vote"
              },
            }

          ExecuteProposal { proposal_id } -> fail @"execute not implemented"
          RejectProposal { proposal_id } ->
            // proposal_id should match
            // datum should be inProgress
            // is after deadline
            // votes_no > votes_yes
            // output datum state should be rejected
            and {
              proposal_id == self_output_datum.proposal_id,
              datum.proposal_state == InProgess,
              moment.is_after(datum.deadline, tx.validity_range),
              datum.votes_count.no > datum.votes_count.yes,
              self_output_datum.proposal_state == Rejected,
            }
        }
      }

      None -> fail @"Invalid Datum"
    }
  }

  else(_) {
    fail
  }
}
