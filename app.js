// TypoTutor Application JavaScript

// Application data from JSON
const appData = {
  commonWords: ["the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "each", "which", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "into", "him", "time", "has", "two", "more", "go", "no", "way", "could", "my", "than", "first", "been", "call", "who", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"],
  
  practiceTexts: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for typing practice.",
    "Learning to type quickly and accurately is an essential skill in today's digital world. Practice makes perfect when it comes to developing muscle memory.",
    "Machine learning algorithms can analyze typing patterns to identify common mistakes and predict where errors are likely to occur in the future.",
    "Touch typing involves using all ten fingers without looking at the keyboard. This method significantly improves both speed and accuracy over time.",
    "Regular practice sessions of just 15-30 minutes per day can dramatically improve your typing skills within a few weeks of consistent effort."
  ],
  
  commonMistakes: [
    {"correct": "the", "mistake": "teh", "type": "transposition", "frequency": 85},
    {"correct": "and", "mistake": "adn", "type": "transposition", "frequency": 72},
    {"correct": "you", "mistake": "yuo", "type": "transposition", "frequency": 68},
    {"correct": "with", "mistake": "wiht", "type": "transposition", "frequency": 64},
    {"correct": "that", "mistake": "taht", "type": "transposition", "frequency": 61},
    {"correct": "have", "mistake": "ahve", "type": "transposition", "frequency": 58},
    {"correct": "this", "mistake": "thsi", "type": "transposition", "frequency": 55},
    {"correct": "from", "mistake": "form", "type": "substitution", "frequency": 52},
    {"correct": "they", "mistake": "tehy", "type": "transposition", "frequency": 49},
    {"correct": "were", "mistake": "where", "type": "substitution", "frequency": 46}
  ],
  
  keyboardLayout: {
    qwerty: [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"]
    ]
  },
  
  difficultyLevels: [
    {"level": 1, "name": "Beginner", "wpmThreshold": 20, "accuracyThreshold": 85},
    {"level": 2, "name": "Intermediate", "wpmThreshold": 40, "accuracyThreshold": 90},
    {"level": 3, "name": "Advanced", "wpmThreshold": 60, "accuracyThreshold": 95},
    {"level": 4, "name": "Expert", "wpmThreshold": 80, "accuracyThreshold": 98}
  ],
  
  exerciseTypes: [
    {"type": "words", "description": "Practice common words", "focus": "accuracy"},
    {"type": "sentences", "description": "Type complete sentences", "focus": "flow"},
    {"type": "paragraphs", "description": "Extended typing practice", "focus": "endurance"},
    {"type": "numbers", "description": "Number and symbol practice", "focus": "special_keys"},
    {"type": "custom", "description": "Personalized based on your mistakes", "focus": "weaknesses"}
  ]
};

// Application state
let currentView = 'dashboard';
let practiceSession = {
  active: false,
  startTime: null,
  currentText: '',
  userInput: '',
  errors: [],
  keystrokes: 0,
  correctKeystrokes: 0,
  wpm: 0,
  accuracy: 100,
  currentPosition: 0
};

// User data simulation (in real app, this would come from backend)
let userData = {
  totalPracticeTime: 47, // hours
  currentWPM: 52,
  currentAccuracy: 94,
  streakDays: 12,
  recentSessions: [
    { date: '2025-09-13', wpm: 52, accuracy: 94, duration: 15 },
    { date: '2025-09-12', wpm: 49, accuracy: 92, duration: 20 },
    { date: '2025-09-11', wpm: 51, accuracy: 95, duration: 18 },
    { date: '2025-09-10', wpm: 47, accuracy: 91, duration: 22 }
  ],
  errorPatterns: {},
  keyPerformance: {}
};

// Chart instances
let charts = {};

// Global functions that need to be available immediately
window.startQuickPractice = function() {
  switchView('practice');
  setTimeout(() => {
    generatePracticeText();
    startPractice();
  }, 100);
};

window.showRecommendations = function() {
  switchView('lessons');
};

