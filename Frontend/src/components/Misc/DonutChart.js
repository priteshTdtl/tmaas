import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

const DonutChart = ({ data }) => {
  // State to hold the chart instance
  const [chartInstance, setChartInstance] = useState(null);

  // Combine the existing logic for counting job statuses with the new logic for counting letter types
  const counts = data.reduce((acc, item) => {
    const key = item.job_status || item.fields.LetterType; // Use job_status for existing data, otherwise use LetterType for new data
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Formatting data for the chart
  const chartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Create or update the chart instance
  useEffect(() => {
    if (chartInstance) {
      // Destroy the previous chart instance
      chartInstance.destroy();
    }

    const newChartInstance = new Chart(document.getElementById("donut-chart"), {
      type: "doughnut",
      data: chartData,
    });
    setChartInstance(newChartInstance);

    // Cleanup function
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [data]);

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <canvas id="donut-chart"></canvas>
    </div>
  );
};

export default DonutChart;
