import flipjawn from "../logos/flipside.png";
import flipjawn2 from "../logos/flipsidewhite.png";

const Footer = (props) => {
  return (
    <div className="footer">
      <h3>
        <a
          href="https://twitter.com/web3_analyst"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-links"
        >
          Jess the Analyst{" "}
        </a>
        &{" "}
        <a
          href="https://twitter.com/dawbyinz"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-links"
        >
          d0bby
        </a>
      </h3>
      <div className="logo-footer">
        <h2 className="footer-bigtxt">Powered by</h2>
        {props.dark ? (
          <a
            href="https://flipsidecrypto.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-links"
          >
            {" "}
            <img
              src={flipjawn2}
              className="flipside-logo"
              alt="flipside"
            />{" "}
          </a>
        ) : (
          <a
            href="https://flipsidecrypto.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-links"
          >
            {" "}
            <img src={flipjawn} className="flipside-logo" alt="flipside" />{" "}
          </a>
        )}
      </div>
    </div>
  );
};

export default Footer;
