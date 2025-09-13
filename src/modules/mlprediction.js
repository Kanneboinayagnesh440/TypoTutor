// mlPrediction.js
// (optional) Additional ML prediction utilities

// Example: Simple typo predictor based on frequency
export function predictNextTypo(errorPatterns) {
    let mostFrequent = null;
    let maxFreq = 0;
    Object.entries(errorPatterns).forEach(([word, meta]) => {
        if (meta.frequency > maxFreq) {
            maxFreq = meta.frequency;
            mostFrequent = { word, type: meta.type };
        }
    });
    return mostFrequent;
}
