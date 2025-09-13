// lessonAdjuster.test.js
// Simple test to verify lessonAdjuster functionality

import { getPersonalizedLessons } from '/src/modules/lessonAdjuster.js';

const mockErrorPatterns = {
  'teh': { type: 'transposition', frequency: 10 },
  'adn': { type: 'transposition', frequency: 5 }
};

const mockAppData = {}; // minimal or your actual app data if needed

function testGetPersonalizedLessons() {
  const lessons = getPersonalizedLessons(mockErrorPatterns, mockAppData);
  console.assert(lessons.length === 2, `Expected 2 lessons, got ${lessons.length}`);
  console.assert(lessons[0].title.includes('teh'), 'Lesson title should contain "teh"');
  console.log('lessonAdjuster test passed');
}

testGetPersonalizedLessons();
