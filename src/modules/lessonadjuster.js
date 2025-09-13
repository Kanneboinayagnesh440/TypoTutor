// lessonAdjuster.js
// Logic for dynamic lesson adjustment and drill suggestions

export function getPersonalizedLessons(errorPatterns, appData) {
    // Example: Return top error patterns as lessons
    if (!errorPatterns || Object.keys(errorPatterns).length === 0) {
        return [
            { title: 'Practice Common Words', description: 'Improve your accuracy on the most-used English words.', type: 'commonWords' }
        ];
    }
    const lessons = [];
    Object.entries(errorPatterns).forEach(([word, meta]) => {
        lessons.push({
            title: `Focus: ${word}`,
            description: `You often mistype "${word}" (${meta.type}). Practice this word for improvement.`,
            type: meta.type
        });
    });
    return lessons;
}
