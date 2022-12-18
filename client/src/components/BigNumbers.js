import React, { useState, useEffect } from "react";
import axios from "axios";

const BigNumbers = (props) => {
  const [delegators, setDelegators] = useState([]);
  const [tokensDelegated, setTokensDelegated] = useState([]);

  const [circSupply, setCircSupply] = useState([]);
  const percentCirculating = (tokensDelegated / circSupply) * 100;

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/729cbef4-d600-48d8-ac91-9b26dbcc59f7/data/latest"
      )
      .then((res) => {
        setDelegators(res.data[0]["COUNT(DISTINCT DELEGATOR)"]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/2e7e4b69-1db4-409e-b8c8-6d1bf7340662/data/latest"
      )
      .then((res) => {
        setTokensDelegated(res.data[0]["TOT_VOTING_POWER"]);
      })
      .catch((err) => console.log(err));
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
