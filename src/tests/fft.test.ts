import { describe } from '@jest/globals';
import * as testCases from './testCases';
import Complex from '../util/Complex';
import fft from '../util/fft';

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

  // Perform the pointwise sum
  output.forEach((element, index, output) => {
    // If signal1 is out of bounds, pretend there's a zero
    // prettier-ignore
    const signalOneElement =
      index < signal1.length 
      ? signal1[index] 
      : new Complex(0, 0);

    // prettier-ignore
    const signalTwoElement =
      index < signal2.length 
      ? signal2[index] 
      : new Complex(0, 0);

    output[index] = signalOneElement.add(signalTwoElement);
  });

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
  output.forEach((element, index, output) => {
    output[index] = signal[index].scalarMult(scalar);
  });
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

    expect(fft(pointwiseSignalSum)).toStrictEqual(
      pointwiseSum(
        fft(testCases.additivitySimpleSignal1),
        fft(testCases.additivitySimpleSignal2)
      )
    );
  });

  it('Should obey additivity (huge signal)', () => {
    const pointwiseSignalSum = pointwiseSum(
      testCases.additivityHugeSignal1,
      testCases.additivityHugeSignal2
    );

    expect(fft(pointwiseSignalSum)).toStrictEqual(
      pointwiseSum(
        fft(testCases.additivityHugeSignal1),
        fft(testCases.additivityHugeSignal2)
      )
    );
  });

  it('Should be homogeneous (simple signal)', () => {
    const scaledSignal = scalarMultiplication(
      testCases.homogeneitySimpleSignal,
      testCases.homogeneitySimpleScalar
    );

    expect(fft(scaledSignal)).toStrictEqual(
      scalarMultiplication(
        fft(testCases.homogeneitySimpleSignal),
        testCases.homogeneitySimpleScalar
      )
    );
  });

  it('Should be homogeneous (huge signal)', () => {
    const scaledSignal = scalarMultiplication(
      testCases.homogeneityHugeSignal,
      testCases.homogeneityHugeScalar
    );

    expect(fft(scaledSignal)).toStrictEqual(
      scalarMultiplication(
        fft(testCases.homogeneityHugeSignal),
        testCases.homogeneityHugeScalar
      )
    );
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

    expect(addedScaledSignals).toStrictEqual(
      pointwiseSum(scaledTransformedSignal1, scaledTransformedSignal2)
    );
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

    expect(addedScaledSignals).toStrictEqual(
      pointwiseSum(scaledTransformedSignal1, scaledTransformedSignal2)
    );
  });

  it('Should give an output where all bins have a constant value when given the unit impulse as an input signal', () => {
    const zero = new Complex(0, 0);
    const unitImpulse = Array<Complex>(100)
      .fill(zero) // The filled values reference the same object
      .map(() => new Complex(0, 0)); // Create new, distinct objects in their place

    unitImpulse[0] = new Complex(1, 0);

    expect(allValuesAreIdentical(fft(unitImpulse))).toBe(true);
  });

  it('Should reverse the input signal when applied twice (simple signal)', () => {
    const possiblySame = reverseSignal(
      fft(fft(testCases.reversalTestSimpleSignal))
    );
    expect(possiblySame).toStrictEqual(testCases.reversalTestSimpleSignal);
  });

  it('Should reverse the input signal when applied twice (huge signal)', () => {
    const possiblySame = reverseSignal(
      fft(fft(testCases.reversalTestHugeSignal))
    );
    expect(possiblySame).toStrictEqual(testCases.reversalTestHugeSignal);
  });

  it('Should return the original signal when applied four times (simple signal)', () => {
    const appliedFourTimes = fft(
      fft(fft(fft(testCases.applyFourSimpleSignal)))
    );
    expect(appliedFourTimes).toStrictEqual(testCases.applyFourSimpleSignal);
  });

  it('Should return the original signal when applied four times (huge signal)', () => {
    const appliedFourTimes = fft(fft(fft(fft(testCases.applyFourHugeSignal))));
    expect(appliedFourTimes).toStrictEqual(testCases.applyFourHugeSignal);
  });
});
