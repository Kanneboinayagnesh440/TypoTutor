// ProgressChart.js
// Wrapper to render progress chart, depends on Chart.js

export function renderProgressChart(ctx, sessionData) {
  if (window.progressChartInstance) {
    window.progressChartInstance.destroy();
  }

  const labels = sessionData.map(s => s.date);
  const wpmData = sessionData.map(s => s.wpm);
  const accuracyData = sessionData.map(s => s.accuracy);

  window.progressChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Words Per Minute',
          data: wpmData,
          borderColor: 'rgba(33,128,141,1)',
          fill: false,
        },
        {
          label: 'Accuracy (%)',
          data: accuracyData,
          borderColor: 'rgba(192,21,47,1)',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}
