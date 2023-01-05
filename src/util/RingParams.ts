import InvalidArgumentError from './InvalidArgumentError';

/**
 * Represents the set of initial values that defines the motion of a FourierRing.
 */
class RingParams {
  private _angularVelocityMillisec: number;
  private _radiusPx: number;
  private _initialAngleDeg: number;

  /**
   * Construct a new RingParams object.
   * @param angularVelocityMillisec The velocity of rotation in milliseconds. Positive values specify counterclockwise rotation and negative values specify clockwise rotation.
   * @param radiusPx The radius of the circle in pixels. This must be non-negative or an exception will be thrown upon construction.
   * @param initialAngleDeg The starting angle in degrees, measured from the horizontal axis (x-axis)
   * @throws {InvalidArgumentError} When the given radiusPx is negative.
   */
  constructor(
    angularVelocityMillisec: number,
    radiusPx: number,
    initialAngleDeg: number
  ) {
    this._angularVelocityMillisec = angularVelocityMillisec;
    this._initialAngleDeg = initialAngleDeg;

    if (radiusPx < 0) {
      throw new InvalidArgumentError(
        'In constructor RingParams(): Passed-in argument radiusPx must be a non-negative number'
      );
    }

    this._radiusPx = radiusPx;
  }

  get angularVelocityMillisec(): number {
    return this._angularVelocityMillisec;
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
      this.angularVelocityMillisec,
      this.radiusPx,
      this.initialAngleDeg
    );
  }
}

export default RingParams;
