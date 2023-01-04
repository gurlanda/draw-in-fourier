import { describe } from '@jest/globals';
import * as testCases from './testCases';
import Complex from '../util/Complex';
import fft from '../util/fft';

/**
 * Calculates the relative error between two numbers, where the larger input is used as the divisor. This is done so that the result doesn't depend on the order of the inputs.
 * @param num1 The first input.
 * @param num2 The second input.
 * @returns The relative error between the inputs.
 */
function relativeError(num1: number, num2: number): number {
  const difference = num1 - num2;
  const relativeError = Math.abs(difference / Math.max(num1, num2));
  return relativeError;
}

/**
 * Determines whether or not two complex numbers are within an acceptable bound.
 * @param num1 The first argument.
 * @param num2 The second argument.
 * @returns True if and only if the relative error between the two numbers are within an acceptable bound.
 */
function numsAreCloseEnough(num1: Complex, num2: Complex): boolean {
  const acceptableError = 1e-13;
  if (
    relativeError(num1.real, num2.real) <= acceptableError &&
    relativeError(num1.img, num2.img) <= acceptableError
  ) {
    return true;
  }

  return false;
}

/**
 * Determines whether or not two signals are equal, barring some numerical error. This function compares two signals pointwise and returns false if either the signals are of different length or if there exists an index i such that the relative error between signal1[i] and signal2[i] is larger than the acceptable error.
 * @param signal1 The first signal to be compared.
 * @param signal2 The second signal to be compared.
 * @returns True if and only if the given signals are of the same length and are pointwise 'close enough'.
 */
