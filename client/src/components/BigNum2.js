import React, { useState, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";

const BigNum2 = (props) => {
  const [uniqueVoters, setUniqueVoters] = useState([]);
  const [propsVoted, setPropsVoted] = useState([]);
  const [activeDelegates, setActiveDelegates] = useState([]);

  const ttText =
    "Active Delegates are those who have voted on at least 10% of all proposals.";

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/6ae58d46-a622-47ba-8e23-b3a46c91cec8/data/latest"
      )
      .then((res) => {
        setUniqueVoters(res.data[0]["COUNT(DISTINCT VOTER)"]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/fc9bcc54-cc14-4a7f-9f2a-44ec94071bfe/data/latest"
      )
      .then((res) => {
        setPropsVoted(res.data[0]["NUM_PROPS"]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/7d99e375-9bc0-40e2-bcf4-a752a1b0bb14/data/latest"
      )
      .then((res) => {
        setActiveDelegates(res.data[0]["DELEGATE"]);
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
    </div>
  );
};

export default BigNum2;
