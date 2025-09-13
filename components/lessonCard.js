// LessonCard.js
// Reusable UI component to display a lesson card

export function createLessonCard(lesson, onClick) {
  const card = document.createElement('div');
  card.className = 'lesson-card';
  card.dataset.type = lesson.type || 'custom';

  const title = document.createElement('h4');
  title.textContent = lesson.title;
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = lesson.description;
  card.appendChild(desc);

  card.addEventListener('click', () => {
    if (onClick) onClick(lesson.type || 'custom');
  });

  return card;
}
