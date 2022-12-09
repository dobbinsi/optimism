import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;
const BigNumbers = () => {
  const [delegators, setDelegators] = useState([]);
  const [tokensDelegated, setTokensDelegated] = useState([]);
  const [uniqueVoters, setUniqueVoters] = useState([]);
  const [propsVoted, setPropsVoted] = useState([]);
  const [activeDelegates, setActiveDelegates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [circSupply, setCircSupply] = useState([]);
  const percentCirculating = (tokensDelegated / circSupply) * 100;

  const ttText =
    "Active Delegates are those who have voted on at least 10% of all proposals.";

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers1 = {
      sql: "SELECT count(DISTINCT delegator) FROM optimism.core.fact_delegations",
      ttlMinutes: 2,
    };

    const resultBigNumbers1 = flipside.query
      .run(queryBigNumbers1)
      .then((records) => {
        setDelegators(records.rows[0][0]);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers2 = {
      sql: "WITH grp AS ( SELECT LOWER(voter) as delegate, voting_power AS voting_power FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth' QUALIFY(ROW_NUMBER() over(PARTITION BY voter ORDER BY vote_timestamp DESC)) = 1 ) SELECT sum(voting_power) AS tot_voting_power FROM grp",
      ttlMinutes: 2,
    };

    const resultBigNumbers2 = flipside.query
      .run(queryBigNumbers2)
      .then((records) => {
        setTokensDelegated(records.rows[0][0]);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers7 = {
      sql: "WITH num_props_active AS (SELECT ceil(count(distinct proposal_id)*0.1) as num_props FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth'),voted as (SELECT voter, count(distinct id) as props_voted FROM ethereum.core.ez_snapshot GROUP BY voter), active as ( SELECT voter, case when props_voted > num_props THEN 'TRUE' else 'FALSE' END AS is_active FROM voted JOIN num_props_active ) SELECT count(distinct voter) FROM active WHERE is_active = 'TRUE'",
      ttlMinutes: 2,
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
      ttlMinutes: 2,
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
      ttlMinutes: 2,
    };

    const resultBigNumbers9 = flipside.query
      .run(queryBigNumbers9)
      .then((records) => {
        setActiveDelegates(records.rows[0][0]);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/optimism")
      .then((res) => {
        setCircSupply(res.data.market_data.circulating_supply);
      })
      .catch((err) => console.log(err));
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
      <div className="triple">
        <div className="big-numbers">
          <h1>
            {delegators.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h1>
          <h2>Unique Wallets that Delegate</h2>
        </div>
        <div className="big-numbers">
          <h1>
            {tokensDelegated.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h1>
          <h2>Total Voting Power Delegated</h2>
        </div>
        <div className="big-numbers">
          <h1>
            {percentCirculating.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + "%"}
          </h1>
          <h2>Percent Circulating Supply</h2>
        </div>
      </div>
    </div>
  );
};

export default BigNumbers;
