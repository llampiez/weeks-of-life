const LIFE_EXPECTANCY_YEARS = 72.51;
const DAYS_PER_WEEK = 7;
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

function convertMillisecondsToDays(milliseconds) {
  return Math.ceil(milliseconds * 1.15738e-8);
}

function getWeekdayName(dayIndex) {
  return WEEKDAY_NAMES[dayIndex];
}

function convertWeeksToYears(weeks) {
  return Math.ceil(weeks * (1 / 52.1429));
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
  for (let dayIndex = 0; dayIndex < DAYS_PER_WEEK; dayIndex++) {
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

function renderWeeksGrid() {
  const gridContainer = document.querySelector('.container');
  const totalWeeks = convertYearsToWeeks(LIFE_EXPECTANCY_YEARS);
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

function paintLifeProgress(birthdayString) {
  const currentDate = new Date();
  const birthDateTime = new Date(birthdayString + 'T00:00:00');

  const birthdayDay = birthDateTime.getDate();
  const birthdayMonth = birthDateTime.getMonth();

  userBirthDate = new Date(birthDateTime);

  const allDayElements = document.querySelectorAll('.day');

  allDayElements.forEach((dayElement) => {
    dayElement.className = 'day';
  });

  let totalDaysLived = convertMillisecondsToDays(
    currentDate.getTime() - birthDateTime.getTime(),
  );

  let daysUntilMonday = birthDateTime.getDay() - 1;

  birthDateTime.setDate(
    birthDateTime.getDate() -
      (birthDateTime.getDay() - 1 >= 0 ? birthDateTime.getDay() - 1 : 6),
  );

  const livedDayElements = [];
  const birthdayDayElements = [];
  const lostDayElements = [];
  const notLivedDayElements = [];

  allDayElements.forEach((dayElement) => {
    dayElement.dataset.date = birthDateTime.toDateString();

    const dayOfWeek = dayElement.id;
    const isWeekend =
      dayOfWeek === '4' || dayOfWeek === '5' || dayOfWeek === '6';
    const isBirthday =
      birthdayDay === birthDateTime.getDate() &&
      birthdayMonth === birthDateTime.getMonth();

    if (isBirthday) {
      birthdayDayElements.push(dayElement);
    }

    if (daysUntilMonday > 0) {
      notLivedDayElements.push(dayElement);
    } else if (daysUntilMonday <= 0 && totalDaysLived) {
      livedDayElements.push(dayElement);
      totalDaysLived--;
    } else if (isWeekend && !isBirthday) {
      lostDayElements.push(dayElement);
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

  birthdayDayElements.forEach((dayElement) => {
    dayElement.className = 'day lived birthday';
  });

  const totalDays = allDayElements.length;
  const livedDays = livedDayElements.length;
  const lostDays = lostDayElements.length;
  const notLivedDays = notLivedDayElements.length;
  const remainingDays = totalDays - livedDays - lostDays - notLivedDays;

  const remainingDaysElement = document.querySelector('.remaining-days');
  remainingDaysElement.textContent = `Remaining days of life: ${remainingDays} days`;
}

function clearLifeProgress() {
  userBirthDate = null;

  const allWeekElements = document.querySelectorAll('.week');

  allWeekElements.forEach((weekElement) => {
    const modalElement = weekElement.querySelector('.modal');
    if (modalElement) {
      weekElement.removeChild(modalElement);
    }

    const dayElements = weekElement.childNodes;

    dayElements.forEach((dayElement) => {
      const tooltipElement = dayElement.querySelector('.tooltip');
      if (tooltipElement) {
        dayElement.removeChild(tooltipElement);
      }
      dayElement.className = 'day';
      delete dayElement.dataset.date;
    });
  });

  const remainingDaysElement = document.querySelector('.remaining-days');
  remainingDaysElement.textContent = '';
}

function initializeApp() {
  renderWeeksGrid();

  const birthdayInput = document.querySelector('.date');

  birthdayInput.value = '';

  birthdayInput.addEventListener('change', (event) => {
    const { value } = event.target;

    if (value) {
      paintLifeProgress(value);
    } else {
      clearLifeProgress();
    }
  });
}

initializeApp();
