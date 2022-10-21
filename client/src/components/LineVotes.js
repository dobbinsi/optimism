import React, { useState, useEffect } from "react";
import { Flipside } from "@flipsidecrypto/sdk";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const LineVotes = () => {
  const [loading, setLoading] = useState(true);
  const [ninetyData, setNinetyData] = useState([]);
  const [oneData, setOneData] = useState([]);
  const [thirtyData, setThirtyData] = useState([]);

  const [thirtyState, setThirtyState] = useState(false);
  const [ninetyState, setNinetyState] = useState(false);
  const [oneState, setOneState] = useState(true);

  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(true);

  const thirtyHandler = () => {
    setThirtyState(true);
    setNinetyState(false);
    setOneState(false);
    setActive1(true);
    setActive2(false);
    setActive3(false);
  };

  const ninetyHandler = () => {
    setThirtyState(false);
    setNinetyState(true);
    setOneState(false);
    setActive1(false);
    setActive2(true);
    setActive3(false);
  };

  const oneHandler = () => {
    setThirtyState(false);
    setNinetyState(false);
    setOneState(true);
    setActive1(false);
    setActive2(false);
    setActive3(true);
  };

  const datesThirty = thirtyData.map((item) => {
    return item[0];
  });

  const amountsThirty = thirtyData.map((item) => {
    return item[1];
  });

  const datesNinety = ninetyData.map((item) => {
    return item[0];
  });

  const amountsNinety = ninetyData.map((item) => {
    return item[1];
  });

  const datesOne = oneData.map((item) => {
    return item[0];
  });

  const amountsOne = oneData.map((item) => {
    return item[1];
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            family: "'Rubik', sans-serif",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: {
            family: "'Rubik', sans-serif",
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "",
      },
      title: {
        display: true,
        text: "Snapshot Voting Activity Over Time",
        font: {
          size: 18,
          family: "'Rubik', sans-serif",
          weight: "lighter",
        },
      },
    },
  };

  const chartData1 = {
    labels: datesThirty,
    datasets: [
      {
        label: "Distinct Voters",
        data: amountsThirty,
        backgroundColor: "#ffdbe0",
        borderColor: "#ff1420",
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const chartData2 = {
    labels: datesNinety,
    datasets: [
      {
        label: "Distinct Voters",
        data: amountsNinety,
        backgroundColor: "#ffdbe0",
        borderColor: "#ff1420",
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const chartData3 = {
    labels: datesOne,
    datasets: [
      {
        label: "Distinct Voters",
        data: amountsOne,
        backgroundColor: "#ffdbe0",
        borderColor: "#ff1420",
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryThirty = {
      sql: "SELECT vote_timestamp :: date as vote_date, count(DISTINCT voter) as num_voters FROM ethereum.core.ez_snapshot WHERE vote_timestamp :: date >= CURRENT_DATE - 30 AND space_id = 'opcollective.eth' GROUP BY vote_timestamp :: date ORDER BY vote_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultThirty = flipside.query.run(queryThirty).then((records) => {
      setThirtyData(records.rows);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryNinety = {
      sql: "SELECT vote_timestamp :: date as vote_date, count(DISTINCT voter) as num_voters FROM ethereum.core.ez_snapshot WHERE vote_timestamp :: date >= CURRENT_DATE - 90 AND space_id = 'opcollective.eth' GROUP BY vote_timestamp :: date ORDER BY vote_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultNinety = flipside.query.run(queryNinety).then((records) => {
      setNinetyData(records.rows);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryOne = {
      sql: "SELECT vote_timestamp :: date as vote_date, count(DISTINCT voter) as num_voters FROM ethereum.core.ez_snapshot WHERE vote_timestamp :: date >= CURRENT_DATE - 180 AND space_id = 'opcollective.eth' GROUP BY vote_timestamp :: date ORDER BY vote_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultOne = flipside.query.run(queryOne).then((records) => {
      setOneData(records.rows);
    });
  }, []);

  return (
    <div className="single-main-leader">
      {loading ? (
        <div className="loader-blank"></div>
      ) : (
        <>
          <div className="title-date">
            <div className="table-title">
              <h1>Trends: Voting Activity</h1>
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
                onClick={ninetyHandler}
              >
                90
              </button>
              <button
                style={{ color: active3 ? "#ff1420" : "#68778d" }}
                onClick={oneHandler}
              >
                180
              </button>
            </div>
          </div>
          {thirtyState && (
            <div className="chart-area">
              <Line options={chartOptions} data={chartData1} />
            </div>
          )}
          {ninetyState && (
            <div className="chart-area">
              <Line options={chartOptions} data={chartData2} />
            </div>
          )}
          {oneState && (
            <div className="chart-area">
              <Line options={chartOptions} data={chartData3} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LineVotes;
