import "./App.css";
import opjawn from "./logos/op_logo.svg";
import { motion } from "framer-motion";
import BigNumbers from "./components/BigNumbers";
import Footer from "./components/Footer";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <div className="wrapper">
      <div className="header-main">
        <div className="logo">
          <a href="https://www.optimism.io/">
            {" "}
            <motion.img
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              src={opjawn}
              className="op-logo"
              alt="optimism"
            />{" "}
          </a>
          <h1>Governance Data</h1>
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
            href="https://app.optimism.io/delegates"
            target="_blank"
            rel="noopener noreferrer"
            className="h-link"
          >
            Delegate
          </a>
        </div>
      </div>
      <BigNumbers />
      <Leaderboard />
      <Footer />
    </div>
  );
}

export default App;
