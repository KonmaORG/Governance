# DAO Validator

This project includes a basic DAO (Decentralized Autonomous Organization) validator that manages the lifecycle of on-chain proposals.

### Core Concepts

The DAO is built around the idea of proposals that can be voted on by eligible members. Each proposal is represented by a UTxO at the validator address, containing a `GovernanceDatum` that holds its state.

- **Proposals**: A proposal includes an ID, the proposer's identity, a specific action to be executed (e.g., updating a fee), a list of eligible voters, vote counts, a voting deadline, and its current state.
- **Voting**: Eligible members can cast their vote (`Yes`, `No`, or `Abstain`) on a proposal as long as it is within the deadline and the proposal is in the `InProgress` state.
- **Lifecycle**: A proposal starts as `InProgress`. After the deadline, it can either be `Executed` if it passes (Note: execution logic is not yet implemented) or `Rejected` if it fails.

### Types (`lib/types.ak`)

The core data structures for the DAO are defined in `lib/types.ak`:

- **`GovernanceDatum`**: The main state record for a proposal. It contains:
  - `proposal_id: ByteArray`
  - `submitted_by: Voter`
  - `proposal_action: ProposalAction`
  - `votes: Dict<Voter, Vote>`
  - `votes_count: VotesCount`
  - `deadline: Moment`
  - `proposal_state: ProposalState`
- **`GovernanceRedeemer`**: Defines the actions that can be taken on a proposal:
  - `SubmitProposal`: To create a new proposal (handled by a minting policy, not the spend validator).
  - `VoteProposal`: To cast a vote.
  - `ExecuteProposal`: To execute a passed proposal.
  - `RejectProposal`: To formally reject a failed proposal.
- **`ProposalAction`**: Defines what the proposal aims to achieve, e.g., `FeeUpdate(Int)`.
- **`Vote`**: An enum for vote types: `Yes`, `No`, `Abstain`, and `Pending` (for voters who haven't voted yet).
- **`ProposalState`**: An enum for the proposal's status: `InProgess`, `Executed`, `Rejected`.

### Validator Logic (`validators/dao.ak`)

The `dao` validator's `spend` logic enforces the rules for interacting with a proposal UTxO.

- **`VoteProposal`**:
  - Checks that the proposal is `InProgress` and the vote is cast before the `deadline`.
  - Verifies that the voter is eligible and has not already voted.
  - Ensures the vote count and the voter's vote are correctly updated in the new output datum.
- **`RejectProposal`**:
  - Checks that the proposal is `InProgress` and the `deadline` has passed.
  - Verifies that the number of `No` votes is greater than the number of `Yes` votes.
  - Ensures the proposal's state is updated to `Rejected` in the new output datum.
- **`ExecuteProposal`**: This action is defined but not yet implemented in the validator.
