import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import "./App.css";
import opjawn from "./logos/op_logo.svg";
import { motion } from "framer-motion";
import BounceLoader from "react-spinners/BounceLoader";
import BigNumbers from "./components/BigNumbers";
import Footer from "./components/Footer";
import Leaderboard from "./components/Leaderboard";
import Redelegations from "./components/Redelegations";
import Double from "./components/Double";
import LineVotes from "./components/LineVotes";
import Values from "./components/Values";
import IndiVotes from "./components/IndiVotes";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

function App() {
  const [loading, setLoading] = useState(true);
  const [OPData, setOPData] = useState([]);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryOP = {
      sql: "WITH user_delegations AS (SELECT delegator, current_delegate, current_voting_power FROM (SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER (PARTITION BY delegator ORDER BY block_timestamp DESC) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS') WHERE rank = 1), sums AS (SELECT count(DISTINCT delegator) as tot_delegators, sum(current_voting_power) / POW(10,22) as tot_voting_power FROM user_delegations),grp AS (SELECT current_delegate, sum(current_voting_power) / POW(10,22) AS total_op_delegated, count(DISTINCT delegator) AS num_delegating_addresses FROM user_delegations GROUP BY current_delegate), votes AS (SELECT voter, count(proposal_id) AS num_props_voted FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' GROUP BY voter) SELECT current_delegate AS delegate_address, tag_name, COALESCE(num_props_voted, 0) AS num_props_voted, total_op_delegated, total_op_delegated / tot_voting_power * 100 AS percent_voting_power, num_delegating_addresses, num_delegating_addresses / tot_delegators * 100 AS percent_delegating_addresses FROM grp JOIN sums LEFT JOIN votes ON current_delegate = LOWER(voter) LEFT OUTER JOIN crosschain.core.address_tags ON current_delegate = LOWER(address) WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ORDER BY total_op_delegated DESC",
      ttlMinutes: 10,
    };

    const resultOP = flipside.query.run(queryOP).then((records) => {
      setOPData(records.rows);
      setLoading(false);
    });
  }, []);

  return (
    <div className="wrapper">
      <div className="header-main">
        <div className="logo">
          <a
            href="https://www.optimism.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <motion.img
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              src={opjawn}
              className="op-logo"
              alt="optimism"
            />{" "}
          </a>
          <h1 className="header-bigtxt">Governance Data</h1>
        </div>
        <div className="header-nav">
          <a
            href="https://app.optimism.io/bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="h-link"
          >
            Bridge
          </a>
          <a
            href="https://gov.optimism.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-link"
          >
            Forum
          </a>
          <a
            href="https://app.optimism.io/delegates?search=flipside"
            target="_blank"
            rel="noopener noreferrer"
            className="h-link"
          >
            Delegate
          </a>
        </div>
      </div>
      <div className="single-main">
        {loading ? (
          <div className="loader-blank" style={style}>
            <BounceLoader color="#ff1420" size={150} />
            <h3>Fetching Data...</h3>
          </div>
        ) : (
          <>
            <BigNumbers />
            <Leaderboard />
            <Redelegations />
            <Double />
            <LineVotes />
            <Values />
            <IndiVotes />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
