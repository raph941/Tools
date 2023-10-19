import React, { useEffect, FunctionComponent, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-plugin-datalabels";

import { CSVParsedDataType } from "./hooks/useHandleCsv";

interface BarChartProps {
  chartData: CSVParsedDataType;
}

const BarChart: FunctionComponent<BarChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  useEffect(() => {
    if (chartRef.current) {
      // If the chart already exists, destroy it before creating a new one
      const existingChart = Chart.getChart(chartRef.current);
      if (existingChart) {
        existingChart.destroy();
      }
    }

    // Process data to calculate stacked bar chart
    const dataValues = {
      "0-5": [] as number[],
      "5-7": [] as number[],
      "7-10": [] as number[],
    };

    // Iterate through the chartData to calculate the number of developers for each category
    for (const technology in chartData) {
      if (chartData.hasOwnProperty(technology)) {
        const techData = chartData[technology];
        const categoryCounts = {
          "0-5": 0,
          "5-7": 0,
          "7-10": 0,
        } as Record<string, number>;

        for (const developer of techData) {
          const displayValue = Number(developer.displayValue);
          if (displayValue >= 0 && displayValue <= 5) {
            categoryCounts["0-5"]++;
          } else if (displayValue > 5 && displayValue <= 7) {
            categoryCounts["5-7"]++;
          } else if (displayValue > 7 && displayValue <= 10) {
            categoryCounts["7-10"]++;
          }
        }

        dataValues["0-5"].push(categoryCounts["0-5"]);
        dataValues["5-7"].push(categoryCounts["5-7"]);
        dataValues["7-10"].push(categoryCounts["7-10"]);
      }
    }

    // Create a new stacked bar chart
    const ctx = chartRef.current as HTMLCanvasElement;
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "0-5",
            data: dataValues["0-5"],
            backgroundColor: '#ff3784',
            datalabels: {
              align: "center",
              anchor: "center",
            },
            barPercentage: 1,
          },
          {
            label: "5-7",
            data: dataValues["5-7"],
            backgroundColor: '#37a2eb',
            datalabels: {
              align: "center",
              anchor: "center",
            },
            barPercentage: 1,
          },
          {
            label: "7-10",
            data: dataValues["7-10"],
            backgroundColor: '#4cc0c0',
            datalabels: {
              anchor: "center",
              align: "center",
            },
            barPercentage: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },

        },
        plugins: {
          datalabels: {
            color: "white",
            display: function(context: any) {
              const data = Number(context.dataset.data[context.dataIndex]);
              return typeof data === 'number' && data > 0;
            },
            font: {
              weight: 'bold'
            },
            formatter: Math.round
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }, [chartData]);

  return (
    <div style={{ overflowX: "auto" }}>
      <div className="container w-[100%] max-w-[100%] overflow-x-auto">
        <div className="containerBody min-h-[500px]">
          <canvas ref={chartRef} width="500" height="2000"></canvas>
        </div>
      </div>
    </div>
  );
};

export { BarChart };
