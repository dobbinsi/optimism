import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  createContext,
} from "react";
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
import BigNum2 from "./components/BigNum2";
import { Analytics } from "@vercel/analytics/react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useLocalStorage from "use-local-storage";

const Double = lazy(() => import("./components/Double"));
const LineVotes = lazy(() => import("./components/LineVotes"));
const Values = lazy(() => import("./components/Values"));
const IndiVotes = lazy(() => import("./components/IndiVotes"));
const Footer = lazy(() => import("./components/Footer"));
const ThemeContext = createContext(null);

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
  const [isDarkMode, setDarkMode] = useLocalStorage("isDarkMode", false);
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleDarkMode = (isDarkMode) => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setDarkMode(isDarkMode);
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("isDarkMode", isDarkMode);
  };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryGate = {
      sql: "WITH grp AS ( SELECT LOWER(voter) as delegate, voting_power AS voting_power FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth' QUALIFY(ROW_NUMBER() over(PARTITION BY voter ORDER BY vote_timestamp DESC)) = 1 ) SELECT sum(voting_power) AS tot_voting_power FROM grp",
      ttlMinutes: 60,
      timeoutMinutes: 2,
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
    <ThemeContext.Provider value={{ theme, toggleDarkMode }}>
      <div
        style={{
          background: isDarkMode ? "#000000" : "#ffffff",
          transition: "0.5s background",
        }}
        id={theme}
        className="test"
      >
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
              <DarkModeSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                size={22}
              />
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
                <ErrorBoundary
                  FallbackComponent={Fallback}
                  onError={errorHandler}
                >
                  <BigNum2 dark={isDarkMode} />
                  <BigNumbers dark={isDarkMode} />
                  <Leaderboard dark={isDarkMode} />
                  <Suspense>
                    <Redelegations />
                    <Double dark={isDarkMode} />
                    <LineVotes dark={isDarkMode} />
                    <Values dark={isDarkMode} />
                    <IndiVotes dark={isDarkMode} />
                    <Footer dark={isDarkMode} />
                  </Suspense>
                </ErrorBoundary>
                <Analytics />
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
