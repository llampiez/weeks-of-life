const PRICE_PER_SQUARE_METERS = 200;
const LIFE_EXPECTANCY_YEARS = 72;
const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

let userBirthDate = null;

//? Utility functions

function convertYearsToWeeks(years) {
  return Math.ceil(years * 52.1429);
}

function getWeekdayName(dayIndex) {
  return WEEKDAY_NAMES[dayIndex];
}

function calculateAge(birthDate, currentDate = new Date()) {
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

//* Logical functions

function createDaysForWeek(weekElement) {
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

function renderWeeksGrid(birthDate = null) {
  const gridContainer = document.querySelector('.container');
  let totalWeeks = convertYearsToWeeks(LIFE_EXPECTANCY_YEARS);

  if (birthDate) {
    const deathDate = new Date(birthDate);
    deathDate.setFullYear(deathDate.getFullYear() + LIFE_EXPECTANCY_YEARS);

    const mondayBeforeBirth = new Date(birthDate);
    mondayBeforeBirth.setDate(
      mondayBeforeBirth.getDate() -
        (mondayBeforeBirth.getDay() - 1 >= 0
          ? mondayBeforeBirth.getDay() - 1
          : 6),
    );

    const sundayAfterDeath = new Date(deathDate);
    const daysUntilSunday = 7 - deathDate.getDay();
    sundayAfterDeath.setDate(sundayAfterDeath.getDate() + daysUntilSunday);

    const totalDays = Math.ceil(
      (sundayAfterDeath.getTime() - mondayBeforeBirth.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    totalWeeks = Math.ceil(totalDays / 7);
  }

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

function createTooltip(weekId, dayId, date) {
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

function createModal(weekId, dateString, birthDate) {
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

function paintLifeProgress(birthdayString, socialMediaHoursPerDay) {
  const currentDate = new Date();
  const birthDateTime = new Date(birthdayString + 'T00:00:00');

  userBirthDate = new Date(birthDateTime);

  const deathDate = new Date(birthDateTime);
  deathDate.setFullYear(deathDate.getFullYear() + LIFE_EXPECTANCY_YEARS);
  const deathDateString = deathDate.toDateString();

  const allDayElements = document.querySelectorAll('.day');

  allDayElements.forEach((dayElement) => {
    dayElement.className = 'day';
    dayElement.textContent = '';
  });

  let totalDaysLived = Math.floor(
    (currentDate.getTime() - birthDateTime.getTime()) / (1000 * 60 * 60 * 24),
  );

  let daysUntilMonday = birthDateTime.getDay() - 1;

  birthDateTime.setDate(
    birthDateTime.getDate() -
      (birthDateTime.getDay() - 1 >= 0 ? birthDateTime.getDay() - 1 : 6),
  );

  const livedDayElements = [];
  const lostDayElements = [];
  const notLivedDayElements = [];
  const afterDeathDayElements = [];
  const futureDayElements = [];
  let lastDayElement = null;
  let deathDayFound = false;

  allDayElements.forEach((dayElement) => {
    dayElement.dataset.date = birthDateTime.toDateString();

    if (birthDateTime.toDateString() === deathDateString) {
      lastDayElement = dayElement;
      deathDayFound = true;
    } else if (deathDayFound) {
      afterDeathDayElements.push(dayElement);
      daysUntilMonday--;
      birthDateTime.setDate(birthDateTime.getDate() + 1);
      return;
    }

    const dayOfWeek = dayElement.id;
    const isWeekend =
      dayOfWeek === '4' || dayOfWeek === '5' || dayOfWeek === '6';

    if (daysUntilMonday > 0) {
      notLivedDayElements.push(dayElement);
    } else if (daysUntilMonday <= 0 && totalDaysLived > 0) {
      livedDayElements.push(dayElement);
      totalDaysLived--;
    } else if (isWeekend) {
      lostDayElements.push(dayElement);
    } else if (dayElement !== lastDayElement) {
      futureDayElements.push(dayElement);
    }

    daysUntilMonday--;
    birthDateTime.setDate(birthDateTime.getDate() + 1);
  });

  notLivedDayElements.forEach((dayElement) => {
    dayElement.className = 'day not-lived';
  });

  livedDayElements.forEach((dayElement) => {
    dayElement.className = 'day lived';
  });

  lostDayElements.forEach((dayElement) => {
    dayElement.className = 'day day-lost';
  });

  afterDeathDayElements.forEach((dayElement) => {
    dayElement.className = 'day after-death';
  });

  if (lastDayElement) {
    lastDayElement.className = 'day last-day';
    lastDayElement.textContent = '⚰️';
  }

  const socialMediaHoursPerWeek = socialMediaHoursPerDay * 7;
  const socialMediaDaysPerWeek = socialMediaHoursPerWeek / 24;

  const fullDays = Math.floor(socialMediaDaysPerWeek);
  const partialDayPercentage = (socialMediaDaysPerWeek - fullDays) * 100;

  const socialMediaDayMap = { 3: 1, 2: 2, 1: 3, 0: 4 };

  futureDayElements.forEach((dayElement) => {
    const dayOfWeek = parseInt(dayElement.id);

    dayElement.style.background = '';
    dayElement.style.border = '';
    delete dayElement.dataset.whitePercentage;

    const requiredFullDays = socialMediaDayMap[dayOfWeek];
    if (requiredFullDays !== undefined) {
      if (fullDays >= requiredFullDays) {
        dayElement.className = 'day day-social-media-full';
      } else if (
        fullDays === requiredFullDays - 1 &&
        partialDayPercentage > 0
      ) {
        dayElement.className = 'day day-social-media-partial';
        dayElement.style.background = `linear-gradient(to right, #FF69B4 ${partialDayPercentage}%, white ${partialDayPercentage}%)`;
        dayElement.style.border = '1px solid gray';
        dayElement.dataset.whitePercentage = 100 - partialDayPercentage;
      }
    }
  });

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const todayDayOfWeek = today.getDay();
  const daysUntilNextMonday =
    todayDayOfWeek === 1 ? 7 : todayDayOfWeek === 0 ? 1 : 8 - todayDayOfWeek;

  const nextMonday = new Date(today);
  nextMonday.setDate(nextMonday.getDate() + daysUntilNextMonday);

  const dayBeforeDeath = new Date(deathDate);
  dayBeforeDeath.setDate(dayBeforeDeath.getDate() - 1);
  dayBeforeDeath.setHours(0, 0, 0, 0);

  const daysInCurrentPartialWeek = Math.floor(
    (nextMonday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let lostDaysInCurrentWeek = 0;
  for (let i = 0; i < daysInCurrentPartialWeek; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() + i);
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0)
      lostDaysInCurrentWeek += 1;
  }
  lostDaysInCurrentWeek += socialMediaDaysPerWeek;

  const daysFromNextMondayToBeforeDeath =
    Math.floor(
      (dayBeforeDeath.getTime() - nextMonday.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  const completeWeeks = Math.floor(daysFromNextMondayToBeforeDeath / 7);
  const remainingDaysInFinalWeek = daysFromNextMondayToBeforeDeath % 7;

  let lostDaysInFinalWeek = 0;
  if (remainingDaysInFinalWeek > 0) {
    for (let i = 0; i < remainingDaysInFinalWeek; i++) {
      const checkDate = new Date(nextMonday);
      checkDate.setDate(checkDate.getDate() + completeWeeks * 7 + i);
      const dayOfWeek = checkDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0)
        lostDaysInFinalWeek += 1;
    }
    lostDaysInFinalWeek += socialMediaDaysPerWeek;
  }

  const usableDaysInCurrentWeek = Math.max(
    0,
    daysInCurrentPartialWeek - lostDaysInCurrentWeek,
  );
  const usableDaysInCompleteWeeks =
    completeWeeks * (7 - (3 + socialMediaDaysPerWeek));
  const usableDaysInFinalWeek = Math.max(
    0,
    remainingDaysInFinalWeek - lostDaysInFinalWeek,
  );

  const usableDaysRemaining =
    usableDaysInCurrentWeek + usableDaysInCompleteWeeks + usableDaysInFinalWeek;

  const remainingDaysElement = document.querySelector('.remaining-days');
  remainingDaysElement.textContent = `Remaining days of life: ${
    Math.round(usableDaysRemaining * 100) / 100
  } days`;
}

function clearLifeProgress() {
  userBirthDate = null;

  const gridContainer = document.querySelector('.container');
  gridContainer.innerHTML = '';

  renderWeeksGrid();

  const remainingDaysElement = document.querySelector('.remaining-days');
  remainingDaysElement.textContent = '';
}

function initializeApp() {
  renderWeeksGrid();

  const dateInput = document.querySelector('.date-input');
  dateInput.value = '';
  const filterButton = document.querySelector('.filter-button');
  const filterLostButton = document.querySelector('.filter-lost-button');
  const phoneUsageButtons = document.querySelectorAll('.phone-usage-btn');
  const phoneUsageDisplay = document.querySelector('.phone-usage-display');
  const togglePanelBtn = document.querySelector('.toggle-panel-btn');
  const floatingPanel = document.querySelector('.floating-panel');
  const incomePerHourInput = document.querySelector('.income-per-hour');
  const hoursPerDayInput = document.querySelector('.hours-per-day');
  const calculateIncomeBtn = document.querySelector('.calculate-income-btn');
  const resetIncomeBtn = document.querySelector('.reset-income-btn');
  const incomeDisplay = document.querySelector('.income-display');
  const realStateDisplay = document.querySelector('.real-state-display');

  let isFiltered = false;
  let isLostFiltered = false;
  let phoneUsageHours = 2.5;
  let isPanelCollapsed = true;
  let recalculateTimeout = null;
  let birthdayTimeout = null;

  floatingPanel.classList.add('collapsed');
  togglePanelBtn.textContent = '+';

  dateInput.addEventListener('change', () => {
    const birthdayString = dateInput.value;

    if (birthdayTimeout) {
      clearTimeout(birthdayTimeout);
    }

    if (!birthdayString) {
      clearLifeProgress();

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

      const gridContainer = document.querySelector('.container');
      gridContainer.innerHTML = '';
      renderWeeksGrid(birthDate);

      paintLifeProgress(birthdayString, phoneUsageHours);
    }, 1000);
  });

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
      allWeeks.forEach((weekElement) => {
        weekElement.classList.remove('hidden-empty');
      });
    }

    isLostFiltered = !isLostFiltered;
    filterLostButton.textContent = isLostFiltered
      ? 'Show All Days'
      : 'Hide Lost Days';
  });

  phoneUsageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const hoursToAdd = parseFloat(button.dataset.hours);
      const newValue = phoneUsageHours + hoursToAdd;
      const maxHoursPerDay = 13.5;

      if (newValue < 0) {
        phoneUsageHours = 0;
      } else if (newValue > maxHoursPerDay) {
        phoneUsageHours = maxHoursPerDay;
      } else {
        phoneUsageHours = newValue;
      }

      phoneUsageDisplay.textContent = `${phoneUsageHours}h per day`;

      if (userBirthDate && dateInput.value) {
        if (recalculateTimeout) {
          clearTimeout(recalculateTimeout);
        }

        recalculateTimeout = setTimeout(() => {
          paintLifeProgress(dateInput.value, phoneUsageHours);
        }, 1000);
      }
    });
  });

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
}

initializeApp();
