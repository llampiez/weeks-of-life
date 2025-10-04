const YEARS_LIFE_EXPECTANCY = 72.51; // * Source for Venezuela https://datosmacro.expansion.com/demografia/esperanza-vida/venezuela
const NUMBER_DAYS_WEEK = 7;
const NAME_DAYS_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getWeeksFromYears(year) {
  return Math.round(year * 52.1429);
}

function getDaysFromMiliseconds(miliseconds) {
  return Math.round(miliseconds * 1.15738e-8);
}

function getDayName(index) {
  return NAME_DAYS_WEEK[index];
}

function getYearsFromWeeks(weeks) {
  return Math.ceil(weeks * (1 / 52.1429)); //* 1.1 || 1.2 || 1.09 mean the user is on the 2 year of his life.
}

function renderDayBoxes(weekBox) {
  for (let i = 0; i < NUMBER_DAYS_WEEK; i++) {
    const dayBox = document.createElement('div');

    dayBox.classList.add('day-box');
    dayBox.id = i;

    weekBox.appendChild(dayBox);
  }
}

function renderWeekBoxes() {
  const boxesContainer = document.querySelector('.boxes-container');

  const weeksOfLife = getWeeksFromYears(YEARS_LIFE_EXPECTANCY);

  for (let i = 0; i < weeksOfLife; i++) {
    const weekBox = document.createElement('div');

    weekBox.classList.add('week-box');
    weekBox.id = i + 1;
    weekBox.addEventListener('click', (event) => {
      const modal = weekBox.lastChild;

      modal.style.display = 'block';

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
    });

    renderDayBoxes(weekBox);

    boxesContainer.appendChild(weekBox);
  }
}

function renderTooltip(weekNumber, dayName, formatedDate) {
  const tooltipContent = document.createElement('div');

  tooltipContent.innerHTML = `
    <p>${`Week ${weekNumber}`}</p>
    <p>${dayName}</p>
    <p>${formatedDate}</p>

  `;

  tooltipContent.classList.add('tooltip-text');
  return tooltipContent;
}

function renderModal(weekNumber, yearOfLife, isLived) {
  const modal = document.createElement('div');
  const modalContent = document.createElement('div');

  modalContent.innerHTML = `
    <p>${`Week: ${weekNumber}`}</p>
    <p>${`Year of life: ${yearOfLife}`}</p>
    <p>${`State: ${isLived ? 'Week lived' : 'Week yet to live'}`}</p>
  `;

  modalContent.classList.add('modal-content');
  modal.classList.add('modal');

  modal.id = weekNumber;

  modal.appendChild(modalContent);

  return modal;
}

function resetDaysLived() {
  const dayLivedBoxes = document.querySelectorAll('.day-lived');

  if (!dayLivedBoxes.length) return;

  dayLivedBoxes.forEach((dayLivedBox) => {
    dayLivedBox.classList.remove('day-lived');
  });
}

function setDaysLived(date) {
  const timeNow = new Date();
  const timeBirthday = new Date(date + 'T00:00:00');

  const dayBoxes = document.querySelectorAll('.day-box');

  const daysLived = getDaysFromMiliseconds(
    timeNow.getTime() - timeBirthday.getTime(),
  );
  for (let i = 0; i < daysLived; i++) {
    dayBoxes.item(i + timeBirthday.getDay()).classList.add('day-lived');
  }

  let weekBoxId;

  timeBirthday.setDate(timeBirthday.getDate() + timeBirthday.getDay() * -1);

  dayBoxes.forEach((dayBox) => {
    const dateOfDay = timeBirthday.toDateString();

    if (weekBoxId !== dayBox.parentElement.id) {
      weekBoxId = dayBox.parentElement.id;

      const weekBox = dayBox.parentElement;

      const modal = renderModal(
        weekBox.id,
        getYearsFromWeeks(weekBox.id),
        true,
      );
      weekBox.appendChild(modal);
    }

    const tooltip = renderTooltip(weekBoxId, getDayName(dayBox.id), dateOfDay);

    dayBox.appendChild(tooltip);

    timeBirthday.setDate(timeBirthday.getDate() + 1);
  });
}

function initializate() {
  const dateInput = document.querySelector('.date-input');

  dateInput.addEventListener('change', (event) => {
    const { value } = event.target;

    if (value) {
      setDaysLived(value);
    } else {
      resetDaysLived();
    }
  });

  renderWeekBoxes();
}

initializate();
