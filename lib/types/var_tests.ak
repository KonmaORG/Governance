use aiken/cbor.{serialise}
use aiken/collection/dict
use types/datum.{GovernanceDatum}
use types/moment.{Moment}
use types/utils.{FeeAmountUpdate, InProgress, Pending, VotesCount}

// NOTE: The definitions for `Wallet` and `Moment` types were not found in the
// project. Therefore, tests for `GovernanceDatum` and the `FeeAddressUpdate`
// variant of `ProposalAction` cannot be written.
// Please provide the definitions for `lib/types/wallet.ak` and
// `lib/types/moment.ak` to enable complete testing.
const proposalid = "1"

const pkh1_hex = #"a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3d0d1d2d3"

const pkh2_hex = #"e0e1e2e3e4e5e6e7e8e9f0f1f2f3f4f5f6f7f8f9a0a1a2a3b0b1b2b3"

const datafrom_lucid =
  #"d8799f4131581ca0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3d0d1d2d3d87b9f1903e8ff9fd8799f581ce0e1e2e3e4e5e6e7e8e9f0f1f2f3f4f5f6f7f8f9a0a1a2a3b0b1b2b3d87c80ffd8799f581ca0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3d0d1d2d3d87c80ffffd8799f000000ffd8799f0000ffd87980ff"

const datum_var =
  GovernanceDatum {
    proposal_id: proposalid,
    submitted_by: pkh1_hex,
    proposal_action: FeeAmountUpdate(1000),
    votes: dict.from_pairs([Pair(pkh2_hex, Pending), Pair(pkh1_hex, Pending)]),
    votes_count: VotesCount { yes: 0, no: 0, abstain: 0 },
    deadline: Moment { start: 0, end: 0 },
    proposal_state: InProgress,
  }

test datum() {
  // proposal_id matched with offchain cbor
  trace @"proposal_id": serialise(datum_var.proposal_id)
  // submitted_by matched with offchain cbor
  trace @"submited_by": serialise(datum_var.submitted_by)
  // proposal_action matched with offchain cbor
  trace @"proposal_action": serialise(datum_var.proposal_action)
  // ------------------------------
  trace @"votes": serialise(datum_var.votes)
  // votes_count matched with offchain cbor 
  trace @"votes_count": serialise(datum_var.votes_count)
  // deadline matched with offchain cbor 
  trace @"deadline": serialise(datum_var.deadline)
  // proposal_state matched with offchain cbor 
  trace @"proposal_state": serialise(datum_var.proposal_state)
  trace @"Pending": serialise(Pending)
  datafrom_lucid == serialise(datum_var)
}
