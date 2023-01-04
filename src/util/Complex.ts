import { complex as Complex } from 'ts-complex-numbers';

// Rename the external complex class.
// In this project, all class names are uppercased and we rename the class to follow this convention.
export default Complex;

/**
 * Creates a deep clone of the given complex number.
 * @param num The number to clone.
 * @returns A deep clone of the given number.
 */
export function cloneComplex(num: Complex): Complex {
  return new Complex(num.real, num.img);
}

/**
 * Create a deep clone of the given signal.
 * @param signal The signal to clone.
 * @returns A deep clone of the given signal.
 */
export function cloneSignal(signal: Complex[]): Complex[] {
  return signal.map((elem) => cloneComplex(elem));
}
