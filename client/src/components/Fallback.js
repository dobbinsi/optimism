import React from "react";
import fscube from "../logos/fscube.png";
import { motion } from "framer-motion";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function Fallback() {
  return (
    <div style={style} className="fallback">
      <a
        href="https://flipsidecrypto.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-links"
      >
        {" "}
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          src={fscube}
          className="fs-logo"
          alt="flipside"
        />
      </a>
      <h3>We're fixing something... Please check back later!</h3>
    </div>
  );
}

export default Fallback;
