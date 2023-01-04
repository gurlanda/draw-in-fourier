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
  if (signal.length <= 1) {
    return signal;
  }

  if (!isPositivePowerOfTwo(signal.length)) {
    throw new InvalidArgumentError(
      'In fft(): Given signal has length that is not a (positive integer) power of two'
    );
  }

  const principleRoot = principleRootOfUnity(signal.length);

  // Extract the even-indexed and odd-indexed elements into their own signals
  const evenSignal: Complex[] = [];
  const oddSignal: Complex[] = [];
  for (let i = 0; i < signal.length; i++) {
    if (i % 2 === 0) {
      evenSignal.push(cloneComplex(signal[i]));
    } else {
      oddSignal.push(cloneComplex(signal[i]));
    }
  }

  const evenSignalFFT = fft(evenSignal);
  const oddSignalFFT = fft(oddSignal);

  const output: Complex[] = [];
  for (let i = 0; i < signal.length / 2; i++) {
    // Perform the following calculation, then push the result:
    // evenSignalFFT(i) + (principleRoot * oddSignalFFT(i))
    const product = principleRoot.mult(oddSignalFFT[i]);
    output.push(evenSignalFFT[i].add(product));
  }

  for (let i = 0; i < signal.length / 2; i++) {
    // Perform the following calculation, then push the result:
    // evenSignalFFT(i) - (principleRoot * oddSignalFFT(i))
    const product = principleRoot.mult(oddSignalFFT[i]);
    output.push(evenSignalFFT[i].sub(product));
  }

  return output;
}

function cloneComplex(num: Complex): Complex {
  return new Complex(num.real, num.img);
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

/**
 * Calculates the principle Nth root of unity for a given positive integer n.
 * @param n The degree of the root of unity to calculate.
 * @returns The principle Nth root of unity.
 * @throws {InvalidArgumentError} If the given argument is not a positive integer.
 */
function principleRootOfUnity(n: number): Complex {
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

export default fft;
