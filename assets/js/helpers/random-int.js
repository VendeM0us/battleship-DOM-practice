export const randomInt = (min, max) => {
  min = Math.floor(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};