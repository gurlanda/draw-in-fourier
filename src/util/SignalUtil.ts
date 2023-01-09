import Complex, { cloneComplex } from './Complex';

const acceptableError = 1e-8;

/**
 * Calculates the relative error between two numbers, where the larger input is used as the divisor. This is done so that the result doesn't depend on the order of the inputs.
 * @param num1 The first input.
 * @param num2 The second input.
 * @returns The relative error between the inputs.
 */
export function relativeError(num1: number, num2: number): number {
  const difference = num1 - num2;
  if (difference === 0) {
    return 0;
  }

  // The larger input is used as the divisor. This is done so that the result doesn't depend on the order of the inputs.
  // We don't want to divide by 0, however, so this function chooses the min if the max is zero.
  function safeMaxDivisor() {
    let max = Math.max(num1, num2);
    let min = Math.min(num1, num2);
    if (max !== 0) {
      return max;
    }

    if (min !== 0) {
      return min;
    }

    // Code shouldn't reach here. Execution reaches this point if and only if max and min (and therefore num1 and num2) are both zero.
    // But if both arguments are zero, then their difference is zero and relativeError() should have returned zero before reaching this point.
    else
      throw Error(
        'In relativeError() > safeMaxDivisor(): Code is running a theoretically unreachable point.'
      );
  }

  const relativeError = Math.abs(difference / safeMaxDivisor());
  return relativeError;
}

// I consider a number to be practically zero if its magnitude falls below the error threshold.
export function isPracticallyZero(num: number): boolean {
  if (Math.abs(num) <= acceptableError) {
    return true;
  } else {
    return false;
  }
}

/**
 * Determines whether or not two complex numbers are within an acceptable bound.
 * @param num1 The first argument.
 * @param num2 The second argument.
 * @returns True if and only if the relative error between the two numbers are within an acceptable bound.
 */
export function numsAreCloseEnough(num1: Complex, num2: Complex): boolean {
  // Two numbers are close enough if the relative error between them is acceptable or if they are both practically zero.
  function closeEnough(num1: number, num2: number): boolean {
    if (relativeError(num1, num2) <= acceptableError) {
      return true;
    }

    if (isPracticallyZero(num1) && isPracticallyZero(num2)) {
      return true;
    }

    return false;
  }

  if (closeEnough(num1.real, num2.real) && closeEnough(num1.img, num2.img)) {
    return true;
  }

  // console.dir({
  //   num1,
  //   num2,
  // });
  return false;
}

/**
 * Determines whether or not two signals are equal, barring some numerical error. This function compares two signals pointwise and returns false if either the signals are of different length or if there exists an index i such that the relative error between signal1[i] and signal2[i] is larger than the acceptable error.
 * @param signal1 The first signal to be compared.
 * @param signal2 The second signal to be compared.
 * @returns True if and only if the given signals are of the same length and are pointwise 'close enough'.
 */
export function signalsAreCloseEnough(
  signal1: Complex[],
  signal2: Complex[]
): boolean {
  if (signal1.length !== signal2.length) {
    return false;
  }

  if (signal1.length === 0 && signal2.length === 0) {
    return true;
  }

  // At this point, we know that the signals are the same length and that they're both non-empty
  for (let i = 0; i < signal1.length; i++) {
    if (!numsAreCloseEnough(signal1[i], signal2[i])) {
      return false;
    }
  }

  return true;
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
 * Calculates the pointwise sum of two complex-valued signals. If one signal is bigger than the other, the smaller one is treated as if it's padded with zeros.
 * @param signal1 The first signal.
 * @param signal2 The second signal.
 * @returns The pointwise sum of the given signals.
 */
export function pointwiseSum(
  signal1: Complex[],
  signal2: Complex[]
): Complex[] {
  // Create a new array filled with zeros. Its length is the length of the longest argument.
  // prettier-ignore
  const output = new Array<Complex>(
      Math.max(signal1.length, signal2.length)
    );

  for (let i = 0; i < output.length; i++) {
    // If signal1 is out of bounds, pretend there's a zero
    // prettier-ignore
    const signalOneElement =
      i < signal1.length 
      ? signal1[i] 
      : new Complex(0, 0);

    // prettier-ignore
    const signalTwoElement =
      i < signal2.length 
      ? signal2[i] 
      : new Complex(0, 0);

    output[i] = signalOneElement.add(signalTwoElement);
  }

  return output;
}

/**
 * Calculates the pointwise product of two complex-valued signals. If one signal is bigger than the other, the smaller one is treated as if it's padded with zeros.
 * @param signal1 The first signal.
 * @param signal2 The second signal.
 * @returns The pointwise product of the given signals.
 */
export function pointwiseProduct(
  signal1: Complex[],
  signal2: Complex[]
): Complex[] {
  // Create a new array filled with zeros. Its length is the length of the longest argument.
  // prettier-ignore
  const output = new Array<Complex>(
      Math.max(signal1.length, signal2.length)
    );

  for (let i = 0; i < output.length; i++) {
    // If signal1 is out of bounds, pretend there's a zero
    // prettier-ignore
    const signalOneElement =
      i < signal1.length 
      ? signal1[i] 
      : new Complex(0, 0);

    // prettier-ignore
    const signalTwoElement =
      i < signal2.length 
      ? signal2[i] 
      : new Complex(0, 0);

    output[i] = signalOneElement.mult(signalTwoElement);
  }

  return output;
}

/**
 * Calculates the scalar product of a given complex-valued signal by the given real-valued scalar.
 * @param signal The signal to be multiplied.
 * @param scalar The value to scale the signal by.
 * @returns A new array containing the scaled signal.
 */
export function scalarMultSignal(signal: Complex[], scalar: number): Complex[] {
  const output = new Array<Complex>(signal.length);
  for (let i = 0; i < output.length; i++) {
    output[i] = signal[i].scalarMult(scalar);
  }

  return output;
}

/**
 * Determines whether or not all points in the given signal are identical.
 * @param signal The signal to analyze.
 * @returns True if and only if all values in the signal are equal to each other.
 */
export function allValuesAreIdentical(signal: Complex[]): boolean {
  if (signal.length === 0 || signal.length === 1) {
    return true;
  }

  let lastValue = signal[0];
  for (let i = 1; i < signal.length; i++) {
    if (!lastValue.equals(signal[i])) {
      return false;
    }

    lastValue = signal[i];
  }

  return true;
}

/**
 * Compares two Complex-valued arrays and returns true if and only if they are identical in value.
 * @param signal1 The first signal to be compared.
 * @param signal2 The second signal to be compared.
 * @returns True if and only if the two signals are exactly the same.
 */
export function signalsAreEqual(
  signal1: Complex[],
  signal2: Complex[]
): boolean {
  if (signal1.length !== signal2.length) {
    return false;
  }

  if (signal1.length === 0 && signal2.length === 0) {
    return true;
  }

  // At this point, we know that the lengths of the signals are equal and greater than 0
  for (let i = 0; i < signal1.length; i++) {
    if (!signal1[i].equals(signal2[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Copies the given signal and then reverses it.
 * @param signal The signal to be reversed.
 * @returns A reversed deep copy of the given signal.
 */
export function reverseSignal(signal: Complex[]): Complex[] {
  const output: Complex[] = signal.map(
    (element, index) => signal[signal.length - index - 1]
  );
  return output;
}
