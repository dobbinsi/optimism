import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import axios from "axios";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;
const BigNumbers = () => {
  const [delegators, setDelegators] = useState([]);
  const [tokensDelegated, setTokensDelegated] = useState([]);

  const [loading, setLoading] = useState(true);
  const [circSupply, setCircSupply] = useState([]);
  const percentCirculating = (tokensDelegated / circSupply) * 100;

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers1 = {
      sql: "SELECT count(DISTINCT delegator) FROM optimism.core.fact_delegations",
      ttlMinutes: 60,
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
      ttlMinutes: 60,
    };

    const resultBigNumbers2 = flipside.query
      .run(queryBigNumbers2)
      .then((records) => {
        setTokensDelegated(records.rows[0][0]);
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
