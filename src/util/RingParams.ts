/**
 * Represents the set of initial values that defines the motion of a FourierRing.
 */
class RingParams {
  angularVelocityMillisec: number;
  radiusPx: number;
  initialAngleDeg: number;

  /**
   *
   * @param angularVelocityMillisec The velocity of rotation in milliseconds. Positive values specify counterclockwise rotation and negative values specify clockwise rotation.
   * @param radiusPx The radius of the circle in pixels. This must be non-negative or an exception will be thrown upon construction.
   * @param initialAngleDeg The starting angle in degrees, measured from the horizontal axis (x-axis)
   */
  constructor(
    angularVelocityMillisec: number,
    radiusPx: number,
    initialAngleDeg: number
  ) {
    this.angularVelocityMillisec = angularVelocityMillisec;
    this.initialAngleDeg = initialAngleDeg;

    if (radiusPx < 0) {
      throw new TypeError(
        'In constructor RingParams(): Passed-in argument radiusPx must be a non-negative number'
      );
    }

    this.radiusPx = radiusPx;
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
