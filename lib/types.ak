use aiken/collection/dict.{Dict}
use aiken/crypto.{VerificationKeyHash}
use types/moment.{Moment}

// utils
pub type ProposalState {
  InProgess
  Executed
  Rejected
}

pub type Voter =
  VerificationKeyHash

pub type VotesCount {
  yes: Int,
  no: Int,
  abstain: Int,
}

pub type Vote {
  Yes
  No
  Abstain
  Pending
}

pub type ProposalAction {
  ValidatorAdd
  ValidatorRemove
  FeeUpdate
  FeeAddressUpdate
}

pub type Votes =
  Dict<Voter, Vote>

// redeemer
pub type GovernanceRedeemer {
  SubmitProposal { proposal_id: ByteArray, submitted_by: ByteArray }
  VoteProposal { proposal_id: ByteArray, voter: Voter, vote: Vote }
  ExecuteProposal { proposal_id: ByteArray }
  RejectProposal { proposal_id: ByteArray }
}

// datum
pub type GovernanceDatum {
  proposal_id: ByteArray,
  submitted_by: Voter,
  proposal_action: ProposalAction,
  votes: Votes,
  votes_count: VotesCount,
  deadline: Moment,
  proposal_state: ProposalState,
}
