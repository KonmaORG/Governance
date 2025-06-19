use aiken/collection/dict
use cardano/address.{Script}
use cardano/assets.{PolicyId}
// TODO: allow on token holder to create and vote proposal
use cardano/transaction.{
  InlineDatum, OutputReference, Transaction, find_input, find_script_outputs,
}
use types.{
  Abstain, ExecuteProposal, GovernanceDatum, GovernanceRedeemer, No, Pending,
  RejectProposal, SubmitProposal, VoteProposal, Yes,
}

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
          } = data
          GovernanceDatum {
            proposal_id,
            submitted_by,
            proposal_action,
            votes,
            votes_count,
            deadline,
          }
        }
        // when condition on Redeemer Action
        when redeemer is {
          SubmitProposal { proposal_id, submitted_by } ->
            fail @"Invalid Redeemer"
          VoteProposal { proposal_id, voter, vote } ->
            // voter is in datum.votes && datum.votes.vote=Pending
            // output.datum.votes is == vote
            // votes_count.[vote] = +1
            and {
              dict.has_key(datum.votes, voter),
              Some(Pending) == dict.get(datum.votes, voter),
              Some(vote) == dict.get(self_output_datum.votes, voter),
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
          RejectProposal { proposal_id } -> fail @"reject not implemented"
        }
      }
      None -> fail @"Invalid Datum"
    }
  }

  else(_) {
    fail
  }
}
