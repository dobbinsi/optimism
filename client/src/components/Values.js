import React, { useState, useEffect, useRef } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputLabel } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const Values = (props) => {
  const notInitialRender = useRef(false);
  const [loading, setLoading] = useState(false);
  const [valuesData, setValuesData] = useState([]);
  const [value, setValue] = useState("data and analytics");
  const [defMode, setDefMode] = useState(true);
  const [defData, setDefData] = useState([]);

  const handleChange = (event) => {
    setValue(event.target.value);
    setDefMode(false);
    setLoading(true);
  };

  const chartLabels = valuesData.map((item) => {
    return item[1];
  });

  const chartData1 = valuesData.map((item) => {
    return item[3];
  });

  const chartData2 = valuesData.map((item) => {
    return item[4];
  });

  const chartData3 = valuesData.map((item) => {
    return item[5];
  });

  const chartLabelsDef = defData.map((item) => {
    return item["DELEGATE_NAME"];
  });

  const chartData1Def = defData.map((item) => {
    return item["FORS"];
  });

  const chartData2Def = defData.map((item) => {
    return item["AGAINSTS"];
  });

  const chartData3Def = defData.map((item) => {
    return item["ABSTAINS"];
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            family: "'Rubik', sans-serif",
          },
          color: "#8b949e",
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            family: "'Rubik', sans-serif",
          },
          color: "#8b949e",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#8b949e",
        },
      },
      title: {
        display: true,
        text: "Total Votes by Category",
        font: {
          size: 18,
          family: "'Rubik', sans-serif",
          weight: "lighter",
        },
        color: "#8b949e",
      },
    },
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "For",
        data: chartData1,
        backgroundColor: "#3d4147",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
      {
        label: "Against",
        data: chartData2,
        backgroundColor: "#ff1420",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
      {
        label: "Abstain",
        data: chartData3,
        backgroundColor: "#99a7bc",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
    ],
  };

  const chartDataDef = {
    labels: chartLabelsDef,
    datasets: [
      {
        label: "For",
        data: chartData1Def,
        backgroundColor: "#3d4147",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
      {
        label: "Against",
        data: chartData2Def,
        backgroundColor: "#ff1420",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
      {
        label: "Abstain",
        data: chartData3Def,
        backgroundColor: "#99a7bc",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
    ],
  };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryValuesVotes = {
      sql: `WITH votes AS (SELECT voter AS delegate, proposal_title, CASE WHEN trim(vote_option :: STRING, '[""]') ilike 1 THEN 'For' WHEN trim(vote_option :: STRING, '[""]') ilike 2 THEN 'Against' ELSE 'Abstain' END AS vote_option, tag_name AS value FROM ethereum.core.ez_snapshot LEFT OUTER JOIN crosschain.core.address_tags ON LOWER(voter) = LOWER(address) WHERE space_id = 'opcollective.eth' AND creator = 'jkhuhnke11' AND tag_type = 'delegate_value' AND blockchain = 'optimism' AND tag_name = '${value}' ), forr AS ( SELECT delegate, count(vote_option) as fors FROM votes WHERE vote_option = 'For' group by delegate ), against AS (SELECT delegate, count(vote_option) as againsts FROM votes WHERE vote_option = 'Against' group by delegate ), abstain AS ( SELECT delegate, count(vote_option) as abstains FROM votes WHERE vote_option = 'Abstain' group by delegate ) SELECT DISTINCT d.delegate, tag_name as delegate_name, value, fors, againsts, abstains FROM votes d INNER JOIN abstain a ON d.delegate = a.delegate INNER JOIN against ag ON d.delegate = ag.delegate INNER JOIN forr f ON d.delegate = f.delegate LEFT OUTER JOIN crosschain.core.address_tags ON LOWER(d.delegate) = LOWER(address) WHERE creator = 'jkhuhnke11' AND tag_type = 'delegate_name' AND blockchain = 'optimism' AND value = '${value}'`,
      ttlMinutes: 60,
    };

    if (notInitialRender.current) {
      const resultValuesVotes = flipside.query
        .run(queryValuesVotes)
        .then((records) => {
          setValuesData(records.rows);
          setLoading(false);
        });
    }
    return () => {
      notInitialRender.current = true;
    };
  }, [value]);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/affcf9aa-cde0-45e7-9090-a5d90d276f93/data/latest"
      )
      .then((res) => {
        setDefData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="single-main-leader">
      <div className="single-main">
        <div className="title-date">
          <div className="table-title">
            <h1 className="leader-title">
              Trends: How Delegates Vote Based on Values
            </h1>
          </div>
        </div>
        <div className="date-toggle-values">
          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id="input-label" className="select-date">
              Select Value
            </InputLabel>
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
              <MenuItem value={"accessibility"}>Accessibility</MenuItem>
              <MenuItem value={"bridges"}>Bridges</MenuItem>
              <MenuItem value={"communication"}>Communication</MenuItem>
              <MenuItem value={"DAO"}>DAO</MenuItem>
              <MenuItem value={"data and analytics"}>
                Data and Analytics
              </MenuItem>
              <MenuItem value={"defi"}>DeFi</MenuItem>
              <MenuItem value={"developer tools"}>Developer Tools</MenuItem>
              <MenuItem value={"economics"}>Economics</MenuItem>
              <MenuItem value={"education"}>Education</MenuItem>
              <MenuItem value={"environment"}>Environment</MenuItem>
              <MenuItem value={"events"}>Events</MenuItem>
              <MenuItem value={"gaming"}>Gaming</MenuItem>
              <MenuItem value={"governance"}>Governance</MenuItem>
              <MenuItem value={"identity"}>Identity</MenuItem>
              <MenuItem value={"infrastructure"}>Infrastructure</MenuItem>
              <MenuItem value={"legal"}>Legal</MenuItem>
              <MenuItem value={"metaverse"}>Metaverse</MenuItem>
              <MenuItem value={"music"}>Music</MenuItem>
              <MenuItem value={"NFT"}>NFT</MenuItem>
              <MenuItem value={"oracles"}>Oracles</MenuItem>
              <MenuItem value={"partnership"}>Partnership</MenuItem>
              <MenuItem value={"privacy"}>Privacy</MenuItem>
              <MenuItem value={"research"}>Research</MenuItem>
              <MenuItem value={"security"}>Security</MenuItem>
              <MenuItem value={"social impact"}>Social Impact</MenuItem>
              <MenuItem value={"wallets"}>Wallets</MenuItem>
              <MenuItem value={"writing"}>Writing</MenuItem>
            </Select>
          </FormControl>
        </div>
        {defMode ? (
          <div className="chart-area">
            <Bar options={chartOptions} data={chartDataDef} />
          </div>
        ) : (
          <>
            {loading ? (
              <>
                <div className="chart-area-values">
                  <ClipLoader
                    className="spinner-values"
                    size={50}
                    speedMultiplier={0.75}
                    color={props.dark ? "#ceced8" : "#000000"}
                  />
                </div>
                <p className="load-delegators-val">Loading Chart</p>
              </>
            ) : (
              <div className="chart-area">
                <Bar options={chartOptions} data={chartData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Values;
