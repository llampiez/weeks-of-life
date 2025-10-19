import { renderWeeksGrid } from './grid-renderer.js';
import { setupAllEventListeners } from './event-handlers.js';

function initializeApp() {
  // Render the weeks grid
  renderWeeksGrid();

  // Setup all event listeners
  setupAllEventListeners();

  // Clear all inputs on initialization
  const dateInput = document.querySelector('.date-input');
  const fatherBirthdateInput = document.querySelector('.father-birthdate');
  const motherBirthdateInput = document.querySelector('.mother-birthdate');
  const incomePerHourInput = document.querySelector('.income-per-hour');
  const hoursPerDayInput = document.querySelector('.hours-per-day');
  const travelTimeInput = document.querySelector('.travel-time-input');
  const fitnessTargetDateDisplay = document.querySelector('.fitness-target-date-display');
  const fitnessRemainingDaysDisplay = document.querySelector('.fitness-remaining-days');
  const alcoholCheckbox = document.querySelector('.alcohol-checkbox');
  const cigarettesCheckbox = document.querySelector('.cigarettes-checkbox');
  const exerciseBenefitMessage = document.querySelector('.exercise-benefit-message');
  const lifeReductionDisplay = document.querySelector('.life-reduction-display');
  const adjustedDeathDateDisplay = document.querySelector('.adjusted-death-date-display');
  const workDaysPerWeekInput = document.querySelector('.work-days-per-week');
  const workHoursPerDayInput = document.querySelector('.work-hours-per-day');
  const workMonthlySalaryInput = document.querySelector('.work-monthly-salary');
  const workInfoDisplay = document.querySelector('.work-info-display');
  const usualStuffExtraMinutesInput = document.querySelector('.usual-stuff-extra-minutes');
  const usualStuffDisplay = document.querySelector('.usual-stuff-display');
  const girlfriendInShapeCheckbox = document.querySelector('.girlfriend-in-shape-checkbox');
  const girlfriendTargetDateDisplay = document.querySelector('.girlfriend-target-date-display');
  const girlfriendRemainingTimeDisplay = document.querySelector('.girlfriend-remaining-time');
  const uselessSportCheckbox = document.querySelector('.useless-sport-checkbox');
  const uselessNetflixCheckbox = document.querySelector('.useless-netflix-checkbox');
  const uselessVideogameCheckbox = document.querySelector('.useless-videogame-checkbox');
  const uselessSportHoursInput = document.querySelector('.useless-sport-hours');
  const uselessNetflixHoursInput = document.querySelector('.useless-netflix-hours');
  const uselessVideogameHoursInput = document.querySelector('.useless-videogame-hours');
  const uselessHobbiesDisplay = document.querySelector('.useless-hobbies-display');
  const constructiveHoursPerDayInput = document.querySelector('.constructive-hours-per-day');
  const constructiveHoursDisplay = document.querySelector('.constructive-hours-display');
  const constructiveTargetDateDisplay = document.querySelector('.constructive-target-date-display');
  const constructiveRemainingDaysDisplay = document.querySelector('.constructive-remaining-days');

  dateInput.value = '';
  fatherBirthdateInput.value = '';
  motherBirthdateInput.value = '';
  incomePerHourInput.value = '';
  hoursPerDayInput.value = '';
  travelTimeInput.value = '15';
  fitnessTargetDateDisplay.textContent = '';
  fitnessRemainingDaysDisplay.textContent = '';
  alcoholCheckbox.checked = false;
  cigarettesCheckbox.checked = false;
  exerciseBenefitMessage.textContent = '';
  lifeReductionDisplay.textContent = '';
  adjustedDeathDateDisplay.textContent = '';
  workDaysPerWeekInput.value = '5';
  workHoursPerDayInput.value = '8';
  workMonthlySalaryInput.value = '';
  workInfoDisplay.textContent = '';
  usualStuffExtraMinutesInput.value = '0';
  usualStuffDisplay.textContent = '7.0h per week';
  girlfriendInShapeCheckbox.checked = false;
  girlfriendTargetDateDisplay.textContent = '';
  girlfriendRemainingTimeDisplay.textContent = '';
  uselessSportCheckbox.checked = false;
  uselessNetflixCheckbox.checked = false;
  uselessVideogameCheckbox.checked = false;
  uselessSportHoursInput.value = '1';
  uselessNetflixHoursInput.value = '1';
  uselessVideogameHoursInput.value = '1';
  uselessHobbiesDisplay.textContent = '0h per week';
  constructiveHoursPerDayInput.value = '0';
  constructiveHoursDisplay.textContent = '0h per week';
  constructiveTargetDateDisplay.textContent = '';
  constructiveRemainingDaysDisplay.textContent = '';
}

// Initialize app when DOM is loaded
initializeApp();
