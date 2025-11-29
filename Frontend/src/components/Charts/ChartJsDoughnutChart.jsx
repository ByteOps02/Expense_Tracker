import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartJsDoughnutChart = ({ data, colors }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  }

  // Expecting data to be an array of objects with { name: string, amount: number }
  // or mapping from the existing format if passed directly.

  const defaultColors = [
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#6366f1", // Indigo
  ];

  const chartData = {
    labels: data.map((item) => item.name || item.category || item.source),
    datasets: [
      {
        data: data.map((item) => item.amount || item.value),
        backgroundColor: colors || defaultColors,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%", // Thinner ring
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
          },
          color: "#4b5563",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default ChartJsDoughnutChart;
