import { PRICE_PER_SQUARE_METERS } from './constants.js';
import {
  userBirthDate,
  fatherData,
  motherData,
  badHabitsData,
  workData,
  usualStuffData,
  girlfriendData,
  uselessHobbiesData,
  constructiveActivitiesData,
  setFatherData,
  setMotherData,
  setBadHabitsData,
  setWorkData,
  setUsualStuffData,
  setGirlfriendData,
  setUselessHobbiesData,
  setConstructiveActivitiesData,
} from './state.js';
import { calculateAge } from './utils.js';
import { paintLifeProgress, clearLifeProgress } from './life-painter.js';
import {
  updateParentRemainingDays,
  clearParentInputs,
} from './parents-module.js';

export function setupAllEventListeners() {
  // State variables
  let isFiltered = false;
  let isLostFiltered = false;
  let phoneUsageHours = 2.5;
  let phoneDaysPerWeek = 5;
  let isPanelCollapsed = true;
  let recalculateTimeout = null;
  let birthdayTimeout = null;
  let fatherBirthdateTimeout = null;
  let motherBirthdateTimeout = null;
  let selectedGymHours = 1;
  let travelTimeMinutes = 15;

  // DOM elements
  const dateInput = document.querySelector('.date-input');
  const filterButton = document.querySelector('.filter-button');
  const filterLostButton = document.querySelector('.filter-lost-button');
  const phoneUsageButtons = document.querySelectorAll('.phone-usage-btn');
  const phoneDaysButtons = document.querySelectorAll('.phone-days-btn');
  const phoneUsageDisplay = document.querySelector('.phone-usage-display');
  const togglePanelBtn = document.querySelector('.toggle-panel-btn');
  const floatingPanel = document.querySelector('.floating-panel');
  const incomePerHourInput = document.querySelector('.income-per-hour');
  const hoursPerDayInput = document.querySelector('.hours-per-day');
  const calculateIncomeBtn = document.querySelector('.calculate-income-btn');
  const resetIncomeBtn = document.querySelector('.reset-income-btn');
  const incomeDisplay = document.querySelector('.income-display');
  const realStateDisplay = document.querySelector('.real-state-display');
  const workDaysPerWeekInput = document.querySelector('.work-days-per-week');
  const workHoursPerDayInput = document.querySelector('.work-hours-per-day');
  const workMonthlySalaryInput = document.querySelector('.work-monthly-salary');
  const usualStuffExtraMinutesInput = document.querySelector('.usual-stuff-extra-minutes');
  const usualStuffDisplay = document.querySelector('.usual-stuff-display');
  const fatherBirthdateInput = document.querySelector('.father-birthdate');
  const motherBirthdateInput = document.querySelector('.mother-birthdate');
  const gymHourButtons = document.querySelectorAll('.gym-hour-btn');
  const travelTimeInput = document.querySelector('.travel-time-input');
  const predictFitnessBtn = document.querySelector('.predict-fitness-btn');
  const fitnessTargetDateDisplay = document.querySelector(
    '.fitness-target-date-display',
  );
  const fitnessRemainingDaysDisplay = document.querySelector(
    '.fitness-remaining-days',
  );
  const alcoholCheckbox = document.querySelector('.alcohol-checkbox');
  const cigarettesCheckbox = document.querySelector('.cigarettes-checkbox');
  const exerciseBenefitMessage = document.querySelector(
    '.exercise-benefit-message',
  );
  const lifeReductionDisplay = document.querySelector(
    '.life-reduction-display',
  );
  const adjustedDeathDateDisplay = document.querySelector(
    '.adjusted-death-date-display',
  );
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

  // Initialize panel state
  floatingPanel.classList.add('collapsed');
  togglePanelBtn.textContent = '+';

  // Birthday input listener
  dateInput.addEventListener('change', () => {
    const birthdayString = dateInput.value;

    if (birthdayTimeout) {
      clearTimeout(birthdayTimeout);
    }

    if (!birthdayString) {
      clearLifeProgress();
      clearParentInputs();
      fitnessTargetDateDisplay.textContent = '';
      fitnessRemainingDaysDisplay.textContent = '';

      if (isFiltered) {
        const allWeeks = document.querySelectorAll('.week');
        allWeeks.forEach((weekElement) => {
          weekElement.classList.remove('hidden');
        });
        isFiltered = false;
        filterButton.textContent = 'Hide Past';
      }

      if (isLostFiltered) {
        const lostDays = document.querySelectorAll('.day-lost');
        const livedDays = document.querySelectorAll('.lived');
        const lastDay = document.querySelector('.last-day');
        const allWeeks = document.querySelectorAll('.week');
        lostDays.forEach((dayElement) => {
          dayElement.classList.remove('hidden-lost');
        });
        livedDays.forEach((dayElement) => {
          dayElement.classList.remove('hidden-lost');
        });
        if (lastDay) {
          lastDay.classList.remove('hidden-lost');
        }
        allWeeks.forEach((weekElement) => {
          weekElement.classList.remove('hidden-empty');
        });
        isLostFiltered = false;
        filterLostButton.textContent = 'Hide Lost Days';
      }
      return;
    }

    birthdayTimeout = setTimeout(() => {
      const birthDate = new Date(birthdayString + 'T00:00:00');
      const today = new Date();
      const minDate = new Date('1900-01-01T00:00:00');

      if (birthDate > today) {
        alert('Birthday cannot be in the future');
        dateInput.value = '';
        return;
      }

      if (birthDate < minDate) {
        alert('Please enter a valid birth year (1900 or later)');
        dateInput.value = '';
        return;
      }

      const age = calculateAge(birthDate, today);

      if (age > 150) {
        alert('Please enter a realistic birth date');
        dateInput.value = '';
        return;
      }

      const result = paintLifeProgress(
        birthdayString,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 500);
  });

  // Filter button listener
  filterButton.addEventListener('click', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      return;
    }

    const today = new Date();
    const todayString = today.toDateString();
    const allWeeks = document.querySelectorAll('.week');

    let currentWeekFound = false;

    allWeeks.forEach((weekElement) => {
      const days = weekElement.querySelectorAll('.day');
      let isCurrentWeek = false;

      days.forEach((dayElement) => {
        if (dayElement.dataset.date === todayString) {
          isCurrentWeek = true;
          currentWeekFound = true;
        }
      });

      if (!isFiltered) {
        if (!currentWeekFound) {
          weekElement.classList.add('hidden');
        }
      } else {
        weekElement.classList.remove('hidden');
      }
    });

    isFiltered = !isFiltered;
    filterButton.textContent = isFiltered ? 'Show All' : 'Hide Past';
  });

  // Filter lost button listener
  filterLostButton.addEventListener('click', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      return;
    }

    const lostDays = document.querySelectorAll('.day-lost');
    const livedDays = document.querySelectorAll('.lived');
    const lastDay = document.querySelector('.last-day');
    const socialMediaFullDays = document.querySelectorAll(
      '.day-social-media-full',
    );
    const socialMediaPartialDays = document.querySelectorAll(
      '.day-social-media-partial',
    );
    const workFullDays = document.querySelectorAll('.day-work-full');
    const workPartialDays = document.querySelectorAll('.day-work-partial');
    const usualStuffFullDays = document.querySelectorAll('.day-usual-stuff-full');
    const usualStuffPartialDays = document.querySelectorAll('.day-usual-stuff-partial');
    const girlfriendSearchingFullDays = document.querySelectorAll('.day-girlfriend-searching-full');
    const girlfriendSearchingPartialDays = document.querySelectorAll('.day-girlfriend-searching-partial');
    const girlfriendRelationshipFullDays = document.querySelectorAll('.day-girlfriend-relationship-full');
    const girlfriendRelationshipPartialDays = document.querySelectorAll('.day-girlfriend-relationship-partial');
    const uselessHobbiesFullDays = document.querySelectorAll('.day-useless-hobbies-full');
    const uselessHobbiesPartialDays = document.querySelectorAll('.day-useless-hobbies-partial');
    const constructiveFullDays = document.querySelectorAll('.day-constructive-full');
    const constructivePartialDays = document.querySelectorAll('.day-constructive-partial');
    const allWeeks = document.querySelectorAll('.week');

    if (!isLostFiltered) {
      lostDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      livedDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      if (lastDay) {
        lastDay.classList.add('hidden-lost');
      }
      socialMediaFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      socialMediaPartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      workFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      workPartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      usualStuffFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      usualStuffPartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      girlfriendSearchingFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      girlfriendSearchingPartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      girlfriendRelationshipFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      girlfriendRelationshipPartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      uselessHobbiesFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      uselessHobbiesPartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      constructiveFullDays.forEach((dayElement) => {
        dayElement.classList.add('hidden-lost');
      });
      constructivePartialDays.forEach((dayElement) => {
        const whitePercentage =
          parseFloat(dayElement.dataset.whitePercentage) || 0;
        const partialWidth = (30 * whitePercentage) / 100;
        dayElement.style.setProperty('--partial-width', `${partialWidth}px`);
        dayElement.classList.add('hidden-lost');
      });
      allWeeks.forEach((weekElement) => {
        const visibleDays = Array.from(
          weekElement.querySelectorAll('.day'),
        ).filter((day) => {
          const hasHiddenLost = day.classList.contains('hidden-lost');
          const isAfterDeath = day.classList.contains('after-death');
          const isNotLived = day.classList.contains('not-lived');
          return !hasHiddenLost && !isAfterDeath && !isNotLived;
        });

        if (visibleDays.length === 0) {
          weekElement.classList.add('hidden-empty');
        }
      });
    } else {
      lostDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      livedDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      if (lastDay) {
        lastDay.classList.remove('hidden-lost');
      }
      socialMediaFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      socialMediaPartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      workFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      workPartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      usualStuffFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      usualStuffPartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      girlfriendSearchingFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      girlfriendSearchingPartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      girlfriendRelationshipFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      girlfriendRelationshipPartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      uselessHobbiesFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      uselessHobbiesPartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      constructiveFullDays.forEach((dayElement) => {
        dayElement.classList.remove('hidden-lost');
      });
      constructivePartialDays.forEach((dayElement) => {
        dayElement.style.removeProperty('--partial-width');
        dayElement.classList.remove('hidden-lost');
      });
      allWeeks.forEach((weekElement) => {
        weekElement.classList.remove('hidden-empty');
      });
    }

    isLostFiltered = !isLostFiltered;
    filterLostButton.textContent = isLostFiltered
      ? 'Show All Days'
      : 'Hide Lost Days';
  });

  // Phone usage buttons listeners
  phoneUsageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!userBirthDate) {
        alert('Please enter your birthday first');
        return;
      }

      const hoursToAdd = parseFloat(button.dataset.hours);
      const newValue = phoneUsageHours + hoursToAdd;

      if (newValue < 0) {
        phoneUsageHours = 0;
      } else {
        // Calculate total available hours
        const totalAvailableHours = 4 * 24; // 96 hours

        // Calculate work hours
        const workHoursPerWeek = workData.hoursPerDay * workData.daysPerWeek;

        // Calculate usual stuff hours
        const baseUsualStuffMinutesPerDay = 60;
        const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (usualStuffData.extraMinutes / 7);
        const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

        // Calculate new phone hours per week
        const newPhoneHoursPerWeek = newValue * phoneDaysPerWeek;

        // Check if exceeds available hours
        const totalUsedHours = workHoursPerWeek + newPhoneHoursPerWeek + usualStuffHoursPerWeek;

        if (totalUsedHours > totalAvailableHours) {
          const availableForPhone = totalAvailableHours - workHoursPerWeek - usualStuffHoursPerWeek;
          const maxPhoneHoursPerDay = availableForPhone / phoneDaysPerWeek;
          alert(
            `You're exceeding the weekly limit!\n\n` +
            `Available hours for phone: ${availableForPhone.toFixed(1)}h/week (96h total - ${workHoursPerWeek}h work - ${usualStuffHoursPerWeek.toFixed(1)}h usual stuff)\n` +
            `Maximum phone hours per day: ${maxPhoneHoursPerDay.toFixed(1)}h/day\n\n` +
            `Please reduce work/usual stuff hours first or reduce phone usage.`
          );
          return;
        }

        phoneUsageHours = newValue;
      }

      phoneUsageDisplay.textContent = `${phoneUsageHours}h per day (${phoneDaysPerWeek} days/week)`;

      if (recalculateTimeout) {
        clearTimeout(recalculateTimeout);
      }

      recalculateTimeout = setTimeout(() => {
        const result = paintLifeProgress(
          dateInput.value,
          phoneUsageHours,
          selectedGymHours,
          phoneDaysPerWeek,
        );
        updateBadHabitsDisplay(result, selectedGymHours);
      }, 1000);
    });
  });

  // Phone days per week buttons listeners
  phoneDaysButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!userBirthDate) {
        alert('Please enter your birthday first');
        return;
      }

      // Update the days per week value
      const newPhoneDaysPerWeek = parseFloat(button.dataset.days);

      // Calculate total available hours
      const totalAvailableHours = 4 * 24; // 96 hours

      // Calculate work hours
      const workHoursPerWeek = workData.hoursPerDay * workData.daysPerWeek;

      // Calculate usual stuff hours
      const baseUsualStuffMinutesPerDay = 60;
      const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (usualStuffData.extraMinutes / 7);
      const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

      // Calculate new phone hours per week
      const newPhoneHoursPerWeek = phoneUsageHours * newPhoneDaysPerWeek;

      // Check if exceeds available hours
      const totalUsedHours = workHoursPerWeek + newPhoneHoursPerWeek + usualStuffHoursPerWeek;

      if (totalUsedHours > totalAvailableHours) {
        const availableForPhone = totalAvailableHours - workHoursPerWeek - usualStuffHoursPerWeek;
        alert(
          `You're exceeding the weekly limit!\n\n` +
          `Available hours for phone: ${availableForPhone.toFixed(1)}h/week (96h total - ${workHoursPerWeek}h work - ${usualStuffHoursPerWeek.toFixed(1)}h usual stuff)\n` +
          `Your phone hours would be: ${newPhoneHoursPerWeek.toFixed(1)}h/week\n\n` +
          `Please reduce work/usual stuff hours or phone usage per day first.`
        );
        return;
      }

      // Remove active class from all buttons
      phoneDaysButtons.forEach((btn) => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      phoneDaysPerWeek = newPhoneDaysPerWeek;

      // Update the display
      phoneUsageDisplay.textContent = `${phoneUsageHours}h per day (${phoneDaysPerWeek} days/week)`;

      if (recalculateTimeout) {
        clearTimeout(recalculateTimeout);
      }

      recalculateTimeout = setTimeout(() => {
        const result = paintLifeProgress(
          dateInput.value,
          phoneUsageHours,
          selectedGymHours,
          phoneDaysPerWeek,
        );
        updateBadHabitsDisplay(result, selectedGymHours);
      }, 1000);
    });
  });

  // Panel toggle listener
  togglePanelBtn.addEventListener('click', () => {
    isPanelCollapsed = !isPanelCollapsed;

    if (isPanelCollapsed) {
      floatingPanel.classList.add('collapsed');
      togglePanelBtn.textContent = '+';
    } else {
      floatingPanel.classList.remove('collapsed');
      togglePanelBtn.textContent = '−';
    }
  });

  // Income calculator listeners
  calculateIncomeBtn.addEventListener('click', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      return;
    }

    const incomePerHour = parseFloat(incomePerHourInput.value);
    const hoursPerDay = parseFloat(hoursPerDayInput.value);

    if (!incomePerHour || !hoursPerDay) {
      alert('Please enter both income per hour and hours per day');
      return;
    }

    if (incomePerHour <= 0 || hoursPerDay <= 0) {
      alert('Please enter positive values');
      return;
    }

    if (incomePerHour > 10000) {
      alert('Income per hour must be less than $10,000');
      return;
    }

    if (hoursPerDay > 24) {
      alert('Hours per day cannot exceed 24 hours');
      return;
    }

    const remainingDaysElement = document.querySelector('.remaining-days');
    const remainingDaysText = remainingDaysElement.textContent;
    const remainingDays = parseFloat(remainingDaysText.match(/[\d.]+/)[0]);

    const totalIncome = incomePerHour * hoursPerDay * remainingDays;

    incomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;

    const twentyPercentIncome = totalIncome * 0.2;
    const squareMeters = twentyPercentIncome / PRICE_PER_SQUARE_METERS;
    realStateDisplay.textContent = `${squareMeters.toFixed(2)} m²`;
  });

  resetIncomeBtn.addEventListener('click', () => {
    incomePerHourInput.value = '';
    hoursPerDayInput.value = '';
    incomeDisplay.textContent = '';
    realStateDisplay.textContent = '';
  });

  // Work module listeners
  let workUpdateTimeout = null;

  function validateAndUpdateWork() {
    if (!userBirthDate) {
      return;
    }

    let daysPerWeek = parseFloat(workDaysPerWeekInput.value);
    let hoursPerDay = parseFloat(workHoursPerDayInput.value);

    // Basic validations
    if (isNaN(daysPerWeek) || daysPerWeek < 1) {
      daysPerWeek = 1;
      workDaysPerWeekInput.value = 1;
    } else if (daysPerWeek > 7) {
      daysPerWeek = 7;
      workDaysPerWeekInput.value = 7;
      alert('Maximum 7 days per week');
    }

    if (isNaN(hoursPerDay) || hoursPerDay < 0.5) {
      hoursPerDay = 0.5;
      workHoursPerDayInput.value = 0.5;
    } else if (hoursPerDay > 24) {
      hoursPerDay = 24;
      workHoursPerDayInput.value = 24;
      alert('Maximum 24 hours per day');
    }

    // Calculate available hours for work in the week
    // Available days: Monday, Tuesday, Wednesday, Thursday (4 days × 24 hours = 96 hours)
    const totalAvailableHours = 4 * 24; // 96 hours

    // Subtract phone usage hours
    const phoneHoursPerWeek = phoneUsageHours * phoneDaysPerWeek;

    // Subtract usual stuff hours
    const baseUsualStuffMinutesPerDay = 60;
    const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (usualStuffData.extraMinutes / 7);
    const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

    const availableHoursForWork = totalAvailableHours - phoneHoursPerWeek - usualStuffHoursPerWeek;

    // Validate total work hours don't exceed available hours
    const totalWorkHoursPerWeek = daysPerWeek * hoursPerDay;

    if (totalWorkHoursPerWeek > availableHoursForWork) {
      alert(
        `You're exceeding the weekly limit!\n\n` +
        `Available hours: ${availableHoursForWork.toFixed(1)}h/week (96h total - ${phoneHoursPerWeek.toFixed(1)}h phone - ${usualStuffHoursPerWeek.toFixed(1)}h usual stuff)\n` +
        `Your work hours: ${totalWorkHoursPerWeek}h/week\n\n` +
        `Please reduce your work days/hours or reduce phone/usual stuff hours.`
      );
      return; // Don't update if exceeds limit
    }

    setWorkData({ daysPerWeek, hoursPerDay });

    // Update Income Calculator if monthly salary is provided
    const monthlySalary = parseFloat(workMonthlySalaryInput.value);
    if (monthlySalary && monthlySalary > 0) {
      const totalHoursPerMonth = daysPerWeek * hoursPerDay * 4.33;
      const incomePerHour = monthlySalary / totalHoursPerMonth;
      setWorkData({ monthlySalary });
      incomePerHourInput.value = incomePerHour.toFixed(2);
      hoursPerDayInput.value = hoursPerDay;
    }

    // Repaint life progress with new work hours
    const result = paintLifeProgress(
      dateInput.value,
      phoneUsageHours,
      selectedGymHours,
      phoneDaysPerWeek,
    );
    updateBadHabitsDisplay(result, selectedGymHours);
  }

  workDaysPerWeekInput.addEventListener('input', () => {
    if (workUpdateTimeout) {
      clearTimeout(workUpdateTimeout);
    }
    workUpdateTimeout = setTimeout(validateAndUpdateWork, 1000);
  });

  workHoursPerDayInput.addEventListener('input', () => {
    if (workUpdateTimeout) {
      clearTimeout(workUpdateTimeout);
    }
    workUpdateTimeout = setTimeout(validateAndUpdateWork, 1000);
  });

  workMonthlySalaryInput.addEventListener('input', () => {
    if (workUpdateTimeout) {
      clearTimeout(workUpdateTimeout);
    }
    workUpdateTimeout = setTimeout(validateAndUpdateWork, 1000);
  });

  // Usual Stuff module listener
  let usualStuffUpdateTimeout = null;

  function validateAndUpdateUsualStuff() {
    if (!userBirthDate) {
      return;
    }

    let extraMinutes = parseFloat(usualStuffExtraMinutesInput.value);

    // Basic validations
    if (isNaN(extraMinutes) || extraMinutes < 0) {
      extraMinutes = 0;
      usualStuffExtraMinutesInput.value = 0;
    }

    // Calculate total usual stuff hours per week
    const baseUsualStuffMinutesPerDay = 60; // 1 hour base
    const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (extraMinutes / 7);
    const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

    // Calculate available hours for usual stuff in the week
    const totalAvailableHours = 4 * 24; // 96 hours

    // Subtract phone usage hours
    const phoneHoursPerWeek = phoneUsageHours * phoneDaysPerWeek;

    // Subtract work hours
    const workHoursPerWeek = workData.hoursPerDay * workData.daysPerWeek;

    const availableHoursForUsualStuff = totalAvailableHours - phoneHoursPerWeek - workHoursPerWeek;

    // Validate total usual stuff hours don't exceed available hours
    if (usualStuffHoursPerWeek > availableHoursForUsualStuff) {
      alert(
        `You're exceeding the weekly limit!\n\n` +
        `Available hours: ${availableHoursForUsualStuff.toFixed(1)}h/week (96h total - ${phoneHoursPerWeek.toFixed(1)}h phone - ${workHoursPerWeek}h work)\n` +
        `Your usual stuff hours: ${usualStuffHoursPerWeek.toFixed(1)}h/week\n\n` +
        `Please reduce your extra minutes or reduce phone/work hours.`
      );
      return; // Don't update if exceeds limit
    }

    setUsualStuffData({ extraMinutes });

    // Update display
    usualStuffDisplay.textContent = `${usualStuffHoursPerWeek.toFixed(1)}h per week`;

    // Repaint life progress with new usual stuff hours
    const result = paintLifeProgress(
      dateInput.value,
      phoneUsageHours,
      selectedGymHours,
      phoneDaysPerWeek,
    );
    updateBadHabitsDisplay(result, selectedGymHours);
  }

  usualStuffExtraMinutesInput.addEventListener('input', () => {
    if (usualStuffUpdateTimeout) {
      clearTimeout(usualStuffUpdateTimeout);
    }
    usualStuffUpdateTimeout = setTimeout(validateAndUpdateUsualStuff, 1000);
  });

  // Father birthdate listener
  fatherBirthdateInput.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      fatherBirthdateInput.value = '';
      return;
    }

    const birthdayString = fatherBirthdateInput.value;

    if (fatherBirthdateTimeout) {
      clearTimeout(fatherBirthdateTimeout);
    }

    if (!birthdayString) {
      setFatherData({ birthDate: null });
      updateParentRemainingDays();
      if (userBirthDate && dateInput.value) {
        const result = paintLifeProgress(
          dateInput.value,
          phoneUsageHours,
          selectedGymHours,
          phoneDaysPerWeek,
        );
        updateBadHabitsDisplay(result, selectedGymHours);
      }
      return;
    }

    fatherBirthdateTimeout = setTimeout(() => {
      const birthDate = new Date(birthdayString + 'T00:00:00');
      const today = new Date();
      const minDate = new Date('1900-01-01T00:00:00');

      if (birthDate > today) {
        alert("Father's birthday cannot be in the future");
        fatherBirthdateInput.value = '';
        setFatherData({ birthDate: null });
        updateParentRemainingDays();
        return;
      }

      if (birthDate < minDate) {
        alert('Please enter a valid birth year (1900 or later)');
        fatherBirthdateInput.value = '';
        setFatherData({ birthDate: null });
        updateParentRemainingDays();
        return;
      }

      const age = calculateAge(birthDate, today);

      if (age > 150) {
        alert('Please enter a realistic birth date');
        fatherBirthdateInput.value = '';
        setFatherData({ birthDate: null });
        updateParentRemainingDays();
        return;
      }

      setFatherData({ birthDate: birthdayString });
      updateParentRemainingDays();

      if (userBirthDate && dateInput.value) {
        const result = paintLifeProgress(
          dateInput.value,
          phoneUsageHours,
          selectedGymHours,
          phoneDaysPerWeek,
        );
        updateBadHabitsDisplay(result, selectedGymHours);
      }
    }, 1000);
  });

  // Mother birthdate listener
  motherBirthdateInput.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      motherBirthdateInput.value = '';
      return;
    }

    const birthdayString = motherBirthdateInput.value;

    if (motherBirthdateTimeout) {
      clearTimeout(motherBirthdateTimeout);
    }

    if (!birthdayString) {
      setMotherData({ birthDate: null });
      updateParentRemainingDays();
      if (userBirthDate && dateInput.value) {
        const result = paintLifeProgress(
          dateInput.value,
          phoneUsageHours,
          selectedGymHours,
          phoneDaysPerWeek,
        );
        updateBadHabitsDisplay(result, selectedGymHours);
      }
      return;
    }

    motherBirthdateTimeout = setTimeout(() => {
      const birthDate = new Date(birthdayString + 'T00:00:00');
      const today = new Date();
      const minDate = new Date('1900-01-01T00:00:00');

      if (birthDate > today) {
        alert("Mother's birthday cannot be in the future");
        motherBirthdateInput.value = '';
        setMotherData({ birthDate: null });
        updateParentRemainingDays();
        return;
      }

      if (birthDate < minDate) {
        alert('Please enter a valid birth year (1900 or later)');
        motherBirthdateInput.value = '';
        setMotherData({ birthDate: null });
        updateParentRemainingDays();
        return;
      }

      const age = calculateAge(birthDate, today);

      if (age > 150) {
        alert('Please enter a realistic birth date');
        motherBirthdateInput.value = '';
        setMotherData({ birthDate: null });
        updateParentRemainingDays();
        return;
      }

      setMotherData({ birthDate: birthdayString });
      updateParentRemainingDays();

      if (userBirthDate && dateInput.value) {
        const result = paintLifeProgress(
          dateInput.value,
          phoneUsageHours,
          selectedGymHours,
          phoneDaysPerWeek,
        );
        updateBadHabitsDisplay(result, selectedGymHours);
      }
    }, 1000);
  });

  // Gym hours selection
  gymHourButtons.forEach((button) => {
    button.addEventListener('click', () => {
      gymHourButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      selectedGymHours = parseFloat(button.dataset.hours);

      // Recalculate bad habits effect if user has bad habits selected
      if (
        userBirthDate &&
        dateInput.value &&
        (badHabitsData.drinksAlcohol || badHabitsData.smokesCigarettes)
      ) {
        if (recalculateTimeout) {
          clearTimeout(recalculateTimeout);
        }
        recalculateTimeout = setTimeout(() => {
          const result = paintLifeProgress(
            dateInput.value,
            phoneUsageHours,
            selectedGymHours,
            phoneDaysPerWeek,
          );
          updateBadHabitsDisplay(result, selectedGymHours);
        }, 1000);
      }
    });
  });

  // Travel time input validation
  travelTimeInput.addEventListener('input', () => {
    const value = parseFloat(travelTimeInput.value);
    if (value < 0) {
      travelTimeInput.value = 0;
    } else if (value > 120) {
      travelTimeInput.value = 120;
    }
    travelTimeMinutes = parseFloat(travelTimeInput.value) || 0;
  });

  // Fitness prediction button
  predictFitnessBtn.addEventListener('click', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      return;
    }

    // Constants
    const TARGET_TRAINING_HOURS = 72; // 3h/week * 24 weeks = 6 months
    const SESSIONS_PER_WEEK = selectedGymHours;

    // Calculate effective training time per week
    const travelTimeHoursPerSession = (travelTimeMinutes * 2) / 60; // Round trip
    const travelTimeHoursPerWeek =
      travelTimeHoursPerSession * SESSIONS_PER_WEEK;
    const effectiveTrainingHoursPerWeek =
      selectedGymHours - travelTimeHoursPerWeek;

    // Validate effective training time
    if (effectiveTrainingHoursPerWeek <= 0) {
      alert(
        'Travel time exceeds training time. Please reduce travel time or increase gym hours.',
      );
      fitnessTargetDateDisplay.textContent = '';
      fitnessRemainingDaysDisplay.textContent = '';
      return;
    }

    // Calculate weeks needed and target date
    const weeksNeeded = Math.ceil(
      TARGET_TRAINING_HOURS / effectiveTrainingHoursPerWeek,
    );
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);

    // Calculate days remaining
    const daysRemaining = Math.floor(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Display results
    fitnessTargetDateDisplay.textContent = `Target date: ${targetDate.toLocaleDateString()}`;
    fitnessRemainingDaysDisplay.textContent = `${daysRemaining} days to get fit`;
  });

  // Bad habits listeners
  let badHabitsTimeout = null;

  alcoholCheckbox.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      alcoholCheckbox.checked = false;
      return;
    }

    badHabitsData.drinksAlcohol = alcoholCheckbox.checked;
    setBadHabitsData(badHabitsData);

    if (badHabitsTimeout) {
      clearTimeout(badHabitsTimeout);
    }

    badHabitsTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  cigarettesCheckbox.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      cigarettesCheckbox.checked = false;
      return;
    }

    badHabitsData.smokesCigarettes = cigarettesCheckbox.checked;
    setBadHabitsData(badHabitsData);

    if (badHabitsTimeout) {
      clearTimeout(badHabitsTimeout);
    }

    badHabitsTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Girlfriend module listener
  let girlfriendTimeout = null;

  girlfriendInShapeCheckbox.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      girlfriendInShapeCheckbox.checked = false;
      return;
    }

    const isInShape = girlfriendInShapeCheckbox.checked;
    setGirlfriendData({ isInShape });

    // Calculate target date based on physical shape
    const today = new Date();
    const targetDate = new Date(today);
    const monthsToAdd = isInShape ? 3 : 6;
    targetDate.setMonth(targetDate.getMonth() + monthsToAdd);

    // Calculate days remaining
    const daysRemaining = Math.floor(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Update displays
    girlfriendTargetDateDisplay.textContent = `Target date: ${targetDate.toLocaleDateString()}`;
    girlfriendRemainingTimeDisplay.textContent = `${daysRemaining} days until relationship phase`;

    // Repaint life progress
    if (girlfriendTimeout) {
      clearTimeout(girlfriendTimeout);
    }

    girlfriendTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Useless hobbies module listeners
  let uselessHobbiesTimeout = null;

  // Useless Sport checkbox
  uselessSportCheckbox.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      uselessSportCheckbox.checked = false;
      return;
    }

    const enabled = uselessSportCheckbox.checked;
    const hours = enabled ? parseInt(uselessSportHoursInput.value) : 0;

    if (enabled && !validateUselessHobbiesLimit(hours, uselessHobbiesData.uselessSport.enabled ? uselessHobbiesData.uselessSport.hours : 0)) {
      alert('You\'re exceeding the weekly limit of 96 hours! Please reduce other activities first.');
      uselessSportCheckbox.checked = false;
      return;
    }

    setUselessHobbiesData({
      uselessSport: { enabled, hours: parseInt(uselessSportHoursInput.value) }
    });

    updateUselessHobbiesDisplay();

    if (uselessHobbiesTimeout) {
      clearTimeout(uselessHobbiesTimeout);
    }

    uselessHobbiesTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Useless Netflix checkbox
  uselessNetflixCheckbox.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      uselessNetflixCheckbox.checked = false;
      return;
    }

    const enabled = uselessNetflixCheckbox.checked;
    const hours = enabled ? parseInt(uselessNetflixHoursInput.value) : 0;

    if (enabled && !validateUselessHobbiesLimit(hours, uselessHobbiesData.uselessNetflix.enabled ? uselessHobbiesData.uselessNetflix.hours : 0)) {
      alert('You\'re exceeding the weekly limit of 96 hours! Please reduce other activities first.');
      uselessNetflixCheckbox.checked = false;
      return;
    }

    setUselessHobbiesData({
      uselessNetflix: { enabled, hours: parseInt(uselessNetflixHoursInput.value) }
    });

    updateUselessHobbiesDisplay();

    if (uselessHobbiesTimeout) {
      clearTimeout(uselessHobbiesTimeout);
    }

    uselessHobbiesTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Useless Videogame checkbox
  uselessVideogameCheckbox.addEventListener('change', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      uselessVideogameCheckbox.checked = false;
      return;
    }

    const enabled = uselessVideogameCheckbox.checked;
    const hours = enabled ? parseInt(uselessVideogameHoursInput.value) : 0;

    if (enabled && !validateUselessHobbiesLimit(hours, uselessHobbiesData.uselessVideogame.enabled ? uselessHobbiesData.uselessVideogame.hours : 0)) {
      alert('You\'re exceeding the weekly limit of 96 hours! Please reduce other activities first.');
      uselessVideogameCheckbox.checked = false;
      return;
    }

    setUselessHobbiesData({
      uselessVideogame: { enabled, hours: parseInt(uselessVideogameHoursInput.value) }
    });

    updateUselessHobbiesDisplay();

    if (uselessHobbiesTimeout) {
      clearTimeout(uselessHobbiesTimeout);
    }

    uselessHobbiesTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Useless Sport hours input
  uselessSportHoursInput.addEventListener('input', () => {
    if (!userBirthDate || !uselessSportCheckbox.checked) {
      return;
    }

    const newHours = parseInt(uselessSportHoursInput.value) || 1;
    if (newHours < 1) {
      uselessSportHoursInput.value = 1;
      return;
    }
    if (newHours > 10) {
      uselessSportHoursInput.value = 10;
      return;
    }

    if (!validateUselessHobbiesLimit(newHours, uselessHobbiesData.uselessSport.hours)) {
      alert('You\'re exceeding the weekly limit of 96 hours! Please reduce other activities first.');
      uselessSportHoursInput.value = uselessHobbiesData.uselessSport.hours;
      return;
    }

    setUselessHobbiesData({
      uselessSport: { enabled: true, hours: newHours }
    });

    updateUselessHobbiesDisplay();

    if (uselessHobbiesTimeout) {
      clearTimeout(uselessHobbiesTimeout);
    }

    uselessHobbiesTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Useless Netflix hours input
  uselessNetflixHoursInput.addEventListener('input', () => {
    if (!userBirthDate || !uselessNetflixCheckbox.checked) {
      return;
    }

    const newHours = parseInt(uselessNetflixHoursInput.value) || 1;
    if (newHours < 1) {
      uselessNetflixHoursInput.value = 1;
      return;
    }
    if (newHours > 10) {
      uselessNetflixHoursInput.value = 10;
      return;
    }

    if (!validateUselessHobbiesLimit(newHours, uselessHobbiesData.uselessNetflix.hours)) {
      alert('You\'re exceeding the weekly limit of 96 hours! Please reduce other activities first.');
      uselessNetflixHoursInput.value = uselessHobbiesData.uselessNetflix.hours;
      return;
    }

    setUselessHobbiesData({
      uselessNetflix: { enabled: true, hours: newHours }
    });

    updateUselessHobbiesDisplay();

    if (uselessHobbiesTimeout) {
      clearTimeout(uselessHobbiesTimeout);
    }

    uselessHobbiesTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Useless Videogame hours input
  uselessVideogameHoursInput.addEventListener('input', () => {
    if (!userBirthDate || !uselessVideogameCheckbox.checked) {
      return;
    }

    const newHours = parseInt(uselessVideogameHoursInput.value) || 1;
    if (newHours < 1) {
      uselessVideogameHoursInput.value = 1;
      return;
    }
    if (newHours > 10) {
      uselessVideogameHoursInput.value = 10;
      return;
    }

    if (!validateUselessHobbiesLimit(newHours, uselessHobbiesData.uselessVideogame.hours)) {
      alert('You\'re exceeding the weekly limit of 96 hours! Please reduce other activities first.');
      uselessVideogameHoursInput.value = uselessHobbiesData.uselessVideogame.hours;
      return;
    }

    setUselessHobbiesData({
      uselessVideogame: { enabled: true, hours: newHours }
    });

    updateUselessHobbiesDisplay();

    if (uselessHobbiesTimeout) {
      clearTimeout(uselessHobbiesTimeout);
    }

    uselessHobbiesTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });

  // Helper function to update bad habits display
  function updateBadHabitsDisplay(result, gymHours) {
    if (!result) return;

    const hasAnyBadHabit =
      badHabitsData.drinksAlcohol || badHabitsData.smokesCigarettes;

    if (!hasAnyBadHabit) {
      exerciseBenefitMessage.textContent = '';
      lifeReductionDisplay.textContent = '';
      adjustedDeathDateDisplay.textContent = '';
      return;
    }

    // Show exercise benefit message if exercising 3 hours and has bad habits
    if (gymHours === 3 && hasAnyBadHabit) {
      exerciseBenefitMessage.textContent =
        'Exercising 3h/week has halved the negative effects!';
    } else {
      exerciseBenefitMessage.textContent = '';
    }

    // Display life reduction
    const yearsText = result.yearsLost === 1 ? 'year' : 'years';
    const daysText = result.daysLost === 1 ? 'day' : 'days';
    lifeReductionDisplay.textContent = `Reduced quality life: ${result.yearsLost} ${yearsText} (${result.daysLost} ${daysText})`;

    // Calculate new death date (original death date minus years lost)
    const newDeathDate = new Date(result.adjustedDeathDate);
    newDeathDate.setFullYear(newDeathDate.getFullYear() - result.yearsLost);
    adjustedDeathDateDisplay.textContent = `New date of death: ${newDeathDate.toLocaleDateString()}`;
  }

  // Helper functions for useless hobbies
  function calculateUselessHobbiesTotal() {
    let total = 0;
    if (uselessHobbiesData.uselessSport.enabled) {
      total += uselessHobbiesData.uselessSport.hours;
    }
    if (uselessHobbiesData.uselessNetflix.enabled) {
      total += uselessHobbiesData.uselessNetflix.hours;
    }
    if (uselessHobbiesData.uselessVideogame.enabled) {
      total += uselessHobbiesData.uselessVideogame.hours;
    }
    return total;
  }

  function validateUselessHobbiesLimit(newHours, currentActivityHours) {
    const totalAvailableHours = 4 * 24; // 96 hours

    // Calculate current usage
    const phoneHoursPerWeek = phoneUsageHours * phoneDaysPerWeek;
    const workHoursPerWeek = workData.hoursPerDay * workData.daysPerWeek;

    const baseUsualStuffMinutesPerDay = 60;
    const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (usualStuffData.extraMinutes / 7);
    const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

    // Calculate girlfriend hours (simplified average)
    const searchingHoursPerWeek = 7;
    const relationshipHoursPerWeek = 10;
    const avgGirlfriendHours = girlfriendData.isInShape ? (searchingHoursPerWeek + relationshipHoursPerWeek) / 2 : searchingHoursPerWeek;

    // Calculate current useless hobbies total (excluding the one being changed)
    const currentUselessHobbiesTotal = calculateUselessHobbiesTotal() - currentActivityHours;
    const newUselessHobbiesTotal = currentUselessHobbiesTotal + newHours;

    const totalUsedHours = phoneHoursPerWeek + workHoursPerWeek + usualStuffHoursPerWeek + avgGirlfriendHours + newUselessHobbiesTotal;

    return totalUsedHours <= totalAvailableHours;
  }

  function updateUselessHobbiesDisplay() {
    const total = calculateUselessHobbiesTotal();
    uselessHobbiesDisplay.textContent = `${total}h per week`;
  }

  // Constructive Activities module listener
  let constructiveTimeout = null;

  constructiveHoursPerDayInput.addEventListener('input', () => {
    if (!userBirthDate) {
      alert('Please enter your birthday first');
      constructiveHoursPerDayInput.value = '0';
      return;
    }

    let hoursPerDay = parseFloat(constructiveHoursPerDayInput.value);

    // Basic validations
    if (isNaN(hoursPerDay) || hoursPerDay < 0) {
      hoursPerDay = 0;
      constructiveHoursPerDayInput.value = 0;
    } else if (hoursPerDay > 24) {
      hoursPerDay = 24;
      constructiveHoursPerDayInput.value = 24;
      alert('Maximum 24 hours per day');
    }

    // Calculate total hours per week
    const constructiveHoursPerWeek = hoursPerDay * 7;

    // Calculate available hours for constructive activities
    const totalAvailableHours = 4 * 24; // 96 hours

    // Calculate current usage
    const phoneHoursPerWeek = phoneUsageHours * phoneDaysPerWeek;
    const workHoursPerWeek = workData.hoursPerDay * workData.daysPerWeek;

    const baseUsualStuffMinutesPerDay = 60;
    const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (usualStuffData.extraMinutes / 7);
    const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

    // Calculate girlfriend hours (simplified average)
    const searchingHoursPerWeek = 7;
    const relationshipHoursPerWeek = 10;
    const avgGirlfriendHours = girlfriendData.isInShape ? (searchingHoursPerWeek + relationshipHoursPerWeek) / 2 : searchingHoursPerWeek;

    // Calculate useless hobbies total
    const uselessHobbiesTotal = calculateUselessHobbiesTotal();

    const totalUsedHours = phoneHoursPerWeek + workHoursPerWeek + usualStuffHoursPerWeek + avgGirlfriendHours + uselessHobbiesTotal + constructiveHoursPerWeek;

    // Validate total hours don't exceed available hours
    if (totalUsedHours > totalAvailableHours) {
      const availableForConstructive = totalAvailableHours - phoneHoursPerWeek - workHoursPerWeek - usualStuffHoursPerWeek - avgGirlfriendHours - uselessHobbiesTotal;
      const maxHoursPerDay = availableForConstructive / 7;
      alert(
        `You're exceeding the weekly limit!\n\n` +
        `Available hours for constructive activities: ${availableForConstructive.toFixed(1)}h/week\n` +
        `Maximum hours per day: ${maxHoursPerDay.toFixed(1)}h/day\n\n` +
        `Please reduce other activities first.`
      );
      constructiveHoursPerDayInput.value = constructiveActivitiesData.hoursPerDay;
      return; // Don't update if exceeds limit
    }

    // Update state
    setConstructiveActivitiesData({ hoursPerDay });

    // Update display
    constructiveHoursDisplay.textContent = `${constructiveHoursPerWeek.toFixed(1)}h per week`;

    // Calculate target date (1000 hours total)
    if (hoursPerDay > 0) {
      const totalHoursNeeded = 1000;
      const weeksNeeded = totalHoursNeeded / constructiveHoursPerWeek;
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + Math.ceil(weeksNeeded * 7));

      // Calculate days remaining
      const daysRemaining = Math.floor(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Update displays
      constructiveTargetDateDisplay.textContent = `Target date: ${targetDate.toLocaleDateString()}`;
      constructiveRemainingDaysDisplay.textContent = `${daysRemaining} days to complete 1000 hours`;
    } else {
      constructiveTargetDateDisplay.textContent = '';
      constructiveRemainingDaysDisplay.textContent = '';
    }

    // Repaint life progress with new constructive hours
    if (constructiveTimeout) {
      clearTimeout(constructiveTimeout);
    }

    constructiveTimeout = setTimeout(() => {
      const result = paintLifeProgress(
        dateInput.value,
        phoneUsageHours,
        selectedGymHours,
        phoneDaysPerWeek,
      );
      updateBadHabitsDisplay(result, selectedGymHours);
    }, 1000);
  });
}
