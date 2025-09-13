// progressGraph.test.js
// Simple test to verify progressGraph rendering logic

import { renderProgressChart } from '/src/modules/progressGraph.js';

function mockContext() {
  // Mock minimal Chart.js context
  return {
    clearRect: () => {},
  };
}

const mockSessionData = [
  { date: '2023-01-01', wpm: 30, accuracy: 90 },
  { date: '2023-01-02', wpm: 35, accuracy: 92 }
];

function testRenderProgressChart() {
  try {
    renderProgressChart(mockContext(), mockSessionData);
    console.log('progressGraph test ran without error');
  } catch (err) {
    console.error('progressGraph test failed', err);
  }
}

testRenderProgressChart();
