/**
 * Sleep
 * @param {Number} duration timeout, ms
 */
export async function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Get random integer in specific range
 * @param {Number} min min
 * @param {Number} max max
 */
export function getRandomInt(min, max) {
  if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }

  if (typeof min !== 'number') throw TypeError('Argument \'min\' expected to be a Number.');
  if (typeof max !== 'number') throw TypeError('Argument \'max\' expected to be a Number.');

  return Math.floor(min + Math.random() * (max - min + 1));
}
