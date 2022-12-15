import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;
const BigNum2 = () => {
  const [uniqueVoters, setUniqueVoters] = useState([]);
  const [propsVoted, setPropsVoted] = useState([]);
  const [activeDelegates, setActiveDelegates] = useState([]);

  const ttText =
    "Active Delegates are those who have voted on at least 10% of all proposals.";

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers7 = {
      sql: "WITH num_props_active AS (SELECT ceil(count(distinct proposal_id)*0.1) as num_props FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth'),voted as (SELECT voter, count(distinct id) as props_voted FROM ethereum.core.ez_snapshot GROUP BY voter), active as ( SELECT voter, case when props_voted > num_props THEN 'TRUE' else 'FALSE' END AS is_active FROM voted JOIN num_props_active ) SELECT count(distinct voter) FROM active WHERE is_active = 'TRUE'",
      ttlMinutes: 1,
    };

    const resultBigNumbers7 = flipside.query
      .run(queryBigNumbers7)
      .then((records) => {
        setUniqueVoters(records.rows[0][0]);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers8 = {
      sql: "SELECT count(distinct proposal_id) as num_props FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth'",
      ttlMinutes: 1,
    };

    const resultBigNumbers8 = flipside.query
      .run(queryBigNumbers8)
      .then((records) => {
        setPropsVoted(records.rows[0][0]);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers9 = {
      sql: "WITH num_props_active AS ( SELECT ceil(count(distinct proposal_id)*0.1) as num_props FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth' ),voted as ( SELECT voter, count(distinct id) as props_voted FROM ethereum.core.ez_snapshot GROUP BY voter ), active as ( SELECT voter, case when props_voted > num_props THEN 'TRUE' else 'FALSE' END AS is_active FROM voted a JOIN num_props_active INNER JOIN crosschain.core.address_tags t ON t.address = LOWER(voter) WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ) SELECT count(distinct voter) as delegate FROM active WHERE is_active = 'TRUE'",
      ttlMinutes: 1,
    };

    const resultBigNumbers9 = flipside.query
      .run(queryBigNumbers9)
      .then((records) => {
        setActiveDelegates(records.rows[0][0]);
      });
  }, []);

  return (
    <div>
      <div className="triple">
        <div className="big-numbers">
          <h1>
            {uniqueVoters.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h1>
          <h2>Unique Voters</h2>
        </div>
        <div className="big-numbers">
          <h1>
            {propsVoted.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h1>
          <h2>Total Proposals</h2>
        </div>
        <div className="big-numbers">
          <h1>
            {activeDelegates.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h1>
          <h2>
            Active Delegates
            <Tooltip title={ttText} placement="bottom" fontSize="inherit">
              <InfoOutlinedIcon></InfoOutlinedIcon>
            </Tooltip>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BigNum2;
