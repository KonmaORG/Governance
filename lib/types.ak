use aiken/collection/dict.{Dict}
use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{AssetName, PolicyId}
use types/moment.{Moment}
use types/wallet.{Wallet}

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

// Proposal Action with Values needed to be updated
// possible action // atleast/Multisig.required
pub type ProposalAction {
  ValidatorAdd(VerificationKeyHash)
  ValidatorRemove(VerificationKeyHash)
  FeeAmountUpdate(Int)
  FeeAddressUpdate(Wallet)
}

pub type Votes =
  Dict<Voter, Vote>

// redeemer
pub type GovernanceRedeemer {
  SubmitProposal
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

// -----------------------------------------------------------------
pub type AssetClass {
  /// The policy ID of the asset.
  policy_id: PolicyId,
  /// The name of the asset.
  asset_name: AssetName,
}

pub type Atleast =
  Int

/// Defines a multi-signature scheme.
pub type Multisig {
  /// The minimum number of signatures required for a transaction to be valid.
  required: Atleast,
  /// A list of the verification key hashes of the authorized signers.
  signers: List<VerificationKeyHash>,
}

/// The main configuration datum for the entire protocol.
pub type ConfigDatum {
  /// The wallet address where platform fees are collected.
  fees_address: Wallet,
  /// The amount of the platform fee.
  fees_amount: Int,
  /// The asset class (policy ID and asset name) of the fee token.
  fees_asset_class: AssetClass,
  /// The wallet address for spending-related operations.
  spend_address: Wallet,
  /// A list of supported project categories.
  categories: List<ByteArray>,
  /// The multi-signature group required to validate projects.
  multisig_validator_group: Multisig,
  /// The multi-signature group required to update this configuration datum.
  multisig_refutxoupdate: Multisig,
  /// The policy ID of the Carbon Emission Token (CET).
  cet_policyid: PolicyId,
  /// The policy ID of the Carbon Offsetting Token (COT).
  cot_policyid: PolicyId,
}
