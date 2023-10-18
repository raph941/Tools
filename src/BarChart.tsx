import React, { useEffect, FunctionComponent, useRef } from "react";
import Chart from "chart.js/auto";

import { StackData } from "./hooks/useHandleCsv";

interface BarChartProps {
  chartData: StackData[];
}

const BarChart: FunctionComponent<BarChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // If the chart already exists, destroy it before creating a new one
      const existingChart = Chart.getChart(chartRef.current);
      if (existingChart) {
        existingChart.destroy();
      }
    }

    // Process data to calculate frequency for each category
    const categories = ["8-10", "5-7", "0-5"];
    const dataValues = categories.map((category) => {
      const categoryData = chartData.filter(
        (data) => Number(data.displayValue) >= Number(category.split("-")[0]) &&
          Number(data.displayValue) <= Number(category.split("-")[1])
      );
      return categoryData.length;
    });

    // Create a new chart
    const ctx = chartRef.current as HTMLCanvasElement;
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Number of People",
            data: dataValues,
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [chartData]);

  return (
    <div>
      <canvas ref={chartRef} width="100%" height="30"></canvas>
    </div>
  );
};

export { BarChart };
