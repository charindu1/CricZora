import { motion } from 'framer-motion'
import './Model.css'
import { Bar, Line } from 'react-chartjs-2';
import "chart.js/auto";
import { Animation } from 'chart.js/auto';
import { useEffect, useState } from 'react';

export default function Model({ enableDelay }) {

  // show in browser tab which page is this
  usePageTitle("CricZora - Model");

  // Responsive chart font size handling
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650);
  // Update isMobile state on window resize
  useEffect(() => {
  const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Model comparison data
  const OdimodelComparison = [
    { name: "Gradient Boosting", acc: "90.72%", f1: "0.906594", best: true },
    { name: "Random Forest", acc: "84.72%", f1: "0.840936" },
    { name: "Logistic Regression", acc: "23.92%", f1: "0.178179" },
    { name: "SVM", acc: "22.87%", f1: "0.138713" },
  ];

  const T20modelComparison = [
    { name: "Gradient Boosting", acc: "70.31%", f1: "0.700879", best: true },
    { name: "Random Forest", acc: "59.13%", f1: "0.574465" },
    { name: "SVM", acc: "12.34%", f1: "0.066911" },
    { name: "Logistic Regression", acc: "22.87%", f1: "0.056994" },
  ];

  const TestmodelComparison = [
    { name: "Gradient Boosting", acc: "48.82%", f1: "0.483824", best: true },
    { name: "Random Forest", acc: "44.88%", f1: "0.448554" },
    { name: "SVM", acc: "38.90%", f1: "0.271119" },
    { name: "Logistic Regression", acc: "36.22%", f1: "0.250627" },
  ];



  // State to hold chart data values for animation
    const [t20Feature, setT20Feature] = useState([0, 0, 0, 0]);
    // Add this useEffect to update the data after a slight delay
    useEffect(() => {
        // Wait 300ms for the page fade-in to settle, then set real values
        const timer = setTimeout(() => {
            setT20Feature([0.424312, 0.417720, 0.406094, 0.228668]);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

  // Feature importance data
  const odiFeatureData = {
    labels: ["Team2 Name", "Toss Winner", "Team1 Name", "Match Venue (Country)"],
    datasets: [
      {
        label: "Feature Importance",
        data: [0.406287, 0.390399, 0.383854, 0.291248],
        backgroundColor: "#ffb703",
        borderRadius: 5,
      },
    ],
  };

  const t20FeatureData = {
    labels: ["Team1 Name", "Team2 Name", "Toss Winner", "Match Venue (Country)"],
    datasets: [
      {
        label: "Feature Importance",
        data: t20Feature,
        backgroundColor: "#ffb703",
        borderRadius: 5,
      },
    ],
  };

  const testFeatureData = {
    labels: ["Toss Winner", "Match Venue (Country)", "Team1 Name", "Team2 Name"],
    datasets: [
      {
        label: "Feature Importance",
        data: [0.291814, 0.287847, 0.270509, 0.239351],
        backgroundColor: "#ffb703",
        borderRadius: 5,
      },
    ],
  };

  // Common bar chart options
  const barOptions = {
    indexAxis: "y",
    plugins: { 
      tooltip: { 
        titleFont: {
          size: isMobile ? 9 : 14
        },
        bodyFont: {
          size: isMobile ? 8 : 12
        }
      },
      legend: { 
        labels: { 
          color: "#ffffff",
          font: {
            size: isMobile ? 10 : 12
          }
        } 
      } 
    },
    scales: {
      x: { 
        ticks: { 
          color: "#ffffff",
          font: {
            size: isMobile ? 9 : 12
          }
        }, 
        grid: { 
          color: "rgba(255,255,255,0.1)" 
        } 
      },
      y: { 
        ticks: { 
          color: "#ffffff",
          font: {
            size: isMobile ? 9 : 12
          }
        }, 
        grid: { 
          color: "rgba(255,255,255,0.1)" 
        } 
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  



  // Common line chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false, // Vital for the CSS height to work
    layout: {
      padding: {
        left: 10,
        right: 20, 
        top: 20,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: isMobile ? 10 : 12
          },
          boxWidth: 12,
          padding: isMobile ? 7 : 20
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        titleFont: {
          size: isMobile ? 9 : 14
        },
        bodyFont: {
          size: isMobile ? 8 : 12
        }
      },
    },
    scales: {
      x: {
        ticks: { 
          color: "#d1d5db",
          font: {
            size: isMobile ? 9 : 12
          }
        }, 
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: "#d1d5db",
          font: {
            size: isMobile ? 9 : 12
          },
          callback: (v) => v + "%",
          padding: 5
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
          borderDash: [5, 5]
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        radius: isMobile ? 3 : 4,
        hoverRadius: isMobile ? 5 : 6
      },
      line: {
        borderWidth: isMobile ? 2 : 3
      }
    }
  };

  // Function to format data for line charts
  const formatData = (labels, training, testing) => ({
    labels,
    datasets: [
      {
        label: "Training",
        data: training,
        fill: false,
        borderColor: "#ff5900",
        tension: 0.4,
      },
      {
        label: "Testing",
        data: testing,
        fill: false,
        borderColor: "#ffb703",
        tension: 0.4,
      },
    ],
  });


  // Function to format data for line charts
  const odiTrainTestData = formatData(
    ["Epoch 1", "Epoch 5", "Epoch 10", "Epoch 20", "Epoch 50", "Epoch 90"],
    [74.9, 87.4, 90.8, 93.1, 96.6, 99.0],
    [74.0, 84.2, 86.7, 88.8, 89.5, 90.6]
  );

  const t20TrainTestData = formatData(
    ["Epoch 1", "Epoch 5", "Epoch 10", "Epoch 20", "Epoch 50", "Epoch 90"],
    [62.3, 82.3, 89.1, 95.6, 98.3, 98.8],
    [49.7, 60.0, 64.0, 67.1, 68.6, 70.2]
  );

  const testTrainTestData = formatData(
    ["Epoch 1", "Epoch 5", "Epoch 10", "Epoch 20", "Epoch 50", "Epoch 90"],
    [31.9, 43.0, 49.1, 51.8, 56.0, 57.0],
    [31.0, 40.2, 44.7, 46.1, 47.4, 48.5]
  );



  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: "easeInOut", delay: enableDelay ? 0.4 : 0 }}
    >
      <div className="model container">
        <h1 className='main-title'>Model Performance Analysis</h1>

        <div className="top-section">
          {/* Model comparison tables */}
          <div className="comparison-table">
            <h2>Model Comparison</h2>

            {/* For t20 */}
            <h3>T20 International</h3>
            <table>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>F1 Score</th>
              </tr>
                {T20modelComparison.map((model, index) => (
                  <tr
                    key={index}
                    className={model.best ? "best-model-row" : ""}
                  >
                    <td>
                      {model.name}
                      {model.best}
                    </td>
                    <td>{model.acc.toString()}</td>
                    <td>{model.f1.toString()}</td>
                  </tr>
                ))}
            </table>

            {/* For odi */}
              <h3>ODI International</h3>
              <table>
                <tr>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>F1 Score</th>
                </tr>
                  {OdimodelComparison.map((model, index) => (
                    <tr
                      key={index}
                      className={model.best ? "best-model-row" : ""}
                    >
                      <td>
                        {model.name}
                        {model.best}
                      </td>
                      <td>{model.acc.toString()}</td>
                      <td>{model.f1.toString()}</td>
                    </tr>
                  ))}
              </table>

            {/* For test */}
            <h3>Test International</h3>
            <table>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>F1 Score</th>
              </tr>
                {TestmodelComparison.map((model, index) => (
                  <tr
                    key={index}
                    className={model.best ? "best-model-row" : ""}
                  >
                    <td>
                      {model.name}
                      {model.best}
                    </td>
                    <td>{model.acc.toString()}</td>
                    <td>{model.f1.toString()}</td>
                  </tr>
                ))}
            </table>
          </div>

          {/* feature importance */}
          <div className="feature-importance">
            <h2>Feature Importance</h2>
            <div className="card">
              <h3>T20 International</h3>
              <Bar data={t20FeatureData} options={barOptions} />
            </div>
            <div className="card">
              <h3>ODI International</h3>
              <Bar data={odiFeatureData} options={barOptions} />
            </div>
            <div className="card">
              <h3>Test International</h3>
              <Bar data={testFeatureData} options={barOptions} />
            </div>
          </div>
        </div>
        <div className="bottom-section">
          <h2>Test vs Train Dynamics</h2>
          <div className="test-train-chart">
            
            {/* T20 Chart */}
            <div className="line-chart-wrapper">
              <h3>T20 International</h3>
              <div className="line-chart-container">
                <Line data={t20TrainTestData} options={lineOptions} />
              </div>
            </div>

            {/* ODI Chart */}
            <div className="line-chart-wrapper">
              <h3>ODI International</h3>
              <div className="line-chart-container">
                <Line data={odiTrainTestData} options={lineOptions} />
              </div>
            </div>

            {/* Test Chart */}
            <div className="line-chart-wrapper">
              <h3>Test International</h3>
              <div className="line-chart-container">
                <Line data={testTrainTestData} options={lineOptions} />
              </div>
            </div>
          </div>    
        </div>
      </div>

      

    </motion.div>
  )
}