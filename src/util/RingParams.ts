import Complex from './Complex';
import InvalidArgumentError from './InvalidArgumentError';
import { isPracticallyZero } from './SignalUtil';

/**
 * Represents the set of initial values that defines the motion of a FourierRing.
 */
class RingParams {
  private _angularPeriodMillisec: number;
  private _radiusPx: number;
  private _initialAngleDeg: number;

  /**
   * Construct a new RingParams object.
   * @param angularPeriodMillisec The period of rotation in milliseconds. Positive values specify counterclockwise rotation and negative values specify clockwise rotation.
   * @param radiusPx The radius of the circle in pixels. This must be non-negative or an exception will be thrown upon construction.
   * @param initialAngleDeg The starting angle in degrees, measured from the horizontal axis (x-axis)
   * @throws {InvalidArgumentError} When the given radiusPx is negative.
   */
  constructor(
    angularPeriodMillisec: number,
    radiusPx: number,
    initialAngleDeg: number
  ) {
    if (Math.abs(angularPeriodMillisec) < 1) {
      this._angularPeriodMillisec = 0;
    } else {
      this._angularPeriodMillisec = angularPeriodMillisec;
    }

    if (isPracticallyZero(initialAngleDeg)) {
      this._initialAngleDeg = 0;
    } else {
      this._initialAngleDeg = initialAngleDeg;
    }

    if (radiusPx < 0) {
      throw new InvalidArgumentError(
        'In constructor RingParams(): Passed-in argument radiusPx must be a non-negative number'
      );
    } else if (radiusPx < 1) {
      this._radiusPx = 0;
    } else {
      this._radiusPx = radiusPx;
    }
  }

  get angularPeriodMillisec(): number {
    return this._angularPeriodMillisec;
  }

  get radiusPx(): number {
    return this._radiusPx;
  }

  get initialAngleDeg(): number {
    return this._initialAngleDeg;
  }

  /**
   * Creates a deep clone of this instance.
   * @returns A clone of this instance.
   */
  clone(): RingParams {
    return new RingParams(
      this.angularPeriodMillisec,
      this.radiusPx,
      this.initialAngleDeg
    );
  }
}

/**
 * Given the discrete Fourier transform of a user-drawn image, this function gives the RingParams needed to reconstruct the image.
 * @param signal The signal to extract the FourierRing parameters from.
 * @returns The RingParams needed to reconstruct the original image.
 */
export function signalToRingParams(signal: Complex[]): RingParams[] {
  // Period of the slowest ring. The periods of all other rings are proportional to this base period.
  const basePeriodMillisec = 10_000; // 10 seconds
  const circleRadiusScalingFactor = 3; // 3x scale
  const ringParams: RingParams[] = [];

  // Alternate between pushing positive and negative frequencies.
  // Start with pushing the value with the largest period.
  // Skip the DC frequency component by starting the indexing at 1.
  const numberOfPositiveFrequencies = signal.length / 2;
  for (let i = 1; i < numberOfPositiveFrequencies; i++) {
    const period = Math.floor(basePeriodMillisec / i);

    // Push the positive frequency
    ringParams.push(
      new RingParams(
        period,
        signal[i].mag() * circleRadiusScalingFactor,
        signal[i].arg() * (180 / Math.PI) // Convert radians to degrees
      )
    );

    // Prevent from pushing the shortest frequency twice.
    // (In this case, the positive frequency is equal to the negative frequency.)
    if (i === signal.length - i) {
      continue;
    }

    // Push the negative frequency
    ringParams.push(
      new RingParams(
        -period,
        signal[signal.length - i].mag() * circleRadiusScalingFactor,
        signal[i].arg() * (180 / Math.PI) // Convert radians to degrees
      )
    );
  }

  return ringParams;
}

export default RingParams;
