export let userBirthDate = null;
export let fatherData = { birthDate: null };
export let motherData = { birthDate: null };
export let badHabitsData = {
  drinksAlcohol: false,
  smokesCigarettes: false
};
export let workData = {
  daysPerWeek: 5,
  hoursPerDay: 8,
  monthlySalary: null
};
export let usualStuffData = {
  extraMinutes: 0
};
export let girlfriendData = {
  isInShape: false
};
export let uselessHobbiesData = {
  uselessSport: { enabled: false, hours: 1 },
  uselessNetflix: { enabled: false, hours: 1 },
  uselessVideogame: { enabled: false, hours: 1 }
};
export let constructiveActivitiesData = {
  hoursPerDay: 0
};

export function setUserBirthDate(date) {
  userBirthDate = date;
}

export function setFatherData(data) {
  fatherData = data;
}

export function setMotherData(data) {
  motherData = data;
}

export function setBadHabitsData(data) {
  badHabitsData = data;
}

export function setWorkData(data) {
  workData = { ...workData, ...data };
}

export function setUsualStuffData(data) {
  usualStuffData = { ...usualStuffData, ...data };
}

export function setGirlfriendData(data) {
  girlfriendData = { ...girlfriendData, ...data };
}

export function setUselessHobbiesData(data) {
  uselessHobbiesData = { ...uselessHobbiesData, ...data };
}

export function setConstructiveActivitiesData(data) {
  constructiveActivitiesData = { ...constructiveActivitiesData, ...data };
}
