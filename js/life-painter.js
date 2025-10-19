import { LIFE_EXPECTANCY_YEARS, ALCOHOL_YEARS_LOST, CIGARETTES_YEARS_LOST } from './constants.js';
import { setUserBirthDate, fatherData, motherData, badHabitsData, workData, usualStuffData, girlfriendData, uselessHobbiesData, constructiveActivitiesData, setUselessHobbiesData } from './state.js';
import { calculateAge, calculateParentDeathDate } from './utils.js';

export function paintLifeProgress(birthdayString, socialMediaHoursPerDay, gymHours = 1, phoneDaysPerWeek = 7) {
  const currentDate = new Date();
  const birthDateTime = new Date(birthdayString + 'T00:00:00');
  const originalBirthDate = new Date(birthdayString + 'T00:00:00');

  setUserBirthDate(new Date(birthDateTime));

  // Calculate years lost due to bad habits
  let yearsLost = 0;
  if (badHabitsData.drinksAlcohol) {
    yearsLost += ALCOHOL_YEARS_LOST;
  }
  if (badHabitsData.smokesCigarettes) {
    yearsLost += CIGARETTES_YEARS_LOST;
  }

  // Apply 50% reduction if user exercises 3 hours per week
  if (gymHours === 3 && yearsLost > 0) {
    yearsLost = yearsLost / 2;
  }

  // Keep death date fixed at LIFE_EXPECTANCY_YEARS regardless of bad habits
  const deathDate = new Date(birthDateTime);
  deathDate.setFullYear(deathDate.getFullYear() + LIFE_EXPECTANCY_YEARS);
  const deathDateString = deathDate.toDateString();

  const age = calculateAge(birthDateTime, currentDate);
  const gridContainer = document.querySelector('.container');

  let existingBar = document.querySelector('.childhood-bar');
  if (existingBar) {
    existingBar.remove();
  }

  if (age >= 19) {
    const childhoodBar = document.createElement('div');
    childhoodBar.className = 'childhood-bar';
    childhoodBar.textContent = 'CHILDHOOD (0-18)';
    gridContainer.insertBefore(childhoodBar, gridContainer.firstChild);
  }

  const allDayElements = document.querySelectorAll('.day');
  const allWeeks = document.querySelectorAll('.week');

  allDayElements.forEach((dayElement) => {
    dayElement.className = 'day';
    dayElement.textContent = '';
    dayElement.style.background = '';
    dayElement.style.border = '';
    delete dayElement.dataset.whitePercentage;
  });

  allWeeks.forEach((weekElement) => {
    weekElement.classList.remove('childhood-hidden');
  });

  let totalDaysLived = Math.floor(
    (currentDate.getTime() - birthDateTime.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (age >= 19) {
    const targetDate = new Date(originalBirthDate);
    targetDate.setFullYear(originalBirthDate.getFullYear() + 19);

    let weekCounter = 0;
    const tempDate = new Date(originalBirthDate);
    tempDate.setDate(
      tempDate.getDate() -
        (tempDate.getDay() - 1 >= 0 ? tempDate.getDay() - 1 : 6),
    );

    while (weekCounter < allWeeks.length) {
      const weekEndDate = new Date(tempDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      if (tempDate <= targetDate && targetDate <= weekEndDate) {
        break;
      }

      allWeeks[weekCounter].classList.add('childhood-hidden');
      weekCounter++;
      tempDate.setDate(tempDate.getDate() + 7);
    }

    const date19thBirthday = new Date(originalBirthDate);
    date19thBirthday.setFullYear(originalBirthDate.getFullYear() + 19);
    date19thBirthday.setDate(
      date19thBirthday.getDate() -
        (date19thBirthday.getDay() - 1 >= 0
          ? date19thBirthday.getDay() - 1
          : 6),
    );

    totalDaysLived = Math.floor(
      (currentDate.getTime() - date19thBirthday.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }

  let daysUntilMonday = birthDateTime.getDay() - 1;

  birthDateTime.setDate(
    birthDateTime.getDate() -
      (birthDateTime.getDay() - 1 >= 0 ? birthDateTime.getDay() - 1 : 6),
  );

  // Calculate parent death dates BEFORE classifying days
  const fatherDeathDateString = calculateParentDeathDate(fatherData);
  const motherDeathDateString = calculateParentDeathDate(motherData);

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

    const isChildhoodWeek =
      dayElement.parentElement.classList.contains('childhood-hidden');
    const dayDate = dayElement.dataset.date;

    if (daysUntilMonday > 0) {
      notLivedDayElements.push(dayElement);
    } else if (daysUntilMonday <= 0 && totalDaysLived > 0) {
      livedDayElements.push(dayElement);
      if (!isChildhoodWeek) {
        totalDaysLived--;
      }
    } else if (isWeekend) {
      lostDayElements.push(dayElement);
    } else if (
      dayElement !== lastDayElement &&
      dayDate !== fatherDeathDateString &&
      dayDate !== motherDeathDateString
    ) {
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

  const socialMediaHoursPerWeek = socialMediaHoursPerDay * phoneDaysPerWeek;
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

  // Paint work hours dynamically based on workData
  const workHoursPerWeek = workData.hoursPerDay * workData.daysPerWeek;

  // Distribute work hours starting from Thursday backwards (Thu -> Wed -> Tue -> Mon)
  // Thursday: Start here because phone usage is already painted here
  // Allocate remaining hours to previous days

  let remainingWorkHours = workHoursPerWeek;
  const workDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Mon, Tue, Wed, Thu

  // Calculate phone hours on Thursday correctly based on the phone painting logic
  const requiredFullDaysForThursday = 1;
  let phoneHoursOnThursday = 0;

  if (fullDays >= requiredFullDaysForThursday) {
    phoneHoursOnThursday = 24; // Full day of phone on Thursday
  } else if (fullDays === requiredFullDaysForThursday - 1 && partialDayPercentage > 0) {
    phoneHoursOnThursday = (partialDayPercentage / 100) * 24;
  }

  // Start from Thursday and work backwards
  // Thursday: first allocate work hours (phone usage takes priority visually)
  const availableHoursOnThursday = 24 - phoneHoursOnThursday;

  if (remainingWorkHours > 0 && availableHoursOnThursday > 0) {
    const workOnThursday = Math.min(remainingWorkHours, availableHoursOnThursday);
    workDistribution[3] = workOnThursday;
    remainingWorkHours -= workOnThursday;
  }

  // Wednesday: full day available (24 hours)
  if (remainingWorkHours > 0) {
    const workOnWednesday = Math.min(remainingWorkHours, 24);
    workDistribution[2] = workOnWednesday;
    remainingWorkHours -= workOnWednesday;
  }

  // Tuesday: remaining hours
  if (remainingWorkHours > 0) {
    const workOnTuesday = Math.min(remainingWorkHours, 24);
    workDistribution[1] = workOnTuesday;
    remainingWorkHours -= workOnTuesday;
  }

  // Monday: any remaining hours (should rarely happen with typical work schedules)
  if (remainingWorkHours > 0) {
    const workOnMonday = Math.min(remainingWorkHours, 24);
    workDistribution[0] = workOnMonday;
    remainingWorkHours -= workOnMonday;
  }

  // Apply work colors to days
  futureDayElements.forEach((dayElement) => {
    const dayOfWeek = parseInt(dayElement.id);
    const workHours = workDistribution[dayOfWeek];

    if (workHours > 0) {
      const workPercentage = (workHours / 24) * 100;

      if (workPercentage >= 99.9) {
        // Full work day
        dayElement.className = 'day day-work-full';
      } else {
        // Partial work day
        const isThursday = dayOfWeek === 3;

        if (isThursday && phoneHoursOnThursday > 0) {
          // Thursday has both phone and work - ORDER: phone (rosa) first, then work (azul)
          dayElement.className = 'day day-work-partial';
          const phonePercentage = (phoneHoursOnThursday / 24) * 100;
          const totalUsed = phonePercentage + workPercentage;
          dayElement.style.background = `linear-gradient(to right, #FF69B4 ${phonePercentage}%, #3498db ${phonePercentage}% ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 0;
        } else {
          // Other days: only work
          dayElement.className = 'day day-work-partial';
          dayElement.style.background = `linear-gradient(to right, #3498db ${workPercentage}%, white ${workPercentage}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - workPercentage;
        }
      }
    }
  });

  // Paint usual stuff hours dynamically based on usualStuffData
  // 1 hour per day (7 days) = 7 hours per week + extra minutes
  const baseUsualStuffMinutesPerDay = 60; // 1 hour
  const totalMinutesPerDay = baseUsualStuffMinutesPerDay + (usualStuffData.extraMinutes / 7);
  const usualStuffHoursPerWeek = (totalMinutesPerDay * 7) / 60;

  // Distribute usual stuff hours starting from Tuesday backwards (Tue -> Mon)
  // Priority: phone usage > work > usual stuff
  let remainingUsualStuffHours = usualStuffHoursPerWeek;
  const usualStuffDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Mon, Tue, Wed, Thu

  // Calculate available hours on each day after phone and work
  const availableHoursPerDay = {
    0: 24, // Monday
    1: 24, // Tuesday
    2: 24, // Wednesday
    3: 24 - phoneHoursOnThursday // Thursday
  };

  // Subtract work hours
  availableHoursPerDay[0] -= workDistribution[0];
  availableHoursPerDay[1] -= workDistribution[1];
  availableHoursPerDay[2] -= workDistribution[2];
  availableHoursPerDay[3] -= workDistribution[3];

  // Start from Tuesday and work backwards
  // Tuesday: first allocate usual stuff hours
  if (remainingUsualStuffHours > 0 && availableHoursPerDay[1] > 0) {
    const usualStuffOnTuesday = Math.min(remainingUsualStuffHours, availableHoursPerDay[1]);
    usualStuffDistribution[1] = usualStuffOnTuesday;
    remainingUsualStuffHours -= usualStuffOnTuesday;
  }

  // Monday: remaining hours
  if (remainingUsualStuffHours > 0 && availableHoursPerDay[0] > 0) {
    const usualStuffOnMonday = Math.min(remainingUsualStuffHours, availableHoursPerDay[0]);
    usualStuffDistribution[0] = usualStuffOnMonday;
    remainingUsualStuffHours -= usualStuffOnMonday;
  }

  // Wednesday: if still has remaining hours
  if (remainingUsualStuffHours > 0 && availableHoursPerDay[2] > 0) {
    const usualStuffOnWednesday = Math.min(remainingUsualStuffHours, availableHoursPerDay[2]);
    usualStuffDistribution[2] = usualStuffOnWednesday;
    remainingUsualStuffHours -= usualStuffOnWednesday;
  }

  // Thursday: if still has remaining hours
  if (remainingUsualStuffHours > 0 && availableHoursPerDay[3] > 0) {
    const usualStuffOnThursday = Math.min(remainingUsualStuffHours, availableHoursPerDay[3]);
    usualStuffDistribution[3] = usualStuffOnThursday;
    remainingUsualStuffHours -= usualStuffOnThursday;
  }

  // Apply usual stuff colors to days
  futureDayElements.forEach((dayElement) => {
    const dayOfWeek = parseInt(dayElement.id);
    const usualStuffHours = usualStuffDistribution[dayOfWeek];

    if (usualStuffHours > 0) {
      const usualStuffPercentage = (usualStuffHours / 24) * 100;
      const workHours = workDistribution[dayOfWeek];
      const workPercentage = (workHours / 24) * 100;

      if (usualStuffPercentage >= 99.9) {
        // Full usual stuff day (rare case)
        dayElement.className = 'day day-usual-stuff-full';
      } else {
        // Partial usual stuff day
        const isThursday = dayOfWeek === 3;

        if (isThursday && phoneHoursOnThursday > 0 && workHours > 0) {
          // Thursday has phone + work + usual stuff - ORDER: phone → work → usual stuff
          dayElement.className = 'day day-usual-stuff-partial';
          const phonePercentage = (phoneHoursOnThursday / 24) * 100;
          const endWork = phonePercentage + workPercentage;
          const totalUsed = phonePercentage + workPercentage + usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #FF69B4 ${phonePercentage}%, #3498db ${phonePercentage}% ${endWork}%, #f39c12 ${endWork}% ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 0;
        } else if (workHours > 0) {
          // Has work + usual stuff
          dayElement.className = 'day day-usual-stuff-partial';
          const totalUsed = workPercentage + usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${workPercentage}%, #f39c12 ${workPercentage}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else {
          // Only usual stuff
          dayElement.className = 'day day-usual-stuff-partial';
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${usualStuffPercentage}%, white ${usualStuffPercentage}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - usualStuffPercentage;
        }
      }
    }
  });

  // Paint girlfriend hours dynamically based on girlfriendData
  // Calculate target date: today + (6 months if not in shape, 3 months if in shape)
  const girlfriendTargetDate = new Date(currentDate);
  const monthsToAdd = girlfriendData.isInShape ? 3 : 6;
  girlfriendTargetDate.setMonth(girlfriendTargetDate.getMonth() + monthsToAdd);
  girlfriendTargetDate.setHours(0, 0, 0, 0);
  const girlfriendTargetDateString = girlfriendTargetDate.toDateString();

  // Phase 1 (Searching): 7 hours/week
  // Phase 2 (Relationship): 10 hours/week
  const searchingHoursPerWeek = 7;
  const relationshipHoursPerWeek = 10;

  // Build a map of which days belong to which phase for distribution
  const girlfriendDistributionSearching = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Mon, Tue, Wed, Thu
  const girlfriendDistributionRelationship = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Mon, Tue, Wed, Thu

  // Calculate available hours per day after phone, work, and usual stuff
  const availableHoursForGirlfriend = {
    0: 24 - (workDistribution[0] + usualStuffDistribution[0]), // Monday
    1: 24 - (workDistribution[1] + usualStuffDistribution[1]), // Tuesday
    2: 24 - (workDistribution[2] + usualStuffDistribution[2]), // Wednesday
    3: 24 - (phoneHoursOnThursday + workDistribution[3] + usualStuffDistribution[3]) // Thursday
  };

  // Distribute searching phase hours (7h/week) - start from Thursday backwards (bottom to top)
  let remainingSearchingHours = searchingHoursPerWeek;

  // Thursday
  if (remainingSearchingHours > 0 && availableHoursForGirlfriend[3] > 0) {
    const girlfriendOnThursday = Math.min(remainingSearchingHours, availableHoursForGirlfriend[3]);
    girlfriendDistributionSearching[3] = girlfriendOnThursday;
    remainingSearchingHours -= girlfriendOnThursday;
  }

  // Wednesday
  if (remainingSearchingHours > 0 && availableHoursForGirlfriend[2] > 0) {
    const girlfriendOnWednesday = Math.min(remainingSearchingHours, availableHoursForGirlfriend[2]);
    girlfriendDistributionSearching[2] = girlfriendOnWednesday;
    remainingSearchingHours -= girlfriendOnWednesday;
  }

  // Tuesday
  if (remainingSearchingHours > 0 && availableHoursForGirlfriend[1] > 0) {
    const girlfriendOnTuesday = Math.min(remainingSearchingHours, availableHoursForGirlfriend[1]);
    girlfriendDistributionSearching[1] = girlfriendOnTuesday;
    remainingSearchingHours -= girlfriendOnTuesday;
  }

  // Monday
  if (remainingSearchingHours > 0 && availableHoursForGirlfriend[0] > 0) {
    const girlfriendOnMonday = Math.min(remainingSearchingHours, availableHoursForGirlfriend[0]);
    girlfriendDistributionSearching[0] = girlfriendOnMonday;
    remainingSearchingHours -= girlfriendOnMonday;
  }

  // Distribute relationship phase hours (10h/week) - start from Thursday backwards (bottom to top)
  let remainingRelationshipHours = relationshipHoursPerWeek;

  // Thursday
  if (remainingRelationshipHours > 0 && availableHoursForGirlfriend[3] > 0) {
    const girlfriendOnThursday = Math.min(remainingRelationshipHours, availableHoursForGirlfriend[3]);
    girlfriendDistributionRelationship[3] = girlfriendOnThursday;
    remainingRelationshipHours -= girlfriendOnThursday;
  }

  // Wednesday
  if (remainingRelationshipHours > 0 && availableHoursForGirlfriend[2] > 0) {
    const girlfriendOnWednesday = Math.min(remainingRelationshipHours, availableHoursForGirlfriend[2]);
    girlfriendDistributionRelationship[2] = girlfriendOnWednesday;
    remainingRelationshipHours -= girlfriendOnWednesday;
  }

  // Tuesday
  if (remainingRelationshipHours > 0 && availableHoursForGirlfriend[1] > 0) {
    const girlfriendOnTuesday = Math.min(remainingRelationshipHours, availableHoursForGirlfriend[1]);
    girlfriendDistributionRelationship[1] = girlfriendOnTuesday;
    remainingRelationshipHours -= girlfriendOnTuesday;
  }

  // Monday
  if (remainingRelationshipHours > 0 && availableHoursForGirlfriend[0] > 0) {
    const girlfriendOnMonday = Math.min(remainingRelationshipHours, availableHoursForGirlfriend[0]);
    girlfriendDistributionRelationship[0] = girlfriendOnMonday;
    remainingRelationshipHours -= girlfriendOnMonday;
  }

  // Apply girlfriend colors to days based on their phase and distribution
  futureDayElements.forEach((dayElement) => {
    const dayOfWeek = parseInt(dayElement.id);
    const dayDate = dayElement.dataset.date;
    const dayDateTime = new Date(dayDate);

    // Determine which phase this day belongs to
    const isSearchingPhase = dayDateTime < girlfriendTargetDate;
    const girlfriendDistribution = isSearchingPhase ? girlfriendDistributionSearching : girlfriendDistributionRelationship;
    const girlfriendHours = girlfriendDistribution[dayOfWeek];

    if (girlfriendHours > 0) {
      const girlfriendPercentage = (girlfriendHours / 24) * 100;
      const phoneHours = phoneHoursOnThursday && dayOfWeek === 3 ? phoneHoursOnThursday : 0;
      const workHours = workDistribution[dayOfWeek] || 0;
      const usualStuffHours = usualStuffDistribution[dayOfWeek] || 0;

      if (girlfriendPercentage >= 99.9) {
        // Full girlfriend day (rare)
        dayElement.className = isSearchingPhase ? 'day day-girlfriend-searching-full' : 'day day-girlfriend-relationship-full';
      } else {
        // Partial girlfriend day
        const workPercentage = (workHours / 24) * 100;
        const usualStuffPercentage = (usualStuffHours / 24) * 100;
        const totalUsed = workPercentage + usualStuffPercentage + girlfriendPercentage;
        const girlfriendColor = '#c0392b'; // Always use relationship color (dark red)

        const isThursday = dayOfWeek === 3;

        if (isThursday && phoneHours > 0 && workHours > 0 && usualStuffHours > 0) {
          // Thursday: phone + work + usual stuff + girlfriend - ORDER: phone → work → usual stuff → girlfriend
          dayElement.className = isSearchingPhase ? 'day day-girlfriend-searching-partial' : 'day day-girlfriend-relationship-partial';
          const phonePercentage = (phoneHours / 24) * 100;
          const endPhone = phonePercentage;
          const endWork = phonePercentage + workPercentage;
          const endUsualStuff = phonePercentage + workPercentage + usualStuffPercentage;
          const totalUsed = phonePercentage + workPercentage + usualStuffPercentage + girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, #FF69B4 ${endPhone}%, #3498db ${endPhone}% ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 0;
        } else if (workHours > 0 && usualStuffHours > 0) {
          // work + usual stuff + girlfriend
          dayElement.className = isSearchingPhase ? 'day day-girlfriend-searching-partial' : 'day day-girlfriend-relationship-partial';
          const startUsualStuff = workPercentage;
          const endUsualStuff = workPercentage + usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${workPercentage}%, #f39c12 ${startUsualStuff}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (usualStuffHours > 0) {
          // usual stuff + girlfriend
          dayElement.className = isSearchingPhase ? 'day day-girlfriend-searching-partial' : 'day day-girlfriend-relationship-partial';
          const endUsualStuff = usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${usualStuffPercentage}%, ${girlfriendColor} ${endUsualStuff}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (workHours > 0) {
          // work + girlfriend
          dayElement.className = isSearchingPhase ? 'day day-girlfriend-searching-partial' : 'day day-girlfriend-relationship-partial';
          dayElement.style.background = `linear-gradient(to right, #3498db ${workPercentage}%, ${girlfriendColor} ${workPercentage}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else {
          // Only girlfriend
          dayElement.className = isSearchingPhase ? 'day day-girlfriend-searching-partial' : 'day day-girlfriend-relationship-partial';
          dayElement.style.background = `linear-gradient(to right, ${girlfriendColor} ${girlfriendPercentage}%, white ${girlfriendPercentage}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - girlfriendPercentage;
        }
      }
    }
  });

  // Paint useless hobbies hours dynamically based on uselessHobbiesData
  // Calculate total hours from enabled hobbies
  let uselessHobbiesHoursPerWeek = 0;
  if (uselessHobbiesData.uselessSport.enabled) {
    uselessHobbiesHoursPerWeek += uselessHobbiesData.uselessSport.hours;
  }
  if (uselessHobbiesData.uselessNetflix.enabled) {
    uselessHobbiesHoursPerWeek += uselessHobbiesData.uselessNetflix.hours;
  }
  if (uselessHobbiesData.uselessVideogame.enabled) {
    uselessHobbiesHoursPerWeek += uselessHobbiesData.uselessVideogame.hours;
  }

  // Distribute useless hobbies hours starting from Thursday backwards (Thu -> Wed -> Tue -> Mon)
  // Priority: phone usage > work > usual stuff > girlfriend > useless hobbies
  let remainingUselessHobbiesHours = uselessHobbiesHoursPerWeek;
  const uselessHobbiesDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Mon, Tue, Wed, Thu

  // Determine which girlfriend distribution to use for calculations based on current phase
  // Use searching distribution if we're currently in searching phase, otherwise use relationship
  const isCurrentlySearching = currentDate < girlfriendTargetDate;
  const girlfriendDistributionForCalculation = isCurrentlySearching ? girlfriendDistributionSearching : girlfriendDistributionRelationship;

  // Calculate available hours per day after phone, work, usual stuff, and girlfriend
  const availableHoursForUselessHobbies = {
    0: 24 - (workDistribution[0] + usualStuffDistribution[0] + girlfriendDistributionForCalculation[0]), // Monday
    1: 24 - (workDistribution[1] + usualStuffDistribution[1] + girlfriendDistributionForCalculation[1]), // Tuesday
    2: 24 - (workDistribution[2] + usualStuffDistribution[2] + girlfriendDistributionForCalculation[2]), // Wednesday
    3: 24 - (phoneHoursOnThursday + workDistribution[3] + usualStuffDistribution[3] + girlfriendDistributionForCalculation[3]) // Thursday
  };

  // Distribute useless hobbies hours - start from Thursday backwards (bottom to top)
  // Thursday
  if (remainingUselessHobbiesHours > 0 && availableHoursForUselessHobbies[3] > 0) {
    const uselessHobbiesOnThursday = Math.min(remainingUselessHobbiesHours, availableHoursForUselessHobbies[3]);
    uselessHobbiesDistribution[3] = uselessHobbiesOnThursday;
    remainingUselessHobbiesHours -= uselessHobbiesOnThursday;
  }

  // Wednesday
  if (remainingUselessHobbiesHours > 0 && availableHoursForUselessHobbies[2] > 0) {
    const uselessHobbiesOnWednesday = Math.min(remainingUselessHobbiesHours, availableHoursForUselessHobbies[2]);
    uselessHobbiesDistribution[2] = uselessHobbiesOnWednesday;
    remainingUselessHobbiesHours -= uselessHobbiesOnWednesday;
  }

  // Tuesday
  if (remainingUselessHobbiesHours > 0 && availableHoursForUselessHobbies[1] > 0) {
    const uselessHobbiesOnTuesday = Math.min(remainingUselessHobbiesHours, availableHoursForUselessHobbies[1]);
    uselessHobbiesDistribution[1] = uselessHobbiesOnTuesday;
    remainingUselessHobbiesHours -= uselessHobbiesOnTuesday;
  }

  // Monday
  if (remainingUselessHobbiesHours > 0 && availableHoursForUselessHobbies[0] > 0) {
    const uselessHobbiesOnMonday = Math.min(remainingUselessHobbiesHours, availableHoursForUselessHobbies[0]);
    uselessHobbiesDistribution[0] = uselessHobbiesOnMonday;
    remainingUselessHobbiesHours -= uselessHobbiesOnMonday;
  }

  // Apply useless hobbies colors to days
  futureDayElements.forEach((dayElement) => {
    const dayOfWeek = parseInt(dayElement.id);
    const dayDate = dayElement.dataset.date;
    const dayDateTime = new Date(dayDate);
    const uselessHobbiesHours = uselessHobbiesDistribution[dayOfWeek];

    if (uselessHobbiesHours > 0) {
      const uselessHobbiesPercentage = (uselessHobbiesHours / 24) * 100;
      const phoneHours = phoneHoursOnThursday && dayOfWeek === 3 ? phoneHoursOnThursday : 0;
      const workHours = workDistribution[dayOfWeek] || 0;
      const usualStuffHours = usualStuffDistribution[dayOfWeek] || 0;

      // Determine girlfriend hours for this specific day
      const isSearchingPhase = dayDateTime < girlfriendTargetDate;
      const girlfriendDistribution = isSearchingPhase ? girlfriendDistributionSearching : girlfriendDistributionRelationship;
      const girlfriendHours = girlfriendDistribution[dayOfWeek] || 0;

      if (uselessHobbiesPercentage >= 99.9) {
        // Full useless hobbies day (rare)
        dayElement.className = 'day day-useless-hobbies-full';
      } else {
        // Partial useless hobbies day
        const workPercentage = (workHours / 24) * 100;
        const usualStuffPercentage = (usualStuffHours / 24) * 100;
        const girlfriendPercentage = (girlfriendHours / 24) * 100;
        const uselessHobbiesColor = '#8e44ad'; // Purple color
        const girlfriendColor = '#c0392b'; // Dark red

        const isThursday = dayOfWeek === 3;

        // Calculate total used hours excluding white space
        const totalUsed = (phoneHours ? (phoneHours / 24) * 100 : 0) + workPercentage + usualStuffPercentage + girlfriendPercentage + uselessHobbiesPercentage;

        if (isThursday && phoneHours > 0 && workHours > 0 && usualStuffHours > 0 && girlfriendHours > 0) {
          // Thursday: phone + work + usual stuff + girlfriend + useless hobbies - ORDER: phone → work → usual stuff → girlfriend → useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const phonePercentage = (phoneHours / 24) * 100;
          const endPhone = phonePercentage;
          const endWork = phonePercentage + workPercentage;
          const endUsualStuff = phonePercentage + workPercentage + usualStuffPercentage;
          const endGirlfriend = phonePercentage + workPercentage + usualStuffPercentage + girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, #FF69B4 ${endPhone}%, #3498db ${endPhone}% ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 0;
        } else if (workHours > 0 && usualStuffHours > 0 && girlfriendHours > 0) {
          // work + usual stuff + girlfriend + useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const endWork = workPercentage;
          const endUsualStuff = workPercentage + usualStuffPercentage;
          const endGirlfriend = workPercentage + usualStuffPercentage + girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (usualStuffHours > 0 && girlfriendHours > 0) {
          // usual stuff + girlfriend + useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const endUsualStuff = usualStuffPercentage;
          const endGirlfriend = usualStuffPercentage + girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (girlfriendHours > 0) {
          // girlfriend + useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const endGirlfriend = girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, ${girlfriendColor} ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (workHours > 0 && usualStuffHours > 0) {
          // work + usual stuff + useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const endWork = workPercentage;
          const endUsualStuff = workPercentage + usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${uselessHobbiesColor} ${endUsualStuff}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (usualStuffHours > 0) {
          // usual stuff + useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const endUsualStuff = usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${endUsualStuff}%, ${uselessHobbiesColor} ${endUsualStuff}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (workHours > 0) {
          // work + useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          const endWork = workPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, ${uselessHobbiesColor} ${endWork}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else {
          // Only useless hobbies
          dayElement.className = 'day day-useless-hobbies-partial';
          dayElement.style.background = `linear-gradient(to right, ${uselessHobbiesColor} ${uselessHobbiesPercentage}%, white ${uselessHobbiesPercentage}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - uselessHobbiesPercentage;
        }
      }
    }
  });

  // Paint constructive activities hours dynamically based on constructiveActivitiesData
  // Calculate total hours from hoursPerDay
  const constructiveHoursPerWeek = constructiveActivitiesData.hoursPerDay * 7;

  // Calculate target completion date for 1000 hours
  let constructiveTargetDate = null;
  if (constructiveActivitiesData.hoursPerDay > 0) {
    const totalHoursNeeded = 1000;
    const weeksNeeded = totalHoursNeeded / constructiveHoursPerWeek;
    constructiveTargetDate = new Date(currentDate);
    constructiveTargetDate.setDate(constructiveTargetDate.getDate() + Math.ceil(weeksNeeded * 7));
    constructiveTargetDate.setHours(0, 0, 0, 0);
  }

  // Distribute constructive hours starting from Thursday backwards (Thu -> Wed -> Tue -> Mon)
  // Priority: phone usage > work > usual stuff > girlfriend > useless hobbies > constructive activities
  let remainingConstructiveHours = constructiveHoursPerWeek;
  const constructiveDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Mon, Tue, Wed, Thu

  // Calculate available hours per day after phone, work, usual stuff, girlfriend, and useless hobbies
  // Use the same girlfriend distribution that was determined for useless hobbies calculation
  const availableHoursForConstructive = {
    0: 24 - (workDistribution[0] + usualStuffDistribution[0] + girlfriendDistributionForCalculation[0] + uselessHobbiesDistribution[0]), // Monday
    1: 24 - (workDistribution[1] + usualStuffDistribution[1] + girlfriendDistributionForCalculation[1] + uselessHobbiesDistribution[1]), // Tuesday
    2: 24 - (workDistribution[2] + usualStuffDistribution[2] + girlfriendDistributionForCalculation[2] + uselessHobbiesDistribution[2]), // Wednesday
    3: 24 - (phoneHoursOnThursday + workDistribution[3] + usualStuffDistribution[3] + girlfriendDistributionForCalculation[3] + uselessHobbiesDistribution[3]) // Thursday
  };

  // Distribute constructive hours - start from Thursday backwards (bottom to top)
  // Thursday
  if (remainingConstructiveHours > 0 && availableHoursForConstructive[3] > 0) {
    const constructiveOnThursday = Math.min(remainingConstructiveHours, availableHoursForConstructive[3]);
    constructiveDistribution[3] = constructiveOnThursday;
    remainingConstructiveHours -= constructiveOnThursday;
  }

  // Wednesday
  if (remainingConstructiveHours > 0 && availableHoursForConstructive[2] > 0) {
    const constructiveOnWednesday = Math.min(remainingConstructiveHours, availableHoursForConstructive[2]);
    constructiveDistribution[2] = constructiveOnWednesday;
    remainingConstructiveHours -= constructiveOnWednesday;
  }

  // Tuesday
  if (remainingConstructiveHours > 0 && availableHoursForConstructive[1] > 0) {
    const constructiveOnTuesday = Math.min(remainingConstructiveHours, availableHoursForConstructive[1]);
    constructiveDistribution[1] = constructiveOnTuesday;
    remainingConstructiveHours -= constructiveOnTuesday;
  }

  // Monday
  if (remainingConstructiveHours > 0 && availableHoursForConstructive[0] > 0) {
    const constructiveOnMonday = Math.min(remainingConstructiveHours, availableHoursForConstructive[0]);
    constructiveDistribution[0] = constructiveOnMonday;
    remainingConstructiveHours -= constructiveOnMonday;
  }

  // Apply constructive activities colors to days
  futureDayElements.forEach((dayElement) => {
    const dayOfWeek = parseInt(dayElement.id);
    const dayDate = dayElement.dataset.date;
    const dayDateTime = new Date(dayDate);
    const constructiveHours = constructiveDistribution[dayOfWeek];

    // Only paint constructive activities if before completion date
    if (constructiveHours > 0 && (!constructiveTargetDate || dayDateTime < constructiveTargetDate)) {
      const constructivePercentage = (constructiveHours / 24) * 100;
      const phoneHours = phoneHoursOnThursday && dayOfWeek === 3 ? phoneHoursOnThursday : 0;
      const workHours = workDistribution[dayOfWeek] || 0;
      const usualStuffHours = usualStuffDistribution[dayOfWeek] || 0;

      // Determine girlfriend hours for this specific day
      const isSearchingPhase = dayDateTime < girlfriendTargetDate;
      const girlfriendDistribution = isSearchingPhase ? girlfriendDistributionSearching : girlfriendDistributionRelationship;
      const girlfriendHours = girlfriendDistribution[dayOfWeek] || 0;
      const uselessHobbiesHours = uselessHobbiesDistribution[dayOfWeek] || 0;

      if (constructivePercentage >= 99.9) {
        // Full constructive day (rare)
        dayElement.className = 'day day-constructive-full';
      } else {
        // Partial constructive day
        const workPercentage = (workHours / 24) * 100;
        const usualStuffPercentage = (usualStuffHours / 24) * 100;
        const girlfriendPercentage = (girlfriendHours / 24) * 100;
        const uselessHobbiesPercentage = (uselessHobbiesHours / 24) * 100;
        const constructiveColor = '#1abc9c'; // Turquesa/cian color
        const girlfriendColor = '#c0392b'; // Dark red
        const uselessHobbiesColor = '#8e44ad'; // Purple color

        const isThursday = dayOfWeek === 3;

        // Calculate total used hours excluding white space
        const totalUsed = (phoneHours ? (phoneHours / 24) * 100 : 0) + workPercentage + usualStuffPercentage + girlfriendPercentage + uselessHobbiesPercentage + constructivePercentage;

        if (isThursday && phoneHours > 0 && workHours > 0 && usualStuffHours > 0 && girlfriendHours > 0 && uselessHobbiesHours > 0) {
          // Thursday: phone + work + usual stuff + girlfriend + useless hobbies + constructive
          dayElement.className = 'day day-constructive-partial';
          const phonePercentage = (phoneHours / 24) * 100;
          const endPhone = phonePercentage;
          const endWork = phonePercentage + workPercentage;
          const endUsualStuff = phonePercentage + workPercentage + usualStuffPercentage;
          const endGirlfriend = phonePercentage + workPercentage + usualStuffPercentage + girlfriendPercentage;
          const endUselessHobbies = phonePercentage + workPercentage + usualStuffPercentage + girlfriendPercentage + uselessHobbiesPercentage;
          dayElement.style.background = `linear-gradient(to right, #FF69B4 ${endPhone}%, #3498db ${endPhone}% ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${endUselessHobbies}%, ${constructiveColor} ${endUselessHobbies}% ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 0;
        } else if (workHours > 0 && usualStuffHours > 0 && girlfriendHours > 0 && uselessHobbiesHours > 0) {
          // work + usual stuff + girlfriend + useless hobbies + constructive
          dayElement.className = 'day day-constructive-partial';
          const endWork = workPercentage;
          const endUsualStuff = workPercentage + usualStuffPercentage;
          const endGirlfriend = workPercentage + usualStuffPercentage + girlfriendPercentage;
          const endUselessHobbies = workPercentage + usualStuffPercentage + girlfriendPercentage + uselessHobbiesPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${endUselessHobbies}%, ${constructiveColor} ${endUselessHobbies}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (usualStuffHours > 0 && girlfriendHours > 0 && uselessHobbiesHours > 0) {
          // usual stuff + girlfriend + useless hobbies + constructive
          dayElement.className = 'day day-constructive-partial';
          const endUsualStuff = usualStuffPercentage;
          const endGirlfriend = usualStuffPercentage + girlfriendPercentage;
          const endUselessHobbies = usualStuffPercentage + girlfriendPercentage + uselessHobbiesPercentage;
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${endUselessHobbies}%, ${constructiveColor} ${endUselessHobbies}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (girlfriendHours > 0 && uselessHobbiesHours > 0) {
          // girlfriend + useless hobbies + constructive
          dayElement.className = 'day day-constructive-partial';
          const endGirlfriend = girlfriendPercentage;
          const endUselessHobbies = girlfriendPercentage + uselessHobbiesPercentage;
          dayElement.style.background = `linear-gradient(to right, ${girlfriendColor} ${endGirlfriend}%, ${uselessHobbiesColor} ${endGirlfriend}% ${endUselessHobbies}%, ${constructiveColor} ${endUselessHobbies}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (uselessHobbiesHours > 0) {
          // useless hobbies + constructive
          dayElement.className = 'day day-constructive-partial';
          const endUselessHobbies = uselessHobbiesPercentage;
          dayElement.style.background = `linear-gradient(to right, ${uselessHobbiesColor} ${endUselessHobbies}%, ${constructiveColor} ${endUselessHobbies}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (workHours > 0 && usualStuffHours > 0 && girlfriendHours > 0) {
          // work + usual stuff + girlfriend + constructive
          dayElement.className = 'day day-constructive-partial';
          const endWork = workPercentage;
          const endUsualStuff = workPercentage + usualStuffPercentage;
          const endGirlfriend = workPercentage + usualStuffPercentage + girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${constructiveColor} ${endGirlfriend}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (usualStuffHours > 0 && girlfriendHours > 0) {
          // usual stuff + girlfriend + constructive
          dayElement.className = 'day day-constructive-partial';
          const endUsualStuff = usualStuffPercentage;
          const endGirlfriend = usualStuffPercentage + girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${endUsualStuff}%, ${girlfriendColor} ${endUsualStuff}% ${endGirlfriend}%, ${constructiveColor} ${endGirlfriend}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (girlfriendHours > 0) {
          // girlfriend + constructive
          dayElement.className = 'day day-constructive-partial';
          const endGirlfriend = girlfriendPercentage;
          dayElement.style.background = `linear-gradient(to right, ${girlfriendColor} ${endGirlfriend}%, ${constructiveColor} ${endGirlfriend}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (workHours > 0 && usualStuffHours > 0) {
          // work + usual stuff + constructive
          dayElement.className = 'day day-constructive-partial';
          const endWork = workPercentage;
          const endUsualStuff = workPercentage + usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, #f39c12 ${endWork}% ${endUsualStuff}%, ${constructiveColor} ${endUsualStuff}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (usualStuffHours > 0) {
          // usual stuff + constructive
          dayElement.className = 'day day-constructive-partial';
          const endUsualStuff = usualStuffPercentage;
          dayElement.style.background = `linear-gradient(to right, #f39c12 ${endUsualStuff}%, ${constructiveColor} ${endUsualStuff}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else if (workHours > 0) {
          // work + constructive
          dayElement.className = 'day day-constructive-partial';
          const endWork = workPercentage;
          dayElement.style.background = `linear-gradient(to right, #3498db ${endWork}%, ${constructiveColor} ${endWork}% ${totalUsed}%, white ${totalUsed}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - totalUsed;
        } else {
          // Only constructive
          dayElement.className = 'day day-constructive-partial';
          dayElement.style.background = `linear-gradient(to right, ${constructiveColor} ${constructivePercentage}%, white ${constructivePercentage}%)`;
          dayElement.style.border = '1px solid gray';
          dayElement.dataset.whitePercentage = 100 - constructivePercentage;
        }
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

  // Calculate days per week for work, usual stuff, girlfriend, useless hobbies, and constructive activities
  const workDaysPerWeek = workHoursPerWeek / 24;
  const usualStuffDaysPerWeek = usualStuffHoursPerWeek / 24;
  const uselessHobbiesDaysPerWeek = uselessHobbiesHoursPerWeek / 24;
  const constructiveDaysPerWeek = constructiveHoursPerWeek / 24;

  // For girlfriend, calculate weighted average based on time in each phase
  const daysUntilGirlfriend = Math.floor((girlfriendTargetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysFromGirlfriendTowardDeath = Math.floor((dayBeforeDeath.getTime() - girlfriendTargetDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalDaysFromNow = daysUntilGirlfriend + daysFromGirlfriendTowardDeath;

  let girlfriendDaysPerWeek = 0;
  if (totalDaysFromNow > 0) {
    const searchingDaysPerWeek = searchingHoursPerWeek / 24;
    const relationshipDaysPerWeek = relationshipHoursPerWeek / 24;
    girlfriendDaysPerWeek = ((searchingDaysPerWeek * daysUntilGirlfriend) + (relationshipDaysPerWeek * daysFromGirlfriendTowardDeath)) / totalDaysFromNow;
  }

  let lostDaysInCurrentWeek = 0;
  for (let i = 0; i < daysInCurrentPartialWeek; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() + i);
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0)
      lostDaysInCurrentWeek += 1;
  }
  lostDaysInCurrentWeek += socialMediaDaysPerWeek + workDaysPerWeek + usualStuffDaysPerWeek + girlfriendDaysPerWeek + uselessHobbiesDaysPerWeek + constructiveDaysPerWeek;

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
    lostDaysInFinalWeek += socialMediaDaysPerWeek + workDaysPerWeek + usualStuffDaysPerWeek + girlfriendDaysPerWeek + uselessHobbiesDaysPerWeek + constructiveDaysPerWeek;
  }

  const usableDaysInCurrentWeek = Math.max(
    0,
    daysInCurrentPartialWeek - lostDaysInCurrentWeek,
  );
  const usableDaysInCompleteWeeks =
    completeWeeks * (7 - (3 + socialMediaDaysPerWeek + workDaysPerWeek + usualStuffDaysPerWeek + girlfriendDaysPerWeek + uselessHobbiesDaysPerWeek + constructiveDaysPerWeek));
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

  // Paint parent death days BEFORE today's border
  paintParentDeathDays();

  // Apply green border to today's element (MUST be at the very end)
  const todayString = currentDate.toDateString();
  allDayElements.forEach((dayElement) => {
    if (dayElement.dataset.date === todayString) {
      const isDeathDay =
        dayElement.classList.contains('parent-death-father') ||
        dayElement.classList.contains('parent-death-mother') ||
        (dayElement.classList.contains('last-day') &&
          dayElement.textContent === '⚰️');

      if (!isDeathDay) {
        dayElement.style.setProperty(
          'border',
          '2px solid #27ae60',
          'important',
        );
      }
    }
  });

  // Apply transparency to last weeks if bad habits are present
  applyBadHabitsTransparency(yearsLost, allDayElements);

  // Return years lost for display in the bad habits module
  return {
    yearsLost,
    adjustedDeathDate: deathDate,
    daysLost: Math.floor(yearsLost * 365.25)
  };
}

function applyBadHabitsTransparency(yearsLost, allDayElements) {
  // Remove transparency from all elements first
  allDayElements.forEach((dayElement) => {
    dayElement.classList.remove('reduced-life-expectancy');
  });

  if (yearsLost <= 0) return;

  // Calculate how many days to make transparent
  const daysToMakeTransparent = Math.floor(yearsLost * 365.25);

  // Find the last day element (death day)
  const lastDayElement = Array.from(allDayElements).find(
    (el) => el.classList.contains('last-day') && el.textContent === '⚰️'
  );

  if (!lastDayElement) return;

  // Find the index of the last day
  const lastDayIndex = Array.from(allDayElements).indexOf(lastDayElement);

  // Apply transparency to the days before death (including death day)
  let count = 0;
  for (let i = lastDayIndex; i >= 0 && count < daysToMakeTransparent; i--) {
    const dayElement = allDayElements[i];

    // Only apply to future days (not lived, not after death, not before birth)
    if (
      !dayElement.classList.contains('lived') &&
      !dayElement.classList.contains('after-death') &&
      !dayElement.classList.contains('not-lived') &&
      !dayElement.classList.contains('parent-death-father') &&
      !dayElement.classList.contains('parent-death-mother')
    ) {
      dayElement.classList.add('reduced-life-expectancy');
      count++;
    }
  }
}

export function paintParentDeathDays() {
  const allDayElements = document.querySelectorAll('.day');

  const fatherDeathDate = calculateParentDeathDate(fatherData);
  const motherDeathDate = calculateParentDeathDate(motherData);

  allDayElements.forEach((dayElement) => {
    const dayDate = dayElement.dataset.date;
    if (!dayDate) return;

    if (dayDate === fatherDeathDate) {
      // Remove ALL previous classes and styles
      dayElement.className = 'day last-day parent-death-father';
      dayElement.textContent = '☠️';
      dayElement.style.removeProperty('background');
      dayElement.style.setProperty('background-color', 'darkgray', 'important');
      dayElement.style.setProperty('border', '1px solid darkgray', 'important');
      dayElement.style.setProperty('font-size', '10px', 'important');
      dayElement.style.setProperty('display', 'flex', 'important');
      dayElement.style.setProperty('align-items', 'center', 'important');
      dayElement.style.setProperty('justify-content', 'center', 'important');
      delete dayElement.dataset.whitePercentage;
    }

    if (dayDate === motherDeathDate) {
      if (dayElement.classList.contains('parent-death-father')) {
        dayElement.textContent = '☠️💀';
        dayElement.classList.add('parent-death-mother');
      } else {
        // Remove ALL previous classes and styles
        dayElement.className = 'day last-day parent-death-mother';
        dayElement.textContent = '💀';
        dayElement.style.removeProperty('background');
        dayElement.style.setProperty(
          'background-color',
          'darkgray',
          'important',
        );
        dayElement.style.setProperty(
          'border',
          '1px solid darkgray',
          'important',
        );
        dayElement.style.setProperty('font-size', '8px', 'important');
        dayElement.style.setProperty('display', 'flex', 'important');
        dayElement.style.setProperty('align-items', 'center', 'important');
        dayElement.style.setProperty('justify-content', 'center', 'important');
        delete dayElement.dataset.whitePercentage;
      }
    }
  });
}

export function clearLifeProgress() {
  setUserBirthDate(null);

  // Reset useless hobbies state to default
  setUselessHobbiesData({
    uselessSport: { enabled: false, hours: 1 },
    uselessNetflix: { enabled: false, hours: 1 },
    uselessVideogame: { enabled: false, hours: 1 }
  });

  // Reset useless hobbies UI elements
  const uselessSportCheckbox = document.querySelector('.useless-sport-checkbox');
  const uselessNetflixCheckbox = document.querySelector('.useless-netflix-checkbox');
  const uselessVideogameCheckbox = document.querySelector('.useless-videogame-checkbox');
  const uselessSportHoursInput = document.querySelector('.useless-sport-hours');
  const uselessNetflixHoursInput = document.querySelector('.useless-netflix-hours');
  const uselessVideogameHoursInput = document.querySelector('.useless-videogame-hours');
  const uselessHobbiesDisplay = document.querySelector('.useless-hobbies-display');

  if (uselessSportCheckbox) uselessSportCheckbox.checked = false;
  if (uselessNetflixCheckbox) uselessNetflixCheckbox.checked = false;
  if (uselessVideogameCheckbox) uselessVideogameCheckbox.checked = false;
  if (uselessSportHoursInput) uselessSportHoursInput.value = '1';
  if (uselessNetflixHoursInput) uselessNetflixHoursInput.value = '1';
  if (uselessVideogameHoursInput) uselessVideogameHoursInput.value = '1';
  if (uselessHobbiesDisplay) uselessHobbiesDisplay.textContent = '0h per week';

  const existingBar = document.querySelector('.childhood-bar');
  if (existingBar) {
    existingBar.remove();
  }

  const allDayElements = document.querySelectorAll('.day');
  allDayElements.forEach((dayElement) => {
    dayElement.className = 'day';
    dayElement.textContent = '';
    dayElement.style.background = '';
    dayElement.style.border = '';
    delete dayElement.dataset.date;
    delete dayElement.dataset.whitePercentage;
  });

  const allWeeks = document.querySelectorAll('.week');
  allWeeks.forEach((weekElement) => {
    weekElement.classList.remove('childhood-hidden');
  });

  const remainingDaysElement = document.querySelector('.remaining-days');
  remainingDaysElement.textContent = '';
}
