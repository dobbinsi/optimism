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
  const [ninetyLineData, setNinetyLineData] = useState([]);
  const [oneLineData, setOneLineData] = useState([]);
  const [thirtyLineData, setThirtyLineData] = useState([]);
  const [propsData, setPropsData] = useState([]);

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

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryThirtyLine = {
      sql: "SELECT vote_timestamp :: date as vote_date, count(DISTINCT voter) as num_voters FROM ethereum.core.ez_snapshot WHERE vote_timestamp :: date >= CURRENT_DATE - 30 AND space_id = 'opcollective.eth' GROUP BY vote_timestamp :: date ORDER BY vote_timestamp :: date ASC",
      ttlMinutes: 1,
    };

    const resultThirtyLine = flipside.query
      .run(queryThirtyLine)
      .then((records) => {
        setThirtyLineData(records.rows);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryNinetyLine = {
      sql: "SELECT vote_timestamp :: date as vote_date, count(DISTINCT voter) as num_voters FROM ethereum.core.ez_snapshot WHERE vote_timestamp :: date >= CURRENT_DATE - 90 AND space_id = 'opcollective.eth' GROUP BY vote_timestamp :: date ORDER BY vote_timestamp :: date ASC",
      ttlMinutes: 1,
    };

    const resultNinetyLine = flipside.query
      .run(queryNinetyLine)
      .then((records) => {
        setNinetyLineData(records.rows);
      });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryOneLine = {
      sql: "SELECT vote_timestamp :: date as vote_date, count(DISTINCT voter) as num_voters FROM ethereum.core.ez_snapshot WHERE vote_timestamp :: date >= CURRENT_DATE - 180 AND space_id = 'opcollective.eth' GROUP BY vote_timestamp :: date ORDER BY vote_timestamp :: date ASC",
      ttlMinutes: 1,
    };

    const resultOneLine = flipside.query.run(queryOneLine).then((records) => {
      setOneLineData(records.rows);
    });
  }, []);

  useEffect(() => {
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    const queryProps = {
      sql: "with props as ( select proposal_start_time :: date as date, proposal_id, 1 as num FROM ETHEREUM.CORE.EZ_SNAPSHOT WHERE space_id = 'opcollective.eth' qualify (ROW_NUMBER() over (partition by proposal_id order by vote_timestamp DESC)) = 1 ), pre_final as ( SELECT date, sum(num) over (order by date) as prop_time FROM props ) select date, prop_time from pre_final qualify (ROW_NUMBER() over (partition by date order by prop_time desc)) = 1 ORDER BY date ASC",
      ttlMinutes: 1,
    };

    const resultProps = flipside.query.run(queryProps).then((records) => {
      setPropsData(records.rows);
    });
  }, []);

  const datesThirty = thirtyLineData.map((item) => {
    return item[0];
  });

  const amountsThirty = thirtyLineData.map((item) => {
    return item[1];
  });

  const datesNinety = ninetyLineData.map((item) => {
    return item[0];
  });

  const amountsNinety = ninetyLineData.map((item) => {
    return item[1];
  });

  const datesOne = oneLineData.map((item) => {
    return item[0];
  });

  const amountsOne = oneLineData.map((item) => {
    return item[1];
  });

  const datesProps = propsData.map((item) => {
    return item[0];
  });

  const amountsProps = propsData.map((item) => {
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
        text: "Snapshot Voting Activity Over Time (Distinct Voters)",
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

  const propChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            family: "'Rubik', sans-serif",
          },
          minRotation: 45,
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
        text: "Cumulative Snapshot Proposals Over Time",
        font: {
          size: 18,
          family: "'Rubik', sans-serif",
          weight: "lighter",
        },
      },
    },
  };

  const propChartData = {
    labels: datesProps,
    datasets: [
      {
        label: "Total Proposals",
        data: amountsProps,
        backgroundColor: "#ffdbe0",
        borderColor: "#ff1420",
        pointRadius: 2,
        fill: true,
      },
    ],
  };

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
              <Line
                options={propChartOptions}
                data={propChartData}
                className="props-line"
              />
            </div>
          )}
          {ninetyState && (
            <div className="chart-area">
              <Line options={chartOptions} data={chartData2} />
              <Line
                options={propChartOptions}
                data={propChartData}
                className="props-line"
              />
            </div>
          )}
          {oneState && (
            <div className="chart-area">
              <Line options={chartOptions} data={chartData3} />
              <Line
                options={propChartOptions}
                data={propChartData}
                className="props-line"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LineVotes;
