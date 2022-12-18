import React, { useState, useEffect, useRef } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import Pagination from "./Pagination";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const Leaderboard = (props) => {
  const notInitialRender = useRef(false);
  const [OPData, setOPData] = useState([]);
  const [delData, setDelData] = useState([]);
  const [propsData, setPropsData] = useState([]);
  const [dName, setDName] = useState("");
  const [delegatorData, setDelegatorData] = useState([]);

  const [OPSort, setOPSort] = useState(true);
  const [propsSort, setPropsSort] = useState(false);
  const [delSort, setDelSort] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delegatorMode, setDelegatorMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const sliceOP = OPData.slice((currentPage - 1) * 10, currentPage * 10);

  const sliceProps = propsData.slice((currentPage - 1) * 10, currentPage * 10);

  const sliceDel = delData.slice((currentPage - 1) * 10, currentPage * 10);

  const sliceDelegatorData = delegatorData.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const propsSortHandler = () => {
    setOPSort(false);
    setDelSort(false);
    setPropsSort(true);
  };

  const delSortHandler = () => {
    setOPSort(false);
    setPropsSort(false);
    setDelSort(true);
  };

  const OPSortHandler = () => {
    setDelSort(false);
    setPropsSort(false);
    setOPSort(true);
  };

  const delegatorHandler = () => {
    setDelegatorMode(!delegatorMode);
    setDelSort(false);
    setPropsSort(false);
    setOPSort(false);
  };

  const ttText =
    "Click delegate name to see list of top delegators. Click again to return to original leaderboard. Please be patient. Data will update in ~10 seconds!";

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryDelegators2 = {
      sql: `WITH user_delegations AS ( SELECT delegator, current_delegate, current_voting_power FROM ( SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER ( PARTITION BY delegator ORDER BY block_timestamp DESC ) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' ) WHERE rank = 1 ), most_recent AS ( SELECT delegator, block_timestamp, raw_new_balance / POW(10,21) AS op_delegated FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' qualify(ROW_NUMBER() over(PARTITION BY delegator ORDER BY block_timestamp DESC)) = 1 ) SELECT current_delegate AS delegate_address, tag_name, d.delegator, op_delegated FROM user_delegations d LEFT OUTER JOIN most_recent m ON d.delegator = m.delegator LEFT OUTER JOIN crosschain.core.address_tags ON current_delegate = LOWER(address) WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' AND tag_name = '${dName}' ORDER BY OP_DELEGATED DESC LIMIT 100;`,
      ttlMinutes: 60,
    };

    if (notInitialRender.current) {
      const resultDelegators2 = flipside.query
        .run(queryDelegators2)
        .then((records) => {
          setDelegatorData(records.rows);
          setLoading(false);
        });
    }
    return () => {
      notInitialRender.current = true;
    };
  }, [dName]);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/c0d79fdd-2664-4a75-95bb-9858c8b4b4d6/data/latest"
      )
      .then((res) => {
        setOPData(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/7cf06bfc-059c-4c80-9682-bd6302280315/data/latest"
      )
      .then((res) => {
        setDelData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/5c0b917b-cef7-496a-8996-be8ab01afe5f/data/latest"
      )
      .then((res) => {
        setPropsData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="single-main-leader">
      <div className="title-date">
        <div className="table-title">
          <h1 className="leader-title">Leaderboard: Optimism Delegates</h1>
        </div>
      </div>
      {propsSort ? (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="table-main">
              <thead>
                <tr>
                  <th># Rank</th>
                  <th className="first-column">
                    Delegate{" "}
                    <Tooltip
                      title={ttText}
                      placement="bottom"
                      fontSize="inherit"
                    >
                      <InfoOutlinedIcon></InfoOutlinedIcon>
                    </Tooltip>
                  </th>
                  <th className="sorter" onClick={propsSortHandler}>
                    Total Votes
                  </th>
                  <th className="sorter" onClick={OPSortHandler}>
                    OP Tokens Delegated
                  </th>
                  <th className="sorter" onClick={OPSortHandler}>
                    % Voting Power
                  </th>
                  <th className="sorter" onClick={delSortHandler}>
                    Num. Delegating Addresses
                  </th>
                  <th className="sorter" onClick={delSortHandler}>
                    % Delegating Addresses
                  </th>
                </tr>
              </thead>
              <tbody>
                {sliceProps.map((delegate, index) => (
                  <tr>
                    <td className="validator-shares">
                      {delegate["DELEGATE_RANK"]}
                    </td>
                    <td
                      className="delegator-mode"
                      onClick={(e) => {
                        delegatorHandler();
                        setDName(`${delegate["TAG_NAME"]}`);
                        setLoading(true);
                      }}
                    >
                      {delegate["TAG_NAME"]}
                    </td>
                    <td className="validator-voters">
                      {delegate["NUM_PROPS_VOTED"].toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate["TOTAL_OP_DELEGATED"].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["PERCENT_VOTING_POWER"].toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["NUM_DELEGATING_ADDRESSES"].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["PERCENT_DELEGATING_ADDRESSES"].toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              total={180}
              limit={20}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : delSort ? (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="table-main">
              <thead>
                <tr>
                  <th># Rank</th>
                  <th className="first-column">
                    Delegate{" "}
                    <Tooltip
                      title={ttText}
                      placement="bottom"
                      fontSize="inherit"
                    >
                      <InfoOutlinedIcon></InfoOutlinedIcon>
                    </Tooltip>
                  </th>
                  <th className="sorter" onClick={propsSortHandler}>
                    Total Votes
                  </th>
                  <th className="sorter" onClick={OPSortHandler}>
                    OP Tokens Delegated
                  </th>
                  <th className="sorter" onClick={OPSortHandler}>
                    % Voting Power
                  </th>
                  <th className="sorter" onClick={delSortHandler}>
                    Num. Delegating Addresses
                  </th>
                  <th className="sorter" onClick={delSortHandler}>
                    % Delegating Addresses
                  </th>
                </tr>
              </thead>
              <tbody>
                {sliceDel.map((delegate, index) => (
                  <tr>
                    <td className="validator-shares">
                      {delegate["DELEGATE_RANK"]}
                    </td>
                    <td
                      className="delegator-mode"
                      onClick={(e) => {
                        delegatorHandler();
                        setDName(`${delegate["TAG_NAME"]}`);
                        setLoading(true);
                      }}
                    >
                      {delegate["TAG_NAME"]}
                    </td>
                    <td className="validator-voters">
                      {delegate["NUM_PROPS_VOTED"].toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate["TOTAL_OP_DELEGATED"].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["PERCENT_VOTING_POWER"].toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["NUM_DELEGATING_ADDRESSES"].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["PERCENT_DELEGATING_ADDRESSES"].toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              total={180}
              limit={20}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : delegatorMode ? (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="table-main">
              <thead>
                <tr>
                  <th className="first-column">
                    Delegate{" "}
                    <Tooltip
                      title={ttText}
                      placement="bottom"
                      fontSize="inherit"
                    >
                      <InfoOutlinedIcon></InfoOutlinedIcon>
                    </Tooltip>
                  </th>
                  <th className="sorter">Wallet Address (Link to Etherscan)</th>
                  <th className="sorter">OP Tokens Delegated</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="chart-area-values">
                        <ClipLoader
                          className="spinner-values"
                          size={50}
                          speedMultiplier={0.75}
                          color={props.dark ? "#ceced8" : "#000000"}
                        />
                      </div>
                      <p className="load-delegators">
                        Loading Individual Delegators
                      </p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {sliceDelegatorData.map((delegate, index) => (
                      <tr>
                        <td
                          className="delegator-mode"
                          onClick={(e) => {
                            delegatorHandler();
                            setDName(`${delegate[1]}`);
                            setLoading(true);
                          }}
                        >
                          {delegate[1]}
                        </td>
                        <td className="validator-shares">
                          <a
                            href={"https://etherscan.io/address/".concat(
                              delegate[2]
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-links"
                          >
                            {delegate[2]}
                          </a>
                        </td>
                        <td className="validator-shares">
                          {delegate[3].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              total={180}
              limit={20}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="table-main">
              <thead>
                <tr>
                  <th># Rank</th>
                  <th className="first-column">
                    Delegate{" "}
                    <Tooltip
                      title={ttText}
                      placement="bottom"
                      fontSize="inherit"
                    >
                      <InfoOutlinedIcon></InfoOutlinedIcon>
                    </Tooltip>
                  </th>
                  <th className="sorter" onClick={propsSortHandler}>
                    Total Votes
                  </th>
                  <th className="sorter" onClick={OPSortHandler}>
                    OP Tokens Delegated
                  </th>
                  <th className="sorter" onClick={OPSortHandler}>
                    % Voting Power
                  </th>
                  <th className="sorter" onClick={delSortHandler}>
                    Num. Delegating Addresses
                  </th>
                  <th className="sorter" onClick={delSortHandler}>
                    % Delegating Addresses
                  </th>
                </tr>
              </thead>
              <tbody>
                {sliceOP.map((delegate, index) => (
                  <tr>
                    <td className="validator-shares">
                      {delegate["DELEGATE_RANK"]}
                    </td>
                    <td
                      className="delegator-mode"
                      onClick={(e) => {
                        delegatorHandler();
                        setDName(`${delegate["TAG_NAME"]}`);
                        setLoading(true);
                      }}
                    >
                      {delegate["TAG_NAME"]}
                    </td>
                    <td className="validator-voters">
                      {delegate["NUM_PROPS_VOTED"].toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate["TOTAL_OP_DELEGATED"].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["PERCENT_VOTING_POWER"].toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["NUM_DELEGATING_ADDRESSES"].toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </td>
                    <td className="validator-shares">
                      {delegate["PERCENT_DELEGATING_ADDRESSES"].toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              total={180}
              limit={20}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
