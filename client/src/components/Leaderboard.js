import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import Pagination from "./Pagination";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import ClipLoader from "react-spinners/ClipLoader";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const Leaderboard = () => {
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

    const queryOP = {
      sql: "WITH user_delegations AS ( SELECT delegator, current_delegate, current_voting_power FROM ( SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER ( PARTITION BY delegator ORDER BY block_timestamp DESC ) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' ) WHERE rank = 1 ), grp AS ( SELECT LOWER(voter) as delegate, voting_power AS voting_power FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' QUALIFY(ROW_NUMBER() over(PARTITION BY voter ORDER BY vote_timestamp DESC)) = 1 ), grp2 AS ( SELECT current_delegate, count(DISTINCT delegator) AS num_delegating_addresses FROM user_delegations GROUP BY current_delegate ), vp AS ( SELECT sum(voting_power) AS tot_voting_power FROM grp ), sums AS ( SELECT count(DISTINCT delegator) as tot_delegators FROM user_delegations ud INNER JOIN grp s ON ud.current_delegate = s.delegate ), votes AS ( SELECT voter, count(proposal_id) AS num_props_voted FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' GROUP BY voter ) SELECT DENSE_RANK() OVER ( ORDER BY voting_power DESC ) as delegate_rank, delegate AS delegate_address, tag_name, COALESCE(num_props_voted, 0) AS num_props_voted, voting_power as total_op_delegated, voting_power / tot_voting_power * 100 AS percent_voting_power, num_delegating_addresses, num_delegating_addresses / tot_delegators * 100 AS percent_delegating_addresses FROM grp g JOIN sums JOIN vp LEFT JOIN votes ON delegate = LOWER(voter) LEFT OUTER JOIN crosschain.core.address_tags ON delegate = LOWER(address) LEFT OUTER JOIN grp2 gg ON g.delegate = gg.current_delegate WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ORDER BY voting_power DESC",
      ttlMinutes: 10,
    };

    const resultOP = flipside.query.run(queryOP).then((records) => {
      setOPData(records.rows);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryDelegators = {
      sql: "WITH user_delegations AS ( SELECT delegator, current_delegate, current_voting_power FROM ( SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER ( PARTITION BY delegator ORDER BY block_timestamp DESC ) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' ) WHERE rank = 1 ), grp AS ( SELECT LOWER(voter) as delegate, voting_power AS voting_power FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' QUALIFY(ROW_NUMBER() over(PARTITION BY voter ORDER BY vote_timestamp DESC)) = 1 ), grp2 AS ( SELECT current_delegate, count(DISTINCT delegator) AS num_delegating_addresses FROM user_delegations GROUP BY current_delegate ), vp AS ( SELECT sum(voting_power) AS tot_voting_power FROM grp ), sums AS ( SELECT count(DISTINCT delegator) as tot_delegators FROM user_delegations ud INNER JOIN grp s ON ud.current_delegate = s.delegate ), votes AS ( SELECT voter, count(proposal_id) AS num_props_voted FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' GROUP BY voter ) SELECT DENSE_RANK() OVER ( ORDER BY voting_power DESC ) as delegate_rank, delegate AS delegate_address, tag_name, COALESCE(num_props_voted, 0) AS num_props_voted, voting_power as total_op_delegated, voting_power / tot_voting_power * 100 AS percent_voting_power, num_delegating_addresses, num_delegating_addresses / tot_delegators * 100 AS percent_delegating_addresses FROM grp g JOIN sums JOIN vp LEFT JOIN votes ON delegate = LOWER(voter) LEFT OUTER JOIN crosschain.core.address_tags ON delegate = LOWER(address) LEFT OUTER JOIN grp2 gg ON g.delegate = gg.current_delegate WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ORDER BY num_delegating_addresses DESC",
      ttlMinutes: 10,
    };

    const resultDelegators = flipside.query
      .run(queryDelegators)
      .then((records) => {
        setDelData(records.rows);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryProps = {
      sql: "WITH user_delegations AS ( SELECT delegator, current_delegate, current_voting_power FROM ( SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER ( PARTITION BY delegator ORDER BY block_timestamp DESC ) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' ) WHERE rank = 1 ), grp AS ( SELECT LOWER(voter) as delegate, voting_power AS voting_power FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' QUALIFY(ROW_NUMBER() over(PARTITION BY voter ORDER BY vote_timestamp DESC)) = 1 ), grp2 AS ( SELECT current_delegate, count(DISTINCT delegator) AS num_delegating_addresses FROM user_delegations GROUP BY current_delegate ), vp AS ( SELECT sum(voting_power) AS tot_voting_power FROM grp ), sums AS ( SELECT count(DISTINCT delegator) as tot_delegators FROM user_delegations ud INNER JOIN grp s ON ud.current_delegate = s.delegate ), votes AS ( SELECT voter, count(proposal_id) AS num_props_voted FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' GROUP BY voter ) SELECT DENSE_RANK() OVER ( ORDER BY voting_power DESC ) as delegate_rank, delegate AS delegate_address, tag_name, COALESCE(num_props_voted, 0) AS num_props_voted, voting_power as total_op_delegated, voting_power / tot_voting_power * 100 AS percent_voting_power, num_delegating_addresses, num_delegating_addresses / tot_delegators * 100 AS percent_delegating_addresses FROM grp g JOIN sums JOIN vp LEFT JOIN votes ON delegate = LOWER(voter) LEFT OUTER JOIN crosschain.core.address_tags ON delegate = LOWER(address) LEFT OUTER JOIN grp2 gg ON g.delegate = gg.current_delegate WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ORDER BY num_props_voted DESC",
      ttlMinutes: 10,
    };

    const resultProps = flipside.query.run(queryProps).then((records) => {
      setPropsData(records.rows);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryDelegators2 = {
      sql: `WITH user_delegations AS ( SELECT delegator, current_delegate, current_voting_power FROM ( SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER ( PARTITION BY delegator ORDER BY block_timestamp DESC ) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' ) WHERE rank = 1 ), most_recent AS ( SELECT delegator, block_timestamp, raw_new_balance / POW(10,21) AS op_delegated FROM optimism.core.fact_delegations WHERE status = 'SUCCESS' qualify(ROW_NUMBER() over(PARTITION BY delegator ORDER BY block_timestamp DESC)) = 1 ) SELECT current_delegate AS delegate_address, tag_name, d.delegator, op_delegated FROM user_delegations d LEFT OUTER JOIN most_recent m ON d.delegator = m.delegator LEFT OUTER JOIN crosschain.core.address_tags ON current_delegate = LOWER(address) WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' AND tag_name = '${dName}' ORDER BY OP_DELEGATED DESC LIMIT 100;`,
      ttlMinutes: 10,
    };

    const resultDelegators2 = flipside.query
      .run(queryDelegators2)
      .then((records) => {
        setDelegatorData(records.rows);
        setLoading(false);
      });
  }, [dName]);

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
                    <td className="validator-shares">{delegate[0]}</td>
                    <td
                      className="delegator-mode"
                      onClick={(e) => {
                        delegatorHandler();
                        setDName(`${delegate[2]}`);
                        setLoading(true);
                      }}
                    >
                      {delegate[2]}
                    </td>
                    <td className="validator-voters">
                      {delegate[3].toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[4].toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[5].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[6].toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[7].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
                    <td className="validator-shares">{delegate[0]}</td>
                    <td
                      className="delegator-mode"
                      onClick={(e) => {
                        delegatorHandler();
                        setDName(`${delegate[2]}`);
                        setLoading(true);
                      }}
                    >
                      {delegate[2]}
                    </td>
                    <td className="validator-voters">
                      {delegate[3].toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[4].toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[5].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[6].toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[7].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
                        />
                      </div>
                      <p className="load-delegators">Loading Individual Delegators</p>
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
                    <td className="validator-shares">{delegate[0]}</td>
                    <td
                      className="delegator-mode"
                      onClick={(e) => {
                        delegatorHandler();
                        setDName(`${delegate[2]}`);
                        setLoading(true);
                      }}
                    >
                      {delegate[2]}
                    </td>
                    <td className="validator-voters">
                      {delegate[3].toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[4].toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[5].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[6].toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumIntegerDigits: 2,
                      })}
                    </td>
                    <td className="validator-shares">
                      {delegate[7].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
