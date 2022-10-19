import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import Pagination from "./Pagination";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const Leaderboard = () => {
  const [OPData, setOPData] = useState([]);
  const [delData, setDelData] = useState([]);
  const [propsData, setPropsData] = useState([]);

  const [OPSort, setOPSort] = useState(true);
  const [propsSort, setPropsSort] = useState(false);
  const [delSort, setDelSort] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [slice, setSlice] = useState([]);
  const rowsPerPage = 10;

  const sliceOPData = (OPData, currentPage, rowsPerPage) => {
    return OPData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };

  const sliceOP = OPData.slice((currentPage - 1) * 10, currentPage * 10);

  const sliceDel = delData.slice((currentPage - 1) * 10, currentPage * 10);

  const sliceProps = propsData.slice((currentPage - 1) * 10, currentPage * 10);

  const sliceDelData = (delData, currentPage, rowsPerPage) => {
    return delData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };

  const slicePropsData = (propsData, currentPage, rowsPerPage) => {
    return propsData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };

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

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryDelegators = {
      sql: "WITH user_delegations AS (SELECT delegator, current_delegate, current_voting_power FROM (SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER (PARTITION BY delegator ORDER BY block_timestamp DESC) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS') WHERE rank = 1), sums AS (SELECT count(DISTINCT delegator) as tot_delegators, sum(current_voting_power) / POW(10,22) as tot_voting_power FROM user_delegations),grp AS (SELECT current_delegate, sum(current_voting_power) / POW(10,22) AS total_op_delegated, count(DISTINCT delegator) AS num_delegating_addresses FROM user_delegations GROUP BY current_delegate), votes AS (SELECT voter, count(proposal_id) AS num_props_voted FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' GROUP BY voter) SELECT current_delegate AS delegate_address, tag_name, COALESCE(num_props_voted, 0) AS num_props_voted, total_op_delegated, total_op_delegated / tot_voting_power * 100 AS percent_voting_power, num_delegating_addresses, num_delegating_addresses / tot_delegators * 100 AS percent_delegating_addresses FROM grp JOIN sums LEFT JOIN votes ON current_delegate = LOWER(voter) LEFT OUTER JOIN crosschain.core.address_tags ON current_delegate = LOWER(address) WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ORDER BY num_delegating_addresses DESC",
      ttlMinutes: 10,
    };

    const resultDelegators = flipside.query
      .run(queryDelegators)
      .then((records) => {
        setDelData(records.rows);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryProps = {
      sql: "WITH user_delegations AS (SELECT delegator, current_delegate, current_voting_power FROM (SELECT block_number, block_timestamp, tx_hash, delegator, from_delegate AS old_delegate, to_delegate AS current_delegate, raw_new_balance as current_voting_power, DENSE_RANK() OVER (PARTITION BY delegator ORDER BY block_timestamp DESC) AS rank FROM optimism.core.fact_delegations WHERE status = 'SUCCESS') WHERE rank = 1), sums AS (SELECT count(DISTINCT delegator) as tot_delegators, sum(current_voting_power) / POW(10,22) as tot_voting_power FROM user_delegations),grp AS (SELECT current_delegate, sum(current_voting_power) / POW(10,22) AS total_op_delegated, count(DISTINCT delegator) AS num_delegating_addresses FROM user_delegations GROUP BY current_delegate), votes AS (SELECT voter, count(proposal_id) AS num_props_voted FROM ethereum.core.ez_snapshot WHERE space_id = 'opcollective.eth' GROUP BY voter) SELECT current_delegate AS delegate_address, tag_name, COALESCE(num_props_voted, 0) AS num_props_voted, total_op_delegated, total_op_delegated / tot_voting_power * 100 AS percent_voting_power, num_delegating_addresses, num_delegating_addresses / tot_delegators * 100 AS percent_delegating_addresses FROM grp JOIN sums LEFT JOIN votes ON current_delegate = LOWER(voter) LEFT OUTER JOIN crosschain.core.address_tags ON current_delegate = LOWER(address) WHERE creator = 'jkhuhnke11' AND blockchain = 'optimism' AND tag_type = 'delegate_name' ORDER BY num_props_voted DESC",
      ttlMinutes: 10,
    };

    const resultProps = flipside.query.run(queryProps).then((records) => {
      setPropsData(records.rows);
      setLoading(false);
    });
  }, []);

  return (
    <div className="single-main">
      {loading ? (
        <div className="loader-blank"></div>
      ) : (
        <>
          <div className="title-date">
            <div className="table-title">
              <h1>Leaderboard: Optimism Delegates</h1>
            </div>
          </div>
          {propsSort ? (
            <div className="table-wrapper">
              <div className="table-scroll">
                <table className="table-main">
                  <thead>
                    <tr>
                      <th className="first-column">
                        Delegate (Link to Etherscan)
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
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[3].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[4].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[5].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[6].toLocaleString(undefined, {
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
                      <th className="first-column">
                        Delegate (Link to Etherscan)
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
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[3].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[4].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[5].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[6].toLocaleString(undefined, {
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
          ) : (
            <div className="table-wrapper">
              <div className="table-scroll">
                <table className="table-main">
                  <thead>
                    <tr>
                      <th className="first-column">
                        Delegate (Link to Etherscan)
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
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[3].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[4].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[5].toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                            minimumIntegerDigits: 2,
                          })}
                        </td>
                        <td className="validator-shares">
                          {delegate[6].toLocaleString(undefined, {
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
        </>
      )}
    </div>
  );
};

export default Leaderboard;
