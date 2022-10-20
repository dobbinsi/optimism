import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputLabel } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import Pagination from "./Pagination";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const IndiVotes = () => {
  const delegates = [
    "Annymesh Mohanty",
    "Blockchain at Berkeley",
    "Blockchain@Hopkins",
    "Butterbum",
    "ceresstation",
    "Cryptotesters",
    "Daniele Salatti",
    "Darwin",
    "David Mihal",
    "Devon Zuegel",
    "Dhannte",
    "Doug",
    "Exosphere",
    "Flipside Crypto",
    "Forrest Norwood",
    "GFX Labs",
    "Griff Green",
    "Jack Anorak",
    "Jacob",
    "Jiawei Hu",
    "Jonathan West",
    "Joxes | DeFi LATAM",
    "Katie",
    "L2BEAT",
    "Lefteris Karapetsas",
    "Linda Xie",
    "Matthew Bunday",
    "Michael Vander Meiden",
    "MinimalGravitas",
    "mjs",
    "olimpio",
    "OPUser | L222",
    "Pat LaVecchia",
    "Penn Blockchain",
    "Perpetual Protocol Foundation Team",
    "Polynya",
    "Pseudotheos",
    "Quixotic (Optimism NFT Marketplace)",
    "Reverie",
    "Rick Dudley",
    "she256",
    "Solarcurve",
    "StableNode",
    "Synthetix Ambassador Council",
    "The Ethernaut",
    "The Wildfire Infrastructure Pod",
    "web3magnetic",
    "wojtek",
    "Yoav Weiss",
    "Zeng Jiajun",
  ];

  const [loading, setLoading] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue] = useState("Flipside Crypto");
  const handleChange = (event) => setValue(event.target.value);

  const [currentPage, setCurrentPage] = useState(1);
  const sliceData = data.slice((currentPage - 1) * 10, currentPage * 10);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryVotes = {
      sql: `SELECT proposal_title, vote_timestamp :: date AS date, trim(vote_option :: STRING, '["""]') as vote_option, CASE WHEN trim(vote_option :: STRING, '["""]') = 1 THEN 'For' WHEN trim(vote_option :: STRING, '["""]') = 2 THEN 'Against' ELSE 'Abstain' END AS vote FROM ethereum.core.ez_snapshot WHERE voter = '0x62a43123FE71f9764f26554b3F5017627996816a' AND space_id = 'opcollective.eth' ORDER BY date DESC`,
      ttlMinutes: 10,
    };

    const resultVotes = flipside.query.run(queryVotes).then((records) => {
      setData(records.rows);
      setLoading(false);
    });
  }, [value]);

  return (
    <div className="single-main">
      {loading ? (
        <div className="loader-blank"></div>
      ) : (
        <>
          <div className="single-main">
            <div className="title-date">
              <div className="table-title">
                <h1>Voting Activity: Individual Delegates</h1>
              </div>
            </div>
            <div className="date-toggle-values">
              <FormControl sx={{ m: 1, minWidth: 100 }}>
                <InputLabel id="input-label">Select Value</InputLabel>
                <Select
                  id="values"
                  value={value}
                  label="value"
                  disableUnderline
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                  onChange={handleChange}
                >
                  {delegates.map((delegate, index) => {
                    return <MenuItem value={delegate}>{delegate}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="table-wrapper">
              <div className="table-scroll">
                <table className="table-main">
                  <thead>
                    <tr>
                      <th className="first-column">Proposal Title</th>
                      <th className="sorter">Date</th>
                      <th className="sorter">Vote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sliceData.map((vote, index) => (
                      <tr>
                        <td>{vote[0]}</td>
                        <td className="validator-voters">{vote[1]}</td>
                        <td className="validator-voters">{vote[3]}</td>
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
          </div>
        </>
      )}
    </div>
  );
};

export default IndiVotes;
