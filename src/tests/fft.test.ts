import { describe } from '@jest/globals';
import * as testCases from './fftTestCases';
import Complex from '../util/Complex';
import fft, { pureFFT } from '../util/fft';
import * as SignalUtil from '../util/SignalUtil';

describe('Tests for complex-valued FFT implementation.', () => {
  it('Should obey additivity (simple signal)', () => {
    const pointwiseSignalSum = SignalUtil.pointwiseSum(
      testCases.additivitySimpleSignal1,
      testCases.additivitySimpleSignal2
    );

    const sumThenFFT = fft(pointwiseSignalSum);
    const fftThenSum = SignalUtil.pointwiseSum(
      fft(testCases.additivitySimpleSignal1),
      fft(testCases.additivitySimpleSignal2)
    );

    expect(SignalUtil.signalsAreCloseEnough(sumThenFFT, fftThenSum)).toBe(true);
  });

  it('Should obey additivity (huge signal)', () => {
    const pointwiseSignalSum = SignalUtil.pointwiseSum(
      testCases.additivityHugeSignal1,
      testCases.additivityHugeSignal2
    );

    const sumThenFFT = fft(pointwiseSignalSum);
    const fftThenSum = SignalUtil.pointwiseSum(
      fft(testCases.additivityHugeSignal1),
      fft(testCases.additivityHugeSignal2)
    );

    expect(SignalUtil.signalsAreCloseEnough(sumThenFFT, fftThenSum)).toBe(true);
  });

  it('Should be homogeneous (simple signal)', () => {
    const scaledSignal = SignalUtil.scalarMultSignal(
      testCases.homogeneitySimpleSignal,
      testCases.homogeneitySimpleScalar
    );

    const scaleThenFFT = fft(
      SignalUtil.scalarMultSignal(
        testCases.homogeneitySimpleSignal,
        testCases.homogeneitySimpleScalar
      )
    );

    const fftThenScale = SignalUtil.scalarMultSignal(
      fft(testCases.homogeneitySimpleSignal),
      testCases.homogeneitySimpleScalar
    );

    expect(SignalUtil.signalsAreCloseEnough(scaleThenFFT, fftThenScale)).toBe(
      true
    );
  });

  it('Should be homogeneous (huge signal)', () => {
    const scaledSignal = SignalUtil.scalarMultSignal(
      testCases.homogeneityHugeSignal,
      testCases.homogeneityHugeScalar
    );

    const scaleThenFFT = fft(
      SignalUtil.scalarMultSignal(
        testCases.homogeneityHugeSignal,
        testCases.homogeneityHugeScalar
      )
    );

    const fftThenScale = SignalUtil.scalarMultSignal(
      fft(testCases.homogeneityHugeSignal),
      testCases.homogeneityHugeScalar
    );

    expect(SignalUtil.signalsAreCloseEnough(scaleThenFFT, fftThenScale)).toBe(
      true
    );
  });

  it('Should be linear (simple signal)', () => {
    const scaledSignal1 = SignalUtil.scalarMultSignal(
      testCases.linearitySimpleSignal1,
      testCases.linearitySimpleScalar1
    );
    const scaledSignal2 = SignalUtil.scalarMultSignal(
      testCases.linearitySimpleSignal2,
      testCases.linearitySimpleScalar2
    );
    const addedScaledSignals = SignalUtil.pointwiseSum(
      scaledSignal1,
      scaledSignal2
    );

    const transformedSignal1 = fft(testCases.linearitySimpleSignal1);
    const transformedSignal2 = fft(testCases.linearitySimpleSignal2);

    const scaledTransformedSignal1 = SignalUtil.scalarMultSignal(
      transformedSignal1,
      testCases.linearitySimpleScalar1
    );
    const scaledTransformedSignal2 = SignalUtil.scalarMultSignal(
      transformedSignal2,
      testCases.linearitySimpleScalar2
    );

    const addscaleThenFFT = fft(addedScaledSignals);
    const fftThenAddscale = SignalUtil.pointwiseSum(
      scaledTransformedSignal1,
      scaledTransformedSignal2
    );

    expect(
      SignalUtil.signalsAreCloseEnough(addscaleThenFFT, fftThenAddscale)
    ).toBe(true);
  });

  it('Should be linear (huge signal)', () => {
    const scaledSignal1 = SignalUtil.scalarMultSignal(
      testCases.linearityHugeSignal1,
      testCases.linearityHugeScalar1
    );
    const scaledSignal2 = SignalUtil.scalarMultSignal(
      testCases.linearityHugeSignal2,
      testCases.linearityHugeScalar2
    );
    const addedScaledSignals = SignalUtil.pointwiseSum(
      scaledSignal1,
      scaledSignal2
    );

    const transformedSignal1 = fft(testCases.linearityHugeSignal1);
    const transformedSignal2 = fft(testCases.linearityHugeSignal2);

    const scaledTransformedSignal1 = SignalUtil.scalarMultSignal(
      transformedSignal1,
      testCases.linearityHugeScalar1
    );
    const scaledTransformedSignal2 = SignalUtil.scalarMultSignal(
      transformedSignal2,
      testCases.linearityHugeScalar2
    );

    const addscaleThenFFT = fft(addedScaledSignals);
    const fftThenAddscale = SignalUtil.pointwiseSum(
      scaledTransformedSignal1,
      scaledTransformedSignal2
    );

    expect(
      SignalUtil.signalsAreCloseEnough(addscaleThenFFT, fftThenAddscale)
    ).toBe(true);
  });

  it('Should give an output where all bins in the frequency domain have a constant value when given the unit impulse as an input signal', () => {
    const zero = new Complex(0, 0);
    const unitImpulse = Array<Complex>(128)
      .fill(zero) // The filled values reference the same object
      .map(() => new Complex(0, 0)); // Create new, distinct objects in their place

    unitImpulse[0] = new Complex(1, 0);

    expect(SignalUtil.allValuesAreIdentical(fft(unitImpulse))).toBe(true);
  });

  it('Should throw an error if the given input is not a power of two (simple signal)', () => {
    const notPowerOfTwo = [
      new Complex(0, 0),
      new Complex(1, 2),
      new Complex(69, 200),
    ];

    function passBadInput() {
      pureFFT(notPowerOfTwo);
    }

    expect(passBadInput).toThrowError();
  });

  it('Should throw an error if the given input is not a power of two (huge signal)', () => {
    const notPowerOfTwo = SignalUtil.cloneSignal(
      testCases.additivityHugeSignal1
    );
    notPowerOfTwo.pop();

    function passBadInput() {
      pureFFT(notPowerOfTwo);
    }

    expect(passBadInput).toThrowError();
  });

  it('Should transform a time-shifted time domain signal to a linearly phase-rotated signal in the frequency domain', () => {
    // Create the unit impulse
    const zero = new Complex(0, 0);
    const unitImpulse = Array<Complex>(128)
      .fill(zero) // The filled values reference the same object for now
      .map(() => new Complex(0, 0)); // Create new, distinct objects in their place
    unitImpulse[0] = new Complex(1, 0);

    // Create a unit impulse shifted by 25
    const shift = 25;
    const shiftedUnitImpulse = Array<Complex>(128)
      .fill(zero)
      .map(() => new Complex(0, 0));
    shiftedUnitImpulse[shift] = new Complex(1, 0);

    // Utility function
    // Calculates a rotation scalar
    function phaseRotation(frequency: number) {
      // Calculate the product -i * 2 * PI * frequency * shift
      const i = new Complex(0, 1);
      const omega = (2 * Math.PI * frequency) / 128;
      const product = i.mult(new Complex(omega * shift, 0));

      return product.exp();
    }

    // Create the linear phase rotation signal
    const phaseRotatorSignal = Array<Complex>(128).fill(zero);
    for (let i = 0; i < phaseRotatorSignal.length; i++) {
      phaseRotatorSignal[i] = phaseRotation(i);
    }

    const fftThenRotate = SignalUtil.pointwiseProduct(
      fft(unitImpulse),
      phaseRotatorSignal
    );

    const shiftThenFFT = fft(shiftedUnitImpulse);

    // expect(fftThenRotate).toStrictEqual(shiftThenFFT);
    expect(SignalUtil.signalsAreCloseEnough(fftThenRotate, shiftThenFFT)).toBe(
      true
    );

    // // Generate a square
    // const cornerPoints: Complex[] = [
    //   new Complex(1, 0),
    //   new Complex(0, 1),
    //   new Complex(-1, 0),
    //   new Complex(0, -1),
    // ];

    // // Interpolate 5 times
    // let squareShapeSignal: Complex[] = cornerPoints;
    // for (let i = 0; i < 5; i++) {
    //   squareShapeSignal = interpolateSignal(squareShapeSignal);
    // }

    // console.log(signalToRingParams(fft(squareShapeSignal)));

    // // Print to console
    // let log = '[\n';
    // for (let i = 0; i < squareShapeSignal.length - 1; i++) {
    //   const currentElement = squareShapeSignal[i];
    //   log += `new Complex(${currentElement.real}, ${currentElement.img}),\n`;
    // }
    // // The last element is a special case
    // log += `new Complex(${
    //   squareShapeSignal[squareShapeSignal.length - 1].real
    // }, ${squareShapeSignal[squareShapeSignal.length - 1].img})\n]`;

    // console.log(log);
  });
});
