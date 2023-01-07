import { complex as Complex } from 'ts-complex-numbers';
import InvalidArgumentError from './InvalidArgumentError';

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

/**
 * Calculates the principle Nth root of unity for a given positive integer n.
 * @param n The degree of the root of unity to calculate.
 * @returns The principle Nth root of unity.
 * @throws {InvalidArgumentError} If the given argument is not a positive integer.
 */
export function principleRootOfUnity(n: number): Complex {
  if (n <= 0) {
    throw new InvalidArgumentError('Given argument is not a positive integer');
  }

  if (n - Math.floor(n) !== 0) {
    throw new InvalidArgumentError('Given argument is not a positive integer');
  }

  const i = new Complex(0, 1);
  const pi = new Complex(Math.PI, 0);

  // Perform the following complex exponential:
  // e^( (2 * PI * i) / n )
  const arg = pi.mult(i.mult(new Complex(2.0 / n, 0)));
  return arg.exp();
}
