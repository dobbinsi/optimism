import React, { useState, useEffect, lazy, Suspense } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import "./App.css";
import opjawn from "./logos/op_logo.svg";
import { motion } from "framer-motion";
import BounceLoader from "react-spinners/BounceLoader";
import BigNumbers from "./components/BigNumbers";
import Leaderboard from "./components/Leaderboard";
import Redelegations from "./components/Redelegations";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./components/Fallback";

const Double = lazy(() => import("./components/Double"));
const LineVotes = lazy(() => import("./components/LineVotes"));
const Values = lazy(() => import("./components/Values"));
const IndiVotes = lazy(() => import("./components/IndiVotes"));
const Footer = lazy(() => import("./components/Footer"));

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

function App() {
  const [loading, setLoading] = useState(true);
  const [gateData, setGateData] = useState([]);
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryGate = {
      sql: "WITH num_props_active AS (SELECT ceil(count(distinct proposal_id)*0.1) as num_props FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth'),voted as (SELECT voter, count(distinct id) as props_voted FROM ethereum.core.ez_snapshot GROUP BY voter), active as ( SELECT voter, case when props_voted > num_props THEN 'TRUE' else 'FALSE' END AS is_active FROM voted JOIN num_props_active ) SELECT count(distinct voter) FROM active WHERE is_active = 'TRUE'",
      ttlMinutes: 2,
    };

    const resultGate = flipside.query.run(queryGate).then((records) => {
      setGateData(records.rows);
      setLoading(false);
    });
  }, []);

  const errorHandler = (error, errorInfo) => {
    console.log("Logging...", error, errorInfo);
  };

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
            <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
              <BigNumbers />
              <Leaderboard />
              <Redelegations />
              <Suspense fallback={<BounceLoader color="#ff1420" size={150} />}>
                <Double />
                <LineVotes />
                <Values />
                <IndiVotes />
                <Footer />
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
