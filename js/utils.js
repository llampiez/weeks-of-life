import { LIFE_EXPECTANCY_YEARS, WEEKDAY_NAMES } from './constants.js';

export function convertYearsToWeeks(years) {
  return Math.ceil(years * 52.1429);
}

export function getWeekdayName(dayIndex) {
  return WEEKDAY_NAMES[dayIndex];
}

export function calculateAge(birthDate, currentDate = new Date()) {
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

export function calculateParentDeathDate(parentData) {
  if (!parentData.birthDate) return null;

  const birthDate = new Date(parentData.birthDate + 'T00:00:00');
  const estimatedDeathDate = new Date(birthDate);
  estimatedDeathDate.setFullYear(
    birthDate.getFullYear() + LIFE_EXPECTANCY_YEARS,
  );

  return estimatedDeathDate.toDateString();
}
