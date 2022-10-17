import flipjawn from "../logos/flipside.png";

const Footer = () => {
  return (
    <div className="footer">
      <h3>
        <a href="https://twitter.com/web3_analyst" className="footer-links">
          Jess the Analyst{" "}
        </a>
        &{" "}
        <a href="https://twitter.com/dawbyinz" className="footer-links">
          d0bby
        </a>
      </h3>
      <div className="logo-footer">
        <h2 className="footer-bigtxt">Powered by</h2>
        <a href="https://flipsidecrypto.xyz/" className="footer-links">
          {" "}
          <img src={flipjawn} className="flipside-logo" alt="flipside" />{" "}
        </a>
      </div>
    </div>
  );
};

export default Footer;

