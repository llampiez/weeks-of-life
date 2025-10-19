import {
  fatherData,
  motherData,
  setFatherData,
  setMotherData,
} from './state.js';
import { calculateParentDeathDate } from './utils.js';

export function updateParentRemainingDays() {
  const today = new Date();
  const fatherDeathDateDisplay = document.querySelector(
    '.father-death-date-display',
  );
  const fatherRemainingDaysDisplay = document.querySelector(
    '.father-remaining-days',
  );
  const motherDeathDateDisplay = document.querySelector(
    '.mother-death-date-display',
  );
  const motherRemainingDaysDisplay = document.querySelector(
    '.mother-remaining-days',
  );

  if (fatherData.birthDate) {
    const fatherDeathDateString = calculateParentDeathDate(fatherData);
    if (fatherDeathDateString) {
      const fatherDeathDate = new Date(fatherDeathDateString);
      const daysRemaining = Math.floor(
        (fatherDeathDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      fatherDeathDateDisplay.textContent = `Est. death: ${fatherDeathDate.toLocaleDateString()}`;

      if (daysRemaining >= 0) {
        fatherRemainingDaysDisplay.textContent = `${daysRemaining} days remaining`;
      } else {
        fatherRemainingDaysDisplay.textContent = `Passed away ${Math.abs(
          daysRemaining,
        )} days ago`;
      }
    }
  } else {
    fatherDeathDateDisplay.textContent = '';
    fatherRemainingDaysDisplay.textContent = '';
  }

  if (motherData.birthDate) {
    const motherDeathDateString = calculateParentDeathDate(motherData);
    if (motherDeathDateString) {
      const motherDeathDate = new Date(motherDeathDateString);
      const daysRemaining = Math.floor(
        (motherDeathDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      motherDeathDateDisplay.textContent = `Est. death: ${motherDeathDate.toLocaleDateString()}`;

      if (daysRemaining >= 0) {
        motherRemainingDaysDisplay.textContent = `${daysRemaining} days remaining`;
      } else {
        motherRemainingDaysDisplay.textContent = `Passed away ${Math.abs(
          daysRemaining,
        )} days ago`;
      }
    }
  } else {
    motherDeathDateDisplay.textContent = '';
    motherRemainingDaysDisplay.textContent = '';
  }
}

export function clearParentInputs() {
  const fatherBirthdateInput = document.querySelector('.father-birthdate');
  const motherBirthdateInput = document.querySelector('.mother-birthdate');

  fatherBirthdateInput.value = '';
  motherBirthdateInput.value = '';
  setFatherData({ birthDate: null });
  setMotherData({ birthDate: null });
  updateParentRemainingDays();
}
