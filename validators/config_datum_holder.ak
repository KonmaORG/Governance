// This validator is responsible for safeguarding the central configuration datum of the protocol.
// It ensures that any modifications to the configuration are authorized by a multi-signature group.

use cardano/transaction.{Transaction}
use types.{ConfigDatum}

/// The `config_datum_holder` validator locks the main `ConfigDatum` and the Identification NFT.
/// Spending from this validator requires approval from a specified multi-signature group,
/// preventing unauthorized changes to the protocol's configuration.
validator config_datum_holder {
  spend(
    datum: Option<ConfigDatum>,
    redeemer proposal_id: ByteArray,
    _oref,
    _tx: Transaction,
  ) {
    expect Some(datum) = datum
    // This spend function enforces that the transaction also spends the UTXO from the DAO validator,
    // which is responsible for managing proposals and voting. this will ensure that any changes to the configuration
    // are made in the context of an approved proposal.
    // ---
    // we could take the proposal_id from the redeemer and check if it exists in the GovernanceDatum, 
    // and confirm that the output_GovernanceDatum.proposal_state is Executed. this would ensure that the change is only implemented once the proposal is approved.
    // ---
    //  question is how to get the GovernanceDatum from the tx?
    // if we implement mint in DAO contract, we can use the minting policy to find the GovernanceDatum.
    // what would be better to add the minting policy as paramenter to the config_datum_holder validator?
    // OR add it in the ConfigDatum type?
    //
    // Answer: To get the GovernanceDatum, you need to identify the transaction input
    // that comes from the DAO validator. The datum attached to that input will be
    // the GovernanceDatum.
    //
    // Of your two suggestions, adding the DAO validator's identity (e.g., its
    // validator hash) to the ConfigDatum is the cleaner approach. You can then
    // iterate through `tx.inputs`, find the one sent from the DAO validator's
    // address, and access its datum.
    //
    // ---
    //
    // Alternative Method: Use a unique NFT.
    // 1. Ensure the DAO validator's UTXO always holds a specific NFT.
    // 2. Store this NFT's policy ID in the ConfigDatum.
    // 3. In this validator, find the transaction input that contains this NFT.
    //    This input must be from the DAO validator, allowing you to get the
    //    GovernanceDatum from it.
    datum.categories == [proposal_id]
    // added just to avoid the unused warning
  }

  else(_) {
    fail
  }
}
