import Complex, {
  cloneComplex,
  cloneSignal,
  principleRootOfUnity,
} from './Complex';
import InvalidArgumentError from './InvalidArgumentError';

/*
  DONE: Implement zero-padding function
  TODO: Implement interpolation-padding function
  DONE: Implement fft for flexible input sizes
*/

/**
 * Performs the complex-valued FFT. The size of the input signal must be a positive integer power of two (and therefore non-zero).
 * @param signal The input signal.
 * @param minSize The minimum size of the output signal.
 * @returns The output signal.
 * @throws {InvalidArgumentError} When the input signal is not a positive integer power of two
 */
export function pureFFT(signal: Complex[]): Complex[] {
  if (signal.length <= 1) {
    return signal;
  }

  if (!isPositivePowerOfTwo(signal.length)) {
    throw new InvalidArgumentError(
      'In fft(): Given signal has length that is not a power of two'
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

  const evenSignalFFT = pureFFT(evenSignal);
  const oddSignalFFT = pureFFT(oddSignal);

  const output: Complex[] = [];
  let currentRootOfUnity = new Complex(1, 0);

  // Calculate the values for positive frequencies
  for (let i = 0; i < evenSignalFFT.length; i++) {
    // Perform the following calculation, then push the result:
    // evenSignalFFT[i] + (currentRootOfUnity * oddSignalFFT[i])
    const product = currentRootOfUnity.mult(oddSignalFFT[i]);
    output.push(evenSignalFFT[i].add(product));

    currentRootOfUnity = currentRootOfUnity.mult(principleRoot);
  }

  // Calculate the values for negative frequencies
  for (let i = 0; i < evenSignalFFT.length; i++) {
    // Perform the following calculation, then push the result:
    // evenSignalFFT[i] + (currentRootOfUnity * oddSignalFFT[i])
    const product = currentRootOfUnity.mult(oddSignalFFT[i]);
    output.push(evenSignalFFT[i].add(product));

    currentRootOfUnity = currentRootOfUnity.mult(principleRoot);
  }

  return output;
}

/**
 * Performs the complex-valued FFT on an arbitrary input size. If the size of the input signal is not a power of two, this function creates a zero-padded clone of the given signal whose length is a power of two.
 * @param signal The signal to perform the FFT on.
 * @returns The FFT of the (possibly padded clone of the) signal.
 */
export default function fft(signal: Complex[]): Complex[] {
  const possiblyPaddedSignal = zeroPadSignal(signal);
  return pureFFT(possiblyPaddedSignal);
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
 * If the given signal isn't a power of two, then this function returns an expanded clone of the signal that is a power of two where the clone is padded with zeros. If the given signal is a power of two, this function just returns a clone of the original signal.
 * @param signal A signal to expand in the form of a Complex array.
 */
function zeroPadSignal(signal: Complex[]): Complex[] {
  const output = cloneSignal(signal);
  if (isPositivePowerOfTwo(signal.length)) {
    return output;
  }

  // Calculate the smallest power of two that's greater than the length of the signal
  let nextPowerOfTwo = 1;
  while (nextPowerOfTwo < signal.length) {
    nextPowerOfTwo *= 2;
  }

  // Pad the output with zeros
  for (let i = signal.length; i < nextPowerOfTwo; i++) {
    output.push(new Complex(0, 0));
  }

  return output;
}
