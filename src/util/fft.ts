import Complex from './Complex';
import InvalidArgumentError from './InvalidArgumentError';

/*
  TODO: Implement zero-padding function
  TODO: Implement interpolation-padding function
  TODO: Implement fft for flexible input sizes
*/

/**
 * Performs the complex-valued FFT. The size of the input signal must be a positive integer power of two (and therefore non-zero).
 * @param signal The input signal.
 * @param minSize The minimum size of the output signal.
 * @returns The output signal.
 * @throws {InvalidArgumentError} When the input signal is not a positive integer power of two
 */
function fft(signal: Complex[]): Complex[] {
  // Make all tests fail initially
  return [new Complex(1, 1), new Complex(2, 2)];
}

/**
 * Returns true if and only if the input number is a positive integer power of two (and non-zero)
 * @param num The number to be tested
 * @returns True if and only if the input number is a positive integer power of two (and non-zero)
 */
function isPositivePowerOfTwo(num: number): boolean {
  if (num === 1) {
    return true;
  } else if (num - Math.floor(num) !== 0) {
    // A non-integer can't be an integer power of two
    return false;
  } else {
    return isPositivePowerOfTwo(num / 2);
  }
}

export default fft;