function signalsAreCloseEnough(
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
 * Calculates the pointwise sum of two complex-valued signals. If one signal is bigger than the other, the smaller one is treated as if it's padded with zeros.
 * @param signal1 The first signal.
 * @param signal2 The second signal.
 * @returns The pointwise sum of the given signals.
 */
function pointwiseSum(signal1: Complex[], signal2: Complex[]): Complex[] {
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
function pointwiseProduct(signal1: Complex[], signal2: Complex[]): Complex[] {
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
function scalarMultiplication(signal: Complex[], scalar: number): Complex[] {
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
function allValuesAreIdentical(signal: Complex[]): boolean {
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
function signalsAreEqual(signal1: Complex[], signal2: Complex[]): boolean {
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
function reverseSignal(signal: Complex[]): Complex[] {
  const output: Complex[] = signal.map(
    (element, index) => signal[signal.length - index - 1]
  );
  return output;
}

describe('Tests for complex-valued FFT implementation.', () => {
  it('Should obey additivity (simple signal)', () => {
    const pointwiseSignalSum = pointwiseSum(
      testCases.additivitySimpleSignal1,
      testCases.additivitySimpleSignal2
    );

    const sumThenFFT = fft(pointwiseSignalSum);
    const fftThenSum = pointwiseSum(
      fft(testCases.additivitySimpleSignal1),
      fft(testCases.additivitySimpleSignal2)
    );

    expect(signalsAreCloseEnough(sumThenFFT, fftThenSum)).toBe(true);
  });

  it('Should obey additivity (huge signal)', () => {
    const pointwiseSignalSum = pointwiseSum(
      testCases.additivityHugeSignal1,
      testCases.additivityHugeSignal2
    );

    const sumThenFFT = fft(pointwiseSignalSum);
    const fftThenSum = pointwiseSum(
      fft(testCases.additivityHugeSignal1),
      fft(testCases.additivityHugeSignal2)
    );

    expect(signalsAreCloseEnough(sumThenFFT, fftThenSum)).toBe(true);
  });

  it('Should be homogeneous (simple signal)', () => {
    const scaledSignal = scalarMultiplication(
      testCases.homogeneitySimpleSignal,
      testCases.homogeneitySimpleScalar
    );

    const scaleThenFFT = fft(
      scalarMultiplication(
        testCases.homogeneitySimpleSignal,
        testCases.homogeneitySimpleScalar
      )
    );

    const fftThenScale = scalarMultiplication(
      fft(testCases.homogeneitySimpleSignal),
      testCases.homogeneitySimpleScalar
    );

    expect(signalsAreCloseEnough(scaleThenFFT, fftThenScale)).toBe(true);
  });

  it('Should be homogeneous (huge signal)', () => {
    const scaledSignal = scalarMultiplication(
      testCases.homogeneityHugeSignal,
      testCases.homogeneityHugeScalar
    );

    const scaleThenFFT = fft(
      scalarMultiplication(
        testCases.homogeneityHugeSignal,
        testCases.homogeneityHugeScalar
      )
    );

    const fftThenScale = scalarMultiplication(
      fft(testCases.homogeneityHugeSignal),
      testCases.homogeneityHugeScalar
    );

    expect(signalsAreCloseEnough(scaleThenFFT, fftThenScale)).toBe(true);
  });

  it('Should be linear (simple signal)', () => {
    const scaledSignal1 = scalarMultiplication(
      testCases.linearitySimpleSignal1,
      testCases.linearitySimpleScalar1
    );
    const scaledSignal2 = scalarMultiplication(
      testCases.linearitySimpleSignal2,
      testCases.linearitySimpleScalar2
    );
    const addedScaledSignals = pointwiseSum(scaledSignal1, scaledSignal2);

    const transformedSignal1 = fft(testCases.linearitySimpleSignal1);
    const transformedSignal2 = fft(testCases.linearitySimpleSignal2);

    const scaledTransformedSignal1 = scalarMultiplication(
      transformedSignal1,
      testCases.linearitySimpleScalar1
    );
    const scaledTransformedSignal2 = scalarMultiplication(
      transformedSignal2,
      testCases.linearitySimpleScalar2
    );

    const addscaleThenFFT = fft(addedScaledSignals);
    const fftThenAddscale = pointwiseSum(
      scaledTransformedSignal1,
      scaledTransformedSignal2
    );

    expect(signalsAreCloseEnough(addscaleThenFFT, fftThenAddscale)).toBe(true);
  });

  it('Should be linear (huge signal)', () => {
    const scaledSignal1 = scalarMultiplication(
      testCases.linearityHugeSignal1,
      testCases.linearityHugeScalar1
    );
    const scaledSignal2 = scalarMultiplication(
      testCases.linearityHugeSignal2,
      testCases.linearityHugeScalar2
    );
    const addedScaledSignals = pointwiseSum(scaledSignal1, scaledSignal2);

    const transformedSignal1 = fft(testCases.linearityHugeSignal1);
    const transformedSignal2 = fft(testCases.linearityHugeSignal2);

    const scaledTransformedSignal1 = scalarMultiplication(
      transformedSignal1,
      testCases.linearityHugeScalar1
    );
    const scaledTransformedSignal2 = scalarMultiplication(
      transformedSignal2,
      testCases.linearityHugeScalar2
    );

    const addscaleThenFFT = fft(addedScaledSignals);
    const fftThenAddscale = pointwiseSum(
      scaledTransformedSignal1,
      scaledTransformedSignal2
    );

    expect(signalsAreCloseEnough(addscaleThenFFT, fftThenAddscale)).toBe(true);
  });

  it('Should give an output where all bins in the frequency domain have a constant value when given the unit impulse as an input signal', () => {
    const zero = new Complex(0, 0);
    const unitImpulse = Array<Complex>(128)
      .fill(zero) // The filled values reference the same object
      .map(() => new Complex(0, 0)); // Create new, distinct objects in their place

    unitImpulse[0] = new Complex(1, 0);

    expect(allValuesAreIdentical(fft(unitImpulse))).toBe(true);
  });

  // it('Should transform a time-shifted time domain signal to a linearly phase-rotated signal in the frequency domain', () => {
  //   // Create the unit impulse
  //   const zero = new Complex(0, 0);
  //   const unitImpulse = Array<Complex>(128)
  //     .fill(zero) // The filled values reference the same object
  //     .map(() => new Complex(0, 0)); // Create new, distinct objects in their place
  //   unitImpulse[0] = new Complex(1, 0);

  //   // Create a unit impulse shifted by 20
  //   const shift = 19;
  //   const shiftedUnitImpulse = Array<Complex>(128)
  //     .fill(zero)
  //     .map(() => new Complex(0, 0));
  //   shiftedUnitImpulse[shift] = new Complex(1, 0);

  //   // Utility function
  //   // Calculates a rotation scalar
  //   function phaseRotation(frequency: number) {
  //     // Calculate the product -i * 2 * PI * frequency * shift
  //     const i = new Complex(0, 1);
  //     const omega = (2 * Math.PI * frequency) / 128;
  //     const product = i.mult(new Complex(omega * shift, 0));

  //     return product.exp();
  //   }

  //   // Create the linear phase rotation signal
  //   const phaseRotatorSignal = Array<Complex>(128).fill(zero);
  //   for (let i = 0; i < phaseRotatorSignal.length; i++) {
  //     phaseRotatorSignal[i] = phaseRotation(i);
  //   }

  //   const fftThenRotate = pointwiseProduct(
  //     fft(unitImpulse),
  //     phaseRotatorSignal
  //   );

  //   const shiftThenFFT = fft(shiftedUnitImpulse);
  //   // console.log(shiftThenFFT);

  //   expect(fftThenRotate).toStrictEqual(shiftThenFFT);
  // });
});
