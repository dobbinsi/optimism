import React, { useState, useEffect } from "react";
import axios from "axios";

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

const LineVotes = (props) => {
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
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/ffe8a842-f78f-476e-b257-8f2a29fea3f2/data/latest"
      )
      .then((res) => {
        setThirtyLineData(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/9f961975-9cc8-4ccf-b250-ab7fc8217ca5/data/latest"
      )
      .then((res) => {
        setNinetyLineData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/b7ec34e6-64b8-47ee-a97d-6cb8175e70da/data/latest"
      )
      .then((res) => {
        setOneLineData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://node-api.flipsidecrypto.com/api/v2/queries/6cd8278e-be97-4736-860c-7c24b3cc0672/data/latest"
      )
      .then((res) => {
        setPropsData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const datesThirty = thirtyLineData.map((item) => {
    return item["VOTE_DATE"];
  });

  const amountsThirty = thirtyLineData.map((item) => {
    return item["NUM_VOTERS"];
  });

  const datesNinety = ninetyLineData.map((item) => {
    return item["VOTE_DATE"];
  });

  const amountsNinety = ninetyLineData.map((item) => {
    return item["NUM_VOTERS"];
  });

  const datesOne = oneLineData.map((item) => {
    return item["VOTE_DATE"];
  });

  const amountsOne = oneLineData.map((item) => {
    return item["NUM_VOTERS"];
  });

  const datesProps = propsData.map((item) => {
    return item["DATE"];
  });

  const amountsProps = propsData.map((item) => {
    return item["PROP_TIME"];
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
        color: "#8b949e",
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

  const chartData4 = {
    labels: datesThirty,
    datasets: [
      {
        label: "Distinct Voters",
        data: amountsThirty,
        backgroundColor: "rgba(197, 236, 255, 0.1)",
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

  const chartData5 = {
    labels: datesNinety,
    datasets: [
      {
        label: "Distinct Voters",
        data: amountsNinety,
        backgroundColor: "rgba(197, 236, 255, 0.1)",
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

  const chartData6 = {
    labels: datesOne,
    datasets: [
      {
        label: "Distinct Voters",
        data: amountsOne,
        backgroundColor: "rgba(197, 236, 255, 0.1)",
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
          color: "#8b949e",
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
          color: "#8b949e",
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
        color: "#8b949e",
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

  const propChartData2 = {
    labels: datesProps,
    datasets: [
      {
        label: "Total Proposals",
        data: amountsProps,
        backgroundColor: "rgba(197, 236, 255, 0.1)",
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
              <h1 className="leader-title">Trends: Voting Activity</h1>
            </div>
            <div className="date-toggle">
              <p className="select-date">Select Date Range</p>
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
              <Line
                options={chartOptions}
                data={props.dark ? chartData4 : chartData1}
              />
              <Line
                options={propChartOptions}
                data={props.dark ? propChartData2 : propChartData}
                className="props-line"
              />
            </div>
          )}
          {ninetyState && (
            <div className="chart-area">
              <Line
                options={chartOptions}
                data={props.dark ? chartData5 : chartData2}
              />
              <Line
                options={propChartOptions}
                data={props.dark ? propChartData2 : propChartData}
                className="props-line"
              />
            </div>
          )}
          {oneState && (
            <div className="chart-area">
              <Line
                options={chartOptions}
                data={props.dark ? chartData6 : chartData3}
              />
              <Line
                options={propChartOptions}
                data={props.dark ? propChartData2 : propChartData}
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
