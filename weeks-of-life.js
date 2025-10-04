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

//? Utility functions

function getWeeksFromYears(year) {
  return Math.round(year * 52.1429);
}

function getDaysFromMiliseconds(miliseconds) {
  return Math.ceil(miliseconds * 1.15738e-8);
}

function getDayName(index) {
  return NAME_DAYS_WEEK[index];
}

function getYearsFromWeeks(weeks) {
  return Math.ceil(weeks * (1 / 52.1429)); //* 1.1 || 1.2 || 1.09 mean the user is on the 2 year of his life.
}

//* Logical functions

function renderDays(week) {
  for (let i = 0; i < NUMBER_DAYS_WEEK; i++) {
    const day = document.createElement('div');

    day.classList.add('day');
    day.id = i;

    week.appendChild(day);
  }
}

function renderWeeks() {
  const container = document.querySelector('.container');

  const totalWeeks = getWeeksFromYears(YEARS_LIFE_EXPECTANCY);

  for (let i = 0; i < totalWeeks; i++) {
    const week = document.createElement('div');

    week.classList.add('week');
    week.id = i;

    week.addEventListener('click', () => {
      const modal = week.lastChild;

      modal.classList.add('show-modal');

      window.onclick = function (event) {
        if (event.target === modal) {
          modal.classList.remove('show-modal');
        }
      };
    });

    renderDays(week);
    container.appendChild(week);
  }
}

function renderTooltip(weekId, dayId, date) {
  const formatedDate = date.toDateString();
  const dayName = getDayName(dayId);
  const weekNumber = Number(weekId) + 1;

  const tooltip = document.createElement('div');

  tooltip.innerHTML = `
    <span>${`Week ${weekNumber}`}</span>
    <span>${dayName}</span>
    <span>${formatedDate}</span>
  `;

  tooltip.classList.add('tooltip');

  return tooltip;
}

function renderModal(weekId) {
  const weekNumber = Number(weekId) + 1;
  const yearOfLife = getYearsFromWeeks(weekNumber);

  const modal = document.createElement('div');
  const modalContent = document.createElement('div');

  modalContent.innerHTML = `
    <span>${`Week: ${weekNumber}`}</span>
    <span>${`Year of life: ${yearOfLife}`}</span>
  `;

  modalContent.classList.add('modal-content');
  modal.classList.add('modal');
  modal.id = weekId;

  modal.appendChild(modalContent);

  return modal;
}

function setDaysLived(date) {
  const timeNow = new Date();
  const timeBirthday = new Date(date + 'T00:00:00');

  const days = document.querySelectorAll('.day');

  let daysLived = getDaysFromMiliseconds(
    timeNow.getTime() - timeBirthday.getTime(),
  );

  let paintCondition = timeBirthday.getDay(); //? If paintCondition equals 0, the day sunday on week 1 is painted. 0-6 => sunday-saturday
  let week;

  timeBirthday.setDate(timeBirthday.getDate() + timeBirthday.getDay() * -1);

  days.forEach((day, index) => {
    //* Append Modal into each week item.
    if (!week || week.id !== day.parentElement.id) {
      week = day.parentElement;

      const modal = renderModal(week.id);
      week.appendChild(modal);
    }

    //* Append tooltip into each day item.
    const tooltip = renderTooltip(week.id, day.id, timeBirthday);
    day.appendChild(tooltip);

    //* Paint days.
    if (paintCondition <= 0 && daysLived) {
      day.classList.add('lived');
      daysLived--;
    }

    paintCondition--;
    timeBirthday.setDate(timeBirthday.getDate() + 1);
  });
}

function reset() {
  const weeks = document.querySelectorAll('.week');

  if (weeks.item(0).lastChild.classList.value !== 'modal') return;

  weeks.forEach((week) => {
    week.removeChild(week.lastChild); //* Remove all modals.

    const days = week.childNodes;

    days.forEach((day) => {
      day.removeChild(day.lastChild); //* Remove all tooltips.

      day.classList.remove('lived'); //* Remove painted cells.
    });
  });
}

function initializate() {
  renderWeeks();

  const date = document.querySelector('.date');

  date.value = ''; //* Reset his value.

  date.addEventListener('change', (event) => {
    const { value } = event.target;

    if (value) {
      setDaysLived(value);
    } else {
      reset();
    }
  });
}

initializate();