window.closeCustomTextModal = function() {
  document.getElementById('custom-text-modal').classList.add('hidden');
};

window.useCustomText = function() {
  const customText = document.getElementById('custom-text-input').value.trim();
  if (customText) {
    practiceSession.currentText = customText;
    document.getElementById('text-display').textContent = customText;
    closeCustomTextModal();
  }
};

window.closeResultsModal = function() {
  document.getElementById('results-modal').classList.add('hidden');
};

window.startNewPractice = function() {
  closeResultsModal();
  resetPractice();
  generatePracticeText();
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing TypoTutor application...');
  initializeApp();
  setupEventListeners();
  updateDashboard();
  generateKeyboardHeatmap();
});

// Initialize the application
function initializeApp() {
  console.log('Setting up navigation...');
  
  // Set up navigation
  const navButtons = document.querySelectorAll('.nav-btn');
  console.log('Found navigation buttons:', navButtons.length);
  
  navButtons.forEach((btn, index) => {
    const view = btn.dataset.view;
    console.log(`Setting up nav button ${index}: ${view}`);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log(`Navigation button clicked: ${view}`);
      switchView(view);
    });
  });

  // Initialize charts after a short delay
  setTimeout(() => {
    initializeCharts();
  }, 100);
}

// Set up event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Practice controls
  const startBtn = document.getElementById('start-practice-btn');
  const resetBtn = document.getElementById('reset-practice-btn');
  const customBtn = document.getElementById('custom-text-btn');
  
  if (startBtn) {
    startBtn.addEventListener('click', startPractice);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetPractice);
  }
  
  if (customBtn) {
    customBtn.addEventListener('click', openCustomTextModal);
  }
  
  // Exercise type change
  const exerciseSelect = document.getElementById('exercise-type');
  if (exerciseSelect) {
    exerciseSelect.addEventListener('change', generatePracticeText);
  }
  
  // Typing input
  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('keydown', handleKeyDown);
  }
  
  // Lesson cards
  document.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      if (type) {
        startLessonPractice(type);
      }
    });
  });
}

// Navigation functions
function switchView(viewName) {
  console.log(`Switching to view: ${viewName}`);
  
  // Update navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Update views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  currentView = viewName;
  
  // Load view-specific content
  switch(viewName) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'practice':
      generatePracticeText();
      break;
    case 'statistics':
      updateStatistics();
      break;
    case 'lessons':
      updateLessons();
      break;
  }
}

// Dashboard functions
function updateDashboard() {
  console.log('Updating dashboard...');
  
  document.getElementById('current-wpm').textContent = userData.currentWPM;
  document.getElementById('current-accuracy').textContent = userData.currentAccuracy + '%';
  document.getElementById('total-practice-time').textContent = userData.totalPracticeTime + 'h';
  document.getElementById('streak-days').textContent = userData.streakDays;
  
  updateRecentActivity();
  updateProgressChart();
}

