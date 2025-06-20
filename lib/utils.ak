use cardano/assets.{AssetName, PolicyId}
use cardano/transaction.{InlineDatum, Input, Output}
use cardano/value
use types.{ConfigDatum, GovernanceDatum}
use validation/find

pub fn governance_datum_from_data(data: Data) -> GovernanceDatum {
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

pub fn ref_datum_by_nft(
  inputs: List<Input>,
  pid: PolicyId,
  tkn: AssetName,
) -> ConfigDatum {
  let datum_data = input_datum_by_nft(inputs, pid, tkn)
  if datum_data is datum: ConfigDatum {
    datum
  } else {
    fail @"Datum Type did not Match ConfigDatum On Input"
  }
}

pub fn input_datum_by_nft(
  inputs: List<Input>,
  pid: PolicyId,
  tkn: AssetName,
) -> Data {
  when inputs is {
    [input, ..rest] ->
      if value.prove_exact_nft(input.output.value, pid, tkn) {
        when input.output.datum is {
          InlineDatum(inbound_datum) -> inbound_datum
          _ -> fail @"No Datum On Input"
        }
      } else {
        input_datum_by_nft(rest, pid, tkn)
      }
    [] -> fail @"No Datum Found In inputs"
  }
}

pub fn output_ref_datum_by_nft(
  outputs: List<Output>,
  pid: PolicyId,
  tkn: AssetName,
) -> ConfigDatum {
  let datum_data = find.output_datum_by_nft(outputs, pid, tkn)
  if datum_data is datum: ConfigDatum {
    datum
  } else {
    fail @"Datum Type did not Match ConfigDatum On Input"
  }
}
