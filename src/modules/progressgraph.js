// progressGraph.js
// Chart rendering and progress visualization logic (uses Chart.js)

export function renderProgressChart(ctx, sessionData) {
    // Sample: Renders WPM and Accuracy line charts
    const labels = sessionData.map(s => s.date);
    const wpmData = sessionData.map(s => s.wpm);
    const accuracyData = sessionData.map(s => s.accuracy);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'WPM',
                    data: wpmData,
                    borderColor: 'rgba(33,128,141,1)',
                    fill: false
                },
                {
                    label: 'Accuracy (%)',
                    data: accuracyData,
                    borderColor: 'rgba(192,21,47,1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}
