/**
 * Grid Rendering Functions
 * @module grid-renderer
 */

import { userBirthDate } from './state.js';
import { convertYearsToWeeks, getWeekdayName, calculateAge } from './utils.js';

export function createDaysForWeek(weekElement) {
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dayElement = document.createElement('div');

    dayElement.className = 'day';
    dayElement.id = dayIndex;

    dayElement.addEventListener('mouseenter', function () {
      if (userBirthDate && !this.querySelector('.tooltip')) {
        const weekId = this.parentElement.id;
        const dayId = this.id;
        const storedDate = this.dataset.date;

        if (storedDate) {
          const dayDate = new Date(storedDate);
          const tooltipElement = createTooltip(weekId, dayId, dayDate);
          this.appendChild(tooltipElement);
        }
      }
    });

    weekElement.appendChild(dayElement);
  }
}

export function renderWeeksGrid() {
  const gridContainer = document.querySelector('.container');
  const totalWeeks = convertYearsToWeeks(100);

  const weeksFragment = document.createDocumentFragment();

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    const weekElement = document.createElement('div');

    weekElement.className = 'week';
    weekElement.id = weekIndex;

    weekElement.addEventListener('click', function (event) {
      if (!userBirthDate) return;

      const clickedDay = event.target.closest('.day');
      if (!clickedDay) return;

      let modalElement = this.querySelector('.modal');

      if (!modalElement) {
        const lastDayOfWeek = this.children[6];
        const weekEndDate = lastDayOfWeek.dataset.date;

        if (weekEndDate) {
          modalElement = createModal(this.id, weekEndDate, userBirthDate);
          this.appendChild(modalElement);
        }
      }

      if (modalElement) {
        modalElement.className = 'modal show-modal';

        window.onclick = function (event) {
          if (event.target === modalElement) {
            modalElement.className = 'modal';
          }
        };
      }
    });

    createDaysForWeek(weekElement);
    weeksFragment.appendChild(weekElement);
  }

  gridContainer.appendChild(weeksFragment);
}

export function createTooltip(weekId, dayId, date) {
  const formattedDate = date.toDateString();
  const weekdayName = getWeekdayName(dayId);
  const weekNumber = Number(weekId) + 1;

  const tooltipElement = document.createElement('div');
  tooltipElement.className = 'tooltip';

  const weekNumberSpan = document.createElement('span');
  weekNumberSpan.textContent = `Week ${weekNumber}`;

  const weekdaySpan = document.createElement('span');
  weekdaySpan.textContent = weekdayName;

  const dateSpan = document.createElement('span');
  dateSpan.textContent = formattedDate;

  tooltipElement.appendChild(weekNumberSpan);
  tooltipElement.appendChild(weekdaySpan);
  tooltipElement.appendChild(dateSpan);

  return tooltipElement;
}

export function createModal(weekId, dateString, birthDate) {
  const weekNumber = Number(weekId) + 1;
  const weekEndDate = new Date(dateString);

  const ageAtWeek = calculateAge(birthDate, weekEndDate);

  const endDateFormatted = weekEndDate.toDateString();
  weekEndDate.setDate(weekEndDate.getDate() - 6);
  const startDateFormatted = weekEndDate.toDateString();

  const modalElement = document.createElement('div');
  modalElement.className = 'modal';
  modalElement.id = weekId;

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const weekNumberSpan = document.createElement('span');
  weekNumberSpan.textContent = `Week: ${weekNumber}`;

  const ageSpan = document.createElement('span');
  ageSpan.textContent = `Age: ${ageAtWeek}`;

  const startDateSpan = document.createElement('span');
  startDateSpan.textContent = `Date Start: ${startDateFormatted}`;

  const endDateSpan = document.createElement('span');
  endDateSpan.textContent = `Date End: ${endDateFormatted}`;

  modalContent.appendChild(weekNumberSpan);
  modalContent.appendChild(ageSpan);
  modalContent.appendChild(startDateSpan);
  modalContent.appendChild(endDateSpan);

  modalElement.appendChild(modalContent);

  return modalElement;
}
