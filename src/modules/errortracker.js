// errorTracker.js
// Existing error tracking utilities, for reference/integration

export function logError(errorPatterns, word, type) {
    if (!errorPatterns[word]) {
        errorPatterns[word] = { type, frequency: 1 };
    } else {
        errorPatterns[word].frequency += 1;
    }
    return errorPatterns;
}
