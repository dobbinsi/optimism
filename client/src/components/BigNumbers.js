import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import ScaleLoader from "react-spinners/ScaleLoader";
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
      ttlMinutes: 10,
    };

    const resultBigNumbers1 = flipside.query
      .run(queryBigNumbers1)
      .then((records) => {
        setDelegators(records.rows[0][0]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryBigNumbers2 = {
      sql: "WITH most_recent AS (SELECT delegator, block_timestamp, raw_new_balance / POW(10,21) AS op_delegated FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' qualify(ROW_NUMBER() over(PARTITION BY delegator ORDER BY block_timestamp DESC)) = 1) SELECT sum(op_delegated) AS total_OP FROM most_recent",
      ttlMinutes: 10,
    };

    try {
      const resultBigNumbers2 = flipside.query
        .run(queryBigNumbers2)
        .then((records) => {
          setTokensDelegated(records.rows[0][0]);
        });
    } catch (error) {
      console.log("error in BigNumbers2");
      console.log(error);
    }
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
    <div className="triple">
      {loading ? (
        <div className="loader-main">
          <ScaleLoader height={50} color={"#ffab33"} className="offset-main" />
        </div>
      ) : (
        <>
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
            <h2>Total OP Tokens Delegated</h2>
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
        </>
      )}
    </div>
  );
};

export default BigNumbers;
