import React, { useState, useEffect } from "react";
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
  LogarithmicScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const Redelegations = () => {
  const [ninetyTotData, setNinetyTotData] = useState([]);
  const [oneTotData, setOneTotData] = useState([]);
  const [thirtyTotData, setThirtyTotData] = useState([]);
  const [ninetyReData, setNinetyReData] = useState([]);
  const [oneReData, setOneReData] = useState([]);
  const [thirtyReData, setThirtyReData] = useState([]);

  const [thirtyState, setThirtyState] = useState(true);
  const [ninetyState, setNinetyState] = useState(false);
  const [oneState, setOneState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);

  const chartDates30 = thirtyTotData.map((item) => {
    return item[0];
  });
  const chartDates90 = ninetyTotData.map((item) => {
    return item[0];
  });
  const chartDates180 = oneTotData.map((item) => {
    return item[0];
  });

  const chartAmounts30Tot = thirtyTotData.map((item) => {
    return item[1];
  });
  const chartAmounts90Tot = ninetyTotData.map((item) => {
    return item[1];
  });
  const chartAmounts180Tot = oneTotData.map((item) => {
    return item[1];
  });
  const chartAmounts30Re = thirtyReData.map((item) => {
    return item[1];
  });
  const chartAmounts90Re = ninetyReData.map((item) => {
    return item[1];
  });
  const chartAmounts180Re = oneReData.map((item) => {
    return item[1];
  });

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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    LogarithmicScale
  );

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
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
      },
      title: {
        display: true,
        text: "Total OP Tokens Delegated",
        font: {
          size: 18,
          family: "'Rubik', sans-serif",
          weight: "lighter",
        },
      },
    },
  };

  const chartOptions2 = {
    responsive: true,
    scales: {
      x: {
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
        min: 1000,
        max: 10000000,
        stepSize: 10000,
        ticks: {
          font: {
            family: "'Rubik', sans-serif",
          },
          color: "#8b949e",
        },
        grid: {
          display: false,
        },
        // display: true,
        type: "logarithmic",
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Total OP Tokens Delegated - Log Scale",
        font: {
          size: 18,
          family: "'Rubik', sans-serif",
          weight: "lighter",
        },
      },
    },
  };

  const chartData30 = {
    labels: chartDates30,
    datasets: [
      {
        label: "OP Delegated",
        data: chartAmounts30Tot,
        backgroundColor: "#ff1420",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
      {
        label: "OP Re-Delegated",
        data: chartAmounts30Re,
        backgroundColor: "#99a7bc",
        borderColor: ["#3d4147"],
        borderWidth: 1.5,
      },
    ],
  };

  const chartData90 = {
    labels: chartDates90,
    datasets: [
      {
        label: "OP Delegated",
        data: chartAmounts90Tot,
        backgroundColor: "#ff1420",
        borderColor: ["#3d4147"],
        borderWidth: 0.75,
      },
      {
        label: "OP Re-Delegated",
        data: chartAmounts90Re,
        backgroundColor: "#99a7bc",
        borderColor: ["#3d4147"],
        borderWidth: 0.75,
      },
    ],
  };

  const chartData180 = {
    labels: chartDates180,
    datasets: [
      {
        label: "OP Delegated",
        data: chartAmounts180Tot,
        backgroundColor: "#ff1420",
        borderColor: ["#3d4147"],
        borderWidth: 0.75,
      },
      {
        label: "OP Re-Delegated",
        data: chartAmounts180Re,
        backgroundColor: "#99a7bc",
        borderColor: ["#3d4147"],
        borderWidth: 0.75,
      },
    ],
  };

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryThirtyTot = {
      sql: "SELECT block_timestamp :: date, sum(raw_new_balance) / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations WHERE block_timestamp :: date >= CURRENT_DATE - 30 GROUP BY block_timestamp :: date ORDER BY block_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultThirtyTot = flipside.query
      .run(queryThirtyTot)
      .then((records) => {
        setThirtyTotData(records.rows);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryThirtyRe = {
      sql: "SELECT block_timestamp :: date, sum(raw_new_balance) / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations WHERE block_timestamp :: date >= CURRENT_DATE - 30 AND delegation_type = 'Re-Delegation' GROUP BY block_timestamp :: date ORDER BY block_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultThirtyRe = flipside.query.run(queryThirtyRe).then((records) => {
      setThirtyReData(records.rows);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryNinetyTot = {
      sql: "SELECT block_timestamp :: date, sum(raw_new_balance) / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations WHERE block_timestamp :: date >= CURRENT_DATE - 90 GROUP BY block_timestamp :: date ORDER BY block_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultNinetyTot = flipside.query
      .run(queryNinetyTot)
      .then((records) => {
        setNinetyTotData(records.rows);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryNinetyRe = {
      sql: "SELECT block_timestamp :: date, sum(raw_new_balance) / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations WHERE block_timestamp :: date >= CURRENT_DATE - 90 AND delegation_type = 'Re-Delegation' GROUP BY block_timestamp :: date ORDER BY block_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultNinetyRe = flipside.query.run(queryNinetyRe).then((records) => {
      setNinetyReData(records.rows);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryOneTot = {
      sql: "SELECT block_timestamp :: date, sum(raw_new_balance) / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations WHERE block_timestamp :: date >= CURRENT_DATE - 180 GROUP BY block_timestamp :: date ORDER BY block_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultOneTot = flipside.query.run(queryOneTot).then((records) => {
      setOneTotData(records.rows);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryOneRe = {
      sql: "SELECT block_timestamp :: date, sum(raw_new_balance) / POW(10,21) AS OP_delegated FROM optimism.core.fact_delegations WHERE block_timestamp :: date >= CURRENT_DATE - 180 AND delegation_type = 'Re-Delegation' GROUP BY block_timestamp :: date ORDER BY block_timestamp :: date ASC",
      ttlMinutes: 10,
    };

    const resultOneRe = flipside.query.run(queryOneRe).then((records) => {
      setOneReData(records.rows);
      setLoading(false);
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
              <h1>Trends: Delegation Activity</h1>
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
              <Bar options={chartOptions} data={chartData30} />
            </div>
          )}
          {ninetyState && (
            <div className="chart-area">
              <Bar options={chartOptions} data={chartData90} />
            </div>
          )}
          {oneState && (
            <div className="chart-area">
              <Bar options={chartOptions2} data={chartData180} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Redelegations;
