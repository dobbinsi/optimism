import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import ClipLoader from "react-spinners/ClipLoader";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const Double = () => {
  const [thirtyDoubleData, setThirtyDoubleData] = useState([]);
  const [sixtyDoubleData, setSixtyDoubleData] = useState([]);
  const [ninetyDoubleData, setNinetyDoubleData] = useState([]);

  const [thirtyState, setThirtyState] = useState(true);
  const [sixtyState, setSixtyState] = useState(false);
  const [ninetyState, setNinetyState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);

  const thirtyHandler = () => {
    setThirtyState(true);
    setSixtyState(false);
    setNinetyState(false);
    setActive1(true);
    setActive2(false);
    setActive3(false);
  };

  const sixtyHandler = () => {
    setThirtyState(false);
    setSixtyState(true);
    setNinetyState(false);
    setActive1(false);
    setActive2(true);
    setActive3(false);
  };

  const ninetyHandler = () => {
    setThirtyState(false);
    setSixtyState(false);
    setNinetyState(true);
    setActive1(false);
    setActive2(false);
    setActive3(true);
  };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryThirtyDouble = {
      sql: "WITH delegation_change AS (SELECT block_timestamp :: date, delegator, to_delegate, t.tag_name AS to_delegate_name, from_delegate, tt.tag_name AS from_delegate_name, (raw_new_balance - raw_previous_balance) / POW(10, 21) AS balance_change, raw_new_balance / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations d LEFT OUTER JOIN crosschain.core.address_tags t ON d.to_delegate = t.address LEFT OUTER JOIN crosschain.core.address_tags tt ON d.from_delegate = tt.address WHERE t.creator = 'jkhuhnke11' AND t.tag_type = 'delegate_name' AND block_timestamp :: date >= CURRENT_DATE - 30 ), bal_to AS (SELECT to_delegate as delegate, sum(balance_change) as bal FROM delegation_change GROUP BY to_delegate UNION SELECT from_delegate as delegate, sum(-balance_change) as bal FROM delegation_change GROUP BY from_delegate) SELECT delegate, t.tag_name AS delegate_name, sum(bal) as balance_change FROM bal_to d LEFT OUTER JOIN crosschain.core.address_tags t ON d.delegate = t.address WHERE t.creator = 'jkhuhnke11' AND t.tag_type = 'delegate_name' GROUP BY delegate, t.tag_name",
      ttlMinutes: 1,
    };

    const resultThirtyDouble = flipside.query
      .run(queryThirtyDouble)
      .then((records) => {
        setThirtyDoubleData(records.rows);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const querySixtyDouble = {
      sql: "WITH delegation_change AS (SELECT block_timestamp :: date, delegator, to_delegate, t.tag_name AS to_delegate_name, from_delegate, tt.tag_name AS from_delegate_name, (raw_new_balance - raw_previous_balance) / POW(10, 21) AS balance_change, raw_new_balance / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations d LEFT OUTER JOIN crosschain.core.address_tags t ON d.to_delegate = t.address LEFT OUTER JOIN crosschain.core.address_tags tt ON d.from_delegate = tt.address WHERE t.creator = 'jkhuhnke11' AND t.tag_type = 'delegate_name' AND block_timestamp :: date >= CURRENT_DATE - 60 ), bal_to AS (SELECT to_delegate as delegate, sum(balance_change) as bal FROM delegation_change GROUP BY to_delegate UNION SELECT from_delegate as delegate, sum(-balance_change) as bal FROM delegation_change GROUP BY from_delegate) SELECT delegate, t.tag_name AS delegate_name, sum(bal) as balance_change FROM bal_to d LEFT OUTER JOIN crosschain.core.address_tags t ON d.delegate = t.address WHERE t.creator = 'jkhuhnke11' AND t.tag_type = 'delegate_name' GROUP BY delegate, t.tag_name",
      ttlMinutes: 1,
    };

    const resultSixtyDouble = flipside.query
      .run(querySixtyDouble)
      .then((records) => {
        setSixtyDoubleData(records.rows);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryNinetyDouble = {
      sql: "WITH delegation_change AS (SELECT block_timestamp :: date, delegator, to_delegate, t.tag_name AS to_delegate_name, from_delegate, tt.tag_name AS from_delegate_name, (raw_new_balance - raw_previous_balance) / POW(10, 21) AS balance_change, raw_new_balance / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations d LEFT OUTER JOIN crosschain.core.address_tags t ON d.to_delegate = t.address LEFT OUTER JOIN crosschain.core.address_tags tt ON d.from_delegate = tt.address WHERE t.creator = 'jkhuhnke11' AND t.tag_type = 'delegate_name' AND block_timestamp :: date >= CURRENT_DATE - 90 ), bal_to AS (SELECT to_delegate as delegate, sum(balance_change) as bal FROM delegation_change GROUP BY to_delegate UNION SELECT from_delegate as delegate, sum(-balance_change) as bal FROM delegation_change GROUP BY from_delegate) SELECT delegate, t.tag_name AS delegate_name, sum(bal) as balance_change FROM bal_to d LEFT OUTER JOIN crosschain.core.address_tags t ON d.delegate = t.address WHERE t.creator = 'jkhuhnke11' AND t.tag_type = 'delegate_name' GROUP BY delegate, t.tag_name",
      ttlMinutes: 1,
    };

    const resultNinetyDouble = flipside.query
      .run(queryNinetyDouble)
      .then((records) => {
        setNinetyDoubleData(records.rows);
      });
  }, []);

  const thirtyFlows = thirtyDoubleData.sort(compare);
  const slice30Out = thirtyFlows.slice(0, 10);
  const sumOutflows30 = slice30Out.reduce((sum, item) => sum + item[2], 0);
  const slice30In = thirtyFlows.slice(-10);
  const reverse30In = slice30In.reverse();
  const sumInflows30 = reverse30In.reduce((sum, item) => sum + item[2], 0);

  const sixtyFlows = sixtyDoubleData.sort(compare);
  const slice60Out = sixtyFlows.slice(0, 10);
  const sumOutflows60 = slice60Out.reduce((sum, item) => sum + item[2], 0);
  const slice60In = sixtyFlows.slice(-10);
  const reverse60In = slice60In.reverse();
  const sumInflows60 = reverse60In.reduce((sum, item) => sum + item[2], 0);

  const ninetyFlows = ninetyDoubleData.sort(compare);
  const slice90Out = ninetyFlows.slice(0, 10);
  const sumOutflows90 = slice90Out.reduce((sum, item) => sum + item[2], 0);
  const slice90In = ninetyFlows.slice(-10);
  const reverse90In = slice90In.reverse();
  const sumInflows90 = reverse90In.reduce((sum, item) => sum + item[2], 0);

  function compare(a, b) {
    const nameA = a[2];
    const nameB = b[2];

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  const ttText = "Includes delegations and re-delegations.";

  return (
    <div className="single-main-leader">
      <div className="title-date">
        <div className="table-title">
          <h1>Trends: OP Gainers & Losers</h1>
        </div>
        <div className="date-toggle">
          <p>Select Date Range</p>
          <button
            style={{ color: active1 ? "#ff1420" : "#68778d" }}
            onClick={thirtyHandler}
          >
            30
          </button>
          <button
            style={{ color: active2 ? "#ff1420" : "#68778d" }}
            onClick={sixtyHandler}
          >
            60
          </button>
          <button
            style={{ color: active3 ? "#ff1420" : "#68778d" }}
            onClick={ninetyHandler}
          >
            90
          </button>
        </div>
      </div>
      <div className="double">
        <div className="small-chart-area">
          <h3>
            Delegates with Net Increase{" "}
            <Tooltip title={ttText} placement="top" fontSize="small">
              <InfoOutlinedIcon></InfoOutlinedIcon>
            </Tooltip>
          </h3>
          {thirtyState && (
            <div className="little-table">
              <table className="table-main">
                <thead>
                  <tr>
                    <th className="first-column">
                      Delegate (Link to Etherscan)
                    </th>
                    <th>OP Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2}>
                        <div className="chart-area-values">
                          <ClipLoader
                            className="spinner-values"
                            size={50}
                            speedMultiplier={0.75}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {reverse30In.map((delegate, index) => (
                        <tr>
                          <td>
                            <a
                              href={"https://etherscan.io/address/".concat(
                                delegate[0]
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="table-links"
                            >
                              {delegate[1]}
                            </a>
                          </td>
                          <td className="validator-voters">
                            {delegate[2].toLocaleString(undefined, {
                              minimumIntegerDigits: 2,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
              <h2 className="sum-flows-text">Total OP Tokens Gained:</h2>
              <h2 className="sum-flows">
                {sumInflows30.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
          )}
          {sixtyState && (
            <div className="little-table">
              <table className="table-main">
                <thead>
                  <tr>
                    <th className="first-column">
                      Delegate (Link to Etherscan)
                    </th>
                    <th>OP Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {reverse60In.map((delegate, index) => (
                    <tr>
                      <td>
                        <a
                          href={"https://etherscan.io/address/".concat(
                            delegate[0]
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-links"
                        >
                          {delegate[1]}
                        </a>
                      </td>
                      <td className="validator-voters">
                        {delegate[2].toLocaleString(undefined, {
                          minimumIntegerDigits: 2,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="sum-flows-text">Total OP Tokens Gained:</h2>
              <h2 className="sum-flows">
                {sumInflows60.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
          )}
          {ninetyState && (
            <div className="little-table">
              <table className="table-main">
                <thead>
                  <tr>
                    <th className="first-column">
                      Delegate (Link to Etherscan)
                    </th>
                    <th>OP Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {reverse90In.map((delegate, index) => (
                    <tr>
                      <td>
                        <a
                          href={"https://etherscan.io/address/".concat(
                            delegate[0]
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-links"
                        >
                          {delegate[1]}
                        </a>
                      </td>
                      <td className="validator-voters">
                        {delegate[2].toLocaleString(undefined, {
                          minimumIntegerDigits: 2,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="sum-flows-text">Total OP Tokens Gained:</h2>
              <h2 className="sum-flows">
                {sumInflows90.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
          )}
        </div>
        <div className="small-chart-area">
          <h3>Delegates with Net Decrease</h3>
          {thirtyState && (
            <div className="little-table">
              <table className="table-main">
                <thead>
                  <tr>
                    <th className="first-column">
                      Delegate (Link to Etherscan)
                    </th>
                    <th>OP Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2}>
                        <div className="chart-area-values">
                          <ClipLoader
                            className="spinner-values"
                            size={50}
                            speedMultiplier={0.75}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {slice30Out.map((delegate, index) => (
                        <tr>
                          <td>
                            <a
                              href={"https://etherscan.io/address/".concat(
                                delegate[0]
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="table-links"
                            >
                              {delegate[1]}
                            </a>
                          </td>
                          <td className="validator-voters">
                            {delegate[2].toLocaleString(undefined, {
                              minimumIntegerDigits: 2,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
              <h2 className="sum-flows-text">Total OP Tokens Lost:</h2>
              <h2 className="sum-flows-neg">
                {sumOutflows30.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
          )}
          {sixtyState && (
            <div className="little-table">
              <table className="table-main">
                <thead>
                  <tr>
                    <th className="first-column">
                      Delegate (Link to Etherscan)
                    </th>
                    <th>OP Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {slice60Out.map((delegate, index) => (
                    <tr>
                      <td>
                        <a
                          href={"https://etherscan.io/address/".concat(
                            delegate[0]
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-links"
                        >
                          {delegate[1]}
                        </a>
                      </td>
                      <td className="validator-voters">
                        {delegate[2].toLocaleString(undefined, {
                          minimumIntegerDigits: 2,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="sum-flows-text">Total OP Tokens Lost:</h2>
              <h2 className="sum-flows-neg">
                {sumOutflows60.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
          )}
          {ninetyState && (
            <div className="little-table">
              <table className="table-main">
                <thead>
                  <tr>
                    <th className="first-column">
                      Delegate (Link to Etherscan)
                    </th>
                    <th>OP Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {slice90Out.map((delegate, index) => (
                    <tr>
                      <td>
                        <a
                          href={"https://etherscan.io/address/".concat(
                            delegate[0]
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-links"
                        >
                          {delegate[1]}
                        </a>
                      </td>
                      <td className="validator-voters">
                        {delegate[2].toLocaleString(undefined, {
                          minimumIntegerDigits: 2,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="sum-flows-text">Total OP Tokens Lost:</h2>
              <h2 className="sum-flows-neg">
                {sumOutflows90.toLocaleString(undefined, {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Double;
