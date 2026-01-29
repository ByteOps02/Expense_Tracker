import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartJsBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item?.name || item?.month || item?.source || item?.category),
    datasets: [
      {
        label: "Amount",
        data: data.map((item) => item.amount),
        backgroundColor: "#8b5cf6",
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 40,
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#f3f4f6",
          borderDash: [5, 5],
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          callback: function (value) {
            return "₹" + value;
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ChartJsBarChart;