function updateRecentActivity() {
  const activityList = document.getElementById('recent-activity');
  if (!activityList) return;
  
  activityList.innerHTML = '';
  
  userData.recentSessions.forEach(session => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div>
        <strong>${new Date(session.date).toLocaleDateString()}</strong>
        <div style="font-size: 12px; color: var(--color-text-secondary);">
          ${session.duration} minutes
        </div>
      </div>
      <div style="text-align: right;">
        <div><strong>${session.wpm} WPM</strong></div>
        <div style="font-size: 12px; color: var(--color-text-secondary);">
          ${session.accuracy}% accuracy
        </div>
      </div>
    `;
    activityList.appendChild(activityItem);
  });
}

function updateProgressChart() {
  if (charts.progress) {
    charts.progress.destroy();
  }
  
  const ctx = document.getElementById('progress-chart');
  if (ctx) {
    charts.progress = new Chart(ctx, {
      type: 'line',
      data: {
        labels: userData.recentSessions.map(s => new Date(s.date).toLocaleDateString()).reverse(),
        datasets: [{
          label: 'WPM',
          data: userData.recentSessions.map(s => s.wpm).reverse(),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(94, 82, 64, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(94, 82, 64, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

// Practice functions
function generatePracticeText() {
  console.log('Generating practice text...');
  
  const exerciseType = document.getElementById('exercise-type')?.value || 'words';
  const difficulty = document.getElementById('difficulty-level')?.value || '1';
  
  let text = '';
  
  switch(exerciseType) {
    case 'words':
      const wordCount = parseInt(difficulty) * 10 + 10;
      const selectedWords = [];
      for(let i = 0; i < wordCount; i++) {
        selectedWords.push(appData.commonWords[Math.floor(Math.random() * appData.commonWords.length)]);
      }
      text = selectedWords.join(' ');
      break;
      
    case 'sentences':
    case 'paragraphs':
      text = appData.practiceTexts[Math.floor(Math.random() * appData.practiceTexts.length)];
      if (exerciseType === 'paragraphs') {
        text += ' ' + appData.practiceTexts[Math.floor(Math.random() * appData.practiceTexts.length)];
      }
      break;
      
    case 'numbers':
      text = generateNumberText();
      break;
      
    case 'custom':
      text = generateCustomizedText();
      break;
      
    default:
      text = appData.practiceTexts[0];
  }
  
  practiceSession.currentText = text;
  const textDisplay = document.getElementById('text-display');
  if (textDisplay) {
    textDisplay.textContent = text;
  }
  
  // Generate ML predictions
  generateMLPredictions();
}

function generateNumberText() {
  const numbers = [];
  for(let i = 0; i < 50; i++) {
    numbers.push(Math.floor(Math.random() * 1000));
  }
  return numbers.join(' ');
}

function generateCustomizedText() {
  // Generate text based on user's common mistakes
  const problematicWords = appData.commonMistakes.slice(0, 10).map(m => m.correct);
  return problematicWords.join(' ').repeat(3);
}

function startPractice() {
  console.log('Starting practice session...');
  
  if (!practiceSession.currentText) {
    generatePracticeText();
  }
  
  practiceSession.active = true;
  practiceSession.startTime = Date.now();
  practiceSession.userInput = '';
  practiceSession.errors = [];
  practiceSession.keystrokes = 0;
  practiceSession.correctKeystrokes = 0;
  practiceSession.currentPosition = 0;
  
  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
  }
  
  const startBtn = document.getElementById('start-practice-btn');
  if (startBtn) {
    startBtn.textContent = 'Practicing...';
    startBtn.disabled = true;
  }
  
  // Start the timer
  practiceSession.timer = setInterval(updatePracticeStats, 100);
  
  updateTextDisplay();
}

function resetPractice() {
  console.log('Resetting practice session...');
  
  practiceSession.active = false;
  practiceSession.startTime = null;
  
  if (practiceSession.timer) {
    clearInterval(practiceSession.timer);
  }
  
  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.disabled = true;
    typingInput.value = '';
  }
  
  const startBtn = document.getElementById('start-practice-btn');
  if (startBtn) {
    startBtn.textContent = 'Start Practice';
    startBtn.disabled = false;
  }
  
  // Reset display
  const textDisplay = document.getElementById('text-display');
  if (textDisplay) {
    textDisplay.innerHTML = practiceSession.currentText || 'Click "Start Practice" to begin typing';
  }
  
  document.getElementById('live-wpm').textContent = '0';
  document.getElementById('live-accuracy').textContent = '100%';
  document.getElementById('practice-timer').textContent = '0:00';
  document.getElementById('error-count').textContent = '0';
  document.getElementById('progress-fill').style.width = '0%';
}

function handleTyping(event) {
  if (!practiceSession.active) return;
  
  const input = event.target.value;
  practiceSession.userInput = input;
  practiceSession.keystrokes = input.length;
  
  updateTextDisplay();
  updatePracticeStats();
  checkForErrors();
  
  // Check if practice is complete
  if (input.length >= practiceSession.currentText.length) {
    completePractice();
  }
}

function handleKeyDown(event) {
  if (!practiceSession.active) return;
  
  // Handle backspace and other special keys
  if (event.key === 'Backspace' && practiceSession.userInput.length > 0) {
    // Allow backspace but track it as a correction attempt
    practiceSession.keystrokes++;
  }
}

function updateTextDisplay() {
  const textDisplay = document.getElementById('text-display');
  if (!textDisplay) return;
  
  const currentText = practiceSession.currentText;
  const userInput = practiceSession.userInput;
  
  let html = '';
  
  for (let i = 0; i < currentText.length; i++) {
    const char = currentText[i];
    
    if (i < userInput.length) {
      if (userInput[i] === char) {
        html += `<span class="correct">${char}</span>`;
      } else {
        html += `<span class="incorrect">${char}</span>`;
      }
    } else if (i === userInput.length) {
      html += `<span class="current">${char}</span>`;
    } else {
      html += char;
    }
  }
  
  textDisplay.innerHTML = html;
  
  // Update progress bar
  const progress = (userInput.length / currentText.length) * 100;
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }
}

function updatePracticeStats() {
  if (!practiceSession.active || !practiceSession.startTime) return;
  
  const timeElapsed = (Date.now() - practiceSession.startTime) / 1000; // seconds
  const minutes = timeElapsed / 60;
  
  // Calculate WPM (assuming 5 characters per word)
  const wordsTyped = practiceSession.correctKeystrokes / 5;
  const wpm = Math.round(wordsTyped / minutes) || 0;
  
  // Calculate accuracy
  const accuracy = practiceSession.keystrokes > 0 ? 
    Math.round((practiceSession.correctKeystrokes / practiceSession.keystrokes) * 100) : 100;
  
  // Update display
  document.getElementById('live-wpm').textContent = wpm;
  document.getElementById('live-accuracy').textContent = accuracy + '%';
  document.getElementById('practice-timer').textContent = formatTime(timeElapsed);
  document.getElementById('error-count').textContent = practiceSession.errors.length;
  
  practiceSession.wpm = wpm;
  practiceSession.accuracy = accuracy;
}

function checkForErrors() {
  const userInput = practiceSession.userInput;
  const currentText = practiceSession.currentText;
  
  practiceSession.correctKeystrokes = 0;
  
  for (let i = 0; i < userInput.length && i < currentText.length; i++) {
    if (userInput[i] === currentText[i]) {
      practiceSession.correctKeystrokes++;
    } else {
      // Track error if not already recorded for this position
      const existingError = practiceSession.errors.find(err => err.position === i);
      if (!existingError) {
        const error = {
          position: i,
          expected: currentText[i],
          actual: userInput[i],
          timestamp: Date.now(),
          type: categorizeError(currentText[i], userInput[i])
        };
        practiceSession.errors.push(error);
        
        // Show error alert
        showErrorAlert(error);
      }
    }
  }
}

function categorizeError(expected, actual) {
  // Simple error categorization
  if (!actual) return 'omission';
  if (!expected) return 'insertion';
  if (expected !== actual) return 'substitution';
  return 'other';
}

function showErrorAlert(error) {
  const alertsContainer = document.getElementById('error-alerts');
  if (!alertsContainer) return;
  
  const alert = document.createElement('div');
  alert.className = 'error-alert';
  alert.textContent = `Common mistake detected: "${error.actual}" instead of "${error.expected}"`;
  
  alertsContainer.appendChild(alert);
  
  // Remove alert after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
}

function completePractice() {
  practiceSession.active = false;
  clearInterval(practiceSession.timer);
  
  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.disabled = true;
  }
  
  // Update user data
  const sessionData = {
    date: new Date().toISOString().split('T')[0],
    wpm: practiceSession.wpm,
    accuracy: practiceSession.accuracy,
    duration: Math.round((Date.now() - practiceSession.startTime) / 60000), // minutes
    errors: practiceSession.errors.length
  };
  
  // Add to recent sessions
  userData.recentSessions.unshift(sessionData);
  userData.recentSessions = userData.recentSessions.slice(0, 10); // Keep last 10 sessions
  
  // Update overall stats
  userData.currentWPM = Math.round((userData.currentWPM + practiceSession.wpm) / 2);
  userData.currentAccuracy = Math.round((userData.currentAccuracy + practiceSession.accuracy) / 2);
  
  // Show results
  showPracticeResults(sessionData);
  
  // Reset UI
  const startBtn = document.getElementById('start-practice-btn');
  if (startBtn) {
    startBtn.textContent = 'Start Practice';
    startBtn.disabled = false;
  }
}

function showPracticeResults(sessionData) {
  const modal = document.getElementById('results-modal');
  const summary = document.getElementById('results-summary');
  
  if (summary) {
    summary.innerHTML = `
      <h4>Great job! Here are your results:</h4>
      <div class="results-stats">
        <div class="result-stat">
          <span class="value">${sessionData.wpm}</span>
          <span class="label">Words Per Minute</span>
        </div>
        <div class="result-stat">
          <span class="value">${sessionData.accuracy}%</span>
          <span class="label">Accuracy</span>
        </div>
        <div class="result-stat">
          <span class="value">${sessionData.duration}</span>
          <span class="label">Minutes Practiced</span>
        </div>
        <div class="result-stat">
          <span class="value">${sessionData.errors}</span>
          <span class="label">Total Errors</span>
        </div>
      </div>
      <p>Keep practicing to improve your typing skills!</p>
    `;
  }
  
  if (modal) {
    modal.classList.remove('hidden');
  }
}

// ML Prediction System
function generateMLPredictions() {
  const predictionsContainer = document.getElementById('predictions-list');
  if (!predictionsContainer) return;
  
  predictionsContainer.innerHTML = '';
  
  // Simulate ML predictions based on common patterns
  const predictions = [
    {
      type: 'pattern',
      message: 'High probability of "teh" instead of "the" detected in upcoming text',
      confidence: 87
    },
    {
      type: 'suggestion',
      message: 'Focus on the letter "h" - you tend to miss it in common words',
      confidence: 73
    },
    {
      type: 'timing',
      message: 'Slow down on double letters - you have 65% accuracy on repeated characters',
      confidence: 91
    }
  ];
  
  predictions.forEach(prediction => {
    const predictionDiv = document.createElement('div');
    predictionDiv.className = 'prediction-item';
    predictionDiv.innerHTML = `
      <strong>${prediction.type.toUpperCase()}:</strong> ${prediction.message}
      <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
        Confidence: ${prediction.confidence}%
      </div>
    `;
    predictionsContainer.appendChild(predictionDiv);
  });
}

// Statistics functions
function updateStatistics() {
  console.log('Updating statistics...');
  initializeStatisticsCharts();
}

function initializeStatisticsCharts() {
  // WPM Chart
  if (charts.wpm) charts.wmp.destroy();
  const wmpCtx = document.getElementById('wpm-chart');
  if (wpmCtx) {
    charts.wpm = new Chart(wpmCtx, {
      type: 'line',
      data: {
        labels: userData.recentSessions.map(s => new Date(s.date).toLocaleDateString()).reverse(),
        datasets: [{
          label: 'WPM',
          data: userData.recentSessions.map(s => s.wpm).reverse(),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Accuracy Chart
  if (charts.accuracy) charts.accuracy.destroy();
  const accuracyCtx = document.getElementById('accuracy-chart');
  if (accuracyCtx) {
    charts.accuracy = new Chart(accuracyCtx, {
      type: 'line',
      data: {
        labels: userData.recentSessions.map(s => new Date(s.date).toLocaleDateString()).reverse(),
        datasets: [{
          label: 'Accuracy (%)',
          data: userData.recentSessions.map(s => s.accuracy).reverse(),
          borderColor: '#FFC185',
          backgroundColor: 'rgba(255, 193, 133, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 80,
            max: 100
          }
        }
      }
    });
  }
  
  // Errors Chart
  if (charts.errors) charts.errors.destroy();
  const errorsCtx = document.getElementById('errors-chart');
  if (errorsCtx) {
    charts.errors = new Chart(errorsCtx, {
      type: 'bar',
      data: {
        labels: appData.commonMistakes.slice(0, 8).map(m => m.correct),
        datasets: [{
          label: 'Error Frequency',
          data: appData.commonMistakes.slice(0, 8).map(m => m.frequency),
          backgroundColor: '#B4413C',
          borderColor: '#964325',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Practice Time Chart
  if (charts.practiceTime) charts.practiceTime.destroy();
  const practiceTimeCtx = document.getElementById('practice-time-chart');
  if (practiceTimeCtx) {
    charts.practiceTime = new Chart(practiceTimeCtx, {
      type: 'bar',
      data: {
        labels: userData.recentSessions.map(s => new Date(s.date).toLocaleDateString()).reverse(),
        datasets: [{
          label: 'Practice Time (minutes)',
          data: userData.recentSessions.map(s => s.duration).reverse(),
          backgroundColor: '#5D878F',
          borderColor: '#13343B',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

function initializeCharts() {
  updateProgressChart();
}

// Keyboard heatmap
function generateKeyboardHeatmap() {
  const heatmapContainer = document.getElementById('keyboard-heatmap');
  if (!heatmapContainer) return;
  
  heatmapContainer.innerHTML = '';
  
  appData.keyboardLayout.qwerty.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    
    row.forEach(key => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'key';
      keyDiv.textContent = key.toUpperCase();
      
      // Simulate error frequency for visualization
      const errorRate = Math.random();
      if (errorRate > 0.7) {
        keyDiv.classList.add('error-high');
      } else if (errorRate > 0.4) {
        keyDiv.classList.add('error-medium');
      } else {
        keyDiv.classList.add('error-low');
      }
      
      rowDiv.appendChild(keyDiv);
    });
    
    heatmapContainer.appendChild(rowDiv);
  });
}

// Lessons functions
function updateLessons() {
  console.log('Updating lessons...');
  generateRecommendedLessons();
  generateFocusLessons();
}

function generateRecommendedLessons() {
  const container = document.getElementById('recommended-lessons');
  if (!container) return;
  
  container.innerHTML = '';
  
  const recommendations = [
    {
      title: 'Transposition Errors Focus',
      description: 'Practice common letter swaps like "the → teh"',
      difficulty: 'intermediate',
      reason: 'Based on your error patterns'
    },
    {
      title: 'Speed Building',
      description: 'Increase typing speed while maintaining accuracy',
      difficulty: 'advanced',
      reason: 'Your accuracy is strong, time to build speed'
    }
  ];
  
  recommendations.forEach(lesson => {
    const lessonCard = document.createElement('div');
    lessonCard.className = 'lesson-card';
    lessonCard.innerHTML = `
      <h4>${lesson.title}</h4>
      <p>${lesson.description}</p>
      <span class="difficulty-badge ${lesson.difficulty}">${lesson.difficulty}</span>
      <div style="margin-top: 12px; font-size: 12px; color: var(--color-text-secondary);">
        ${lesson.reason}
      </div>
    `;
    lessonCard.addEventListener('click', () => {
      startRecommendedLesson(lesson);
    });
    container.appendChild(lessonCard);
  });
}

function generateFocusLessons() {
  const container = document.getElementById('focus-lessons');
  if (!container) return;
  
  container.innerHTML = '';
  
  const focusAreas = [
    { area: 'Double Letters', example: 'coffee, apple, butter' },
    { area: 'Common Words', example: 'the, and, that, with' },
    { area: 'Punctuation', example: 'Sentences with periods, commas' }
  ];
  
  focusAreas.forEach(focus => {
    const focusCard = document.createElement('div');
    focusCard.className = 'lesson-card';
    focusCard.innerHTML = `
      <h4>${focus.area}</h4>
      <p>Examples: ${focus.example}</p>
      <span class="difficulty-badge intermediate">Focus</span>
    `;
    focusCard.addEventListener('click', () => {
      startFocusLesson(focus);
    });
    container.appendChild(focusCard);
  });
}

// Utility functions
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startLessonPractice(type) {
  switchView('practice');
  setTimeout(() => {
    const exerciseSelect = document.getElementById('exercise-type');
    if (exerciseSelect) {
      exerciseSelect.value = type;
    }
    generatePracticeText();
  }, 100);
}

function startRecommendedLesson(lesson) {
  switchView('practice');
  setTimeout(() => {
    // Generate specialized text for recommended lesson
    practiceSession.currentText = generateRecommendedLessonText(lesson);
    const textDisplay = document.getElementById('text-display');
    if (textDisplay) {
      textDisplay.textContent = practiceSession.currentText;
    }
  }, 100);
}

function startFocusLesson(focus) {
  switchView('practice');
  setTimeout(() => {
    practiceSession.currentText = generateFocusLessonText(focus);
    const textDisplay = document.getElementById('text-display');
    if (textDisplay) {
      textDisplay.textContent = practiceSession.currentText;
    }
  }, 100);
}

function generateRecommendedLessonText(lesson) {
  if (lesson.title.includes('Transposition')) {
    return appData.commonMistakes.filter(m => m.type === 'transposition')
      .map(m => m.correct).slice(0, 20).join(' ').repeat(2);
  }
  return appData.practiceTexts[0];
}

function generateFocusLessonText(focus) {
  switch(focus.area) {
    case 'Double Letters':
      return 'coffee apple butter letter common process address success different office happy';
    case 'Common Words':
      return appData.commonWords.slice(0, 30).join(' ');
    case 'Punctuation':
      return 'Hello, world! How are you today? I hope you are well. Practice makes perfect, doesn\'t it?';
    default:
      return appData.practiceTexts[0];
  }
}

// Modal functions
function openCustomTextModal() {
  const modal = document.getElementById('custom-text-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}
function handleTyping(event) {
  if (!practiceSession.active) return;

  const input = event.target.value;
  practiceSession.userInput = input;

  // Prevent user typing beyond the current text length
  if (input.length > practiceSession.currentText.length) {
    event.target.value = input.slice(0, practiceSession.currentText.length);
    practiceSession.userInput = event.target.value;
  }

  updateTextDisplay();
  updatePracticeStats();
  checkForErrors();

  // Check if user completed the current text exactly
  if (practiceSession.userInput === practiceSession.currentText) {
    // User finished typing the current exercise
    complete();
  }
}
function complete() {
  practiceSession.active = false;
  clearInterval(practiceSession.timer);

  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.disabled = true;
  }

  // Update user data and show results
  // ... (existing code from your complete handling, e.g., updating stats, showing modal)

  // Show results popup/modal
  showResults();

  // After a short delay, load next exercise automatically
  setTimeout(() => {
    reset();
    generateNextExercise();
  }, 3000); // 3 seconds pause to show the results

  // Update UI buttons, etc.
  const startBtn = document.getElementById('start-practice-btn');
  if (startBtn) {
    startBtn.textContent = 'Start Practice';
    startBtn.disabled = false;
  }
}
function reset() {
  practiceSession.userInput = '';
  practiceSession.errors = [];
  practiceSession.keystrokes = 0;
  practiceSession.correctKeystrokes = 0;
  practiceSession.currentPosition = 0;
  practiceSession.active = false;
  clearInterval(practiceSession.timer);

  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.value = '';
    typingInput.disabled = true;
  }
}

function generateNextExercise() {
  generateTextForCurrentSettings(); // Or directly call your generatePracticeText()
  const typingInput = document.getElementById('typing-input');
  if (typingInput) {
    typingInput.disabled = false;
    typingInput.focus();
  }
}
