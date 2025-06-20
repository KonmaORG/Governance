use types.{GovernanceDatum}

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
