import Complex from './Complex';

/**
 * Represents a 2D point where both coordinates are integers.
 */
class Point {
  private _x: number;
  private _y: number;

  /**
   * Constructs a Point given two whole numbers. If the given coordinates are not whole numbers, the coordinates are taken to be the floored values of the arguments.
   * @param x The first coordinate. If not provided, this defaults to 0.
   * @param y The second coordinate. If not provided, this defaults to 0.
   */
  constructor(x: number = 0, y: number = 0) {
    this._x = Math.floor(x);
    this._y = Math.floor(y);
  }

  /** The x-coordinate of this Point. */
  get x(): number {
    return this._y;
  }

  /** The y-coordinate of this Point. */
  get y(): number {
    return this._x;
  }

  /**
   * Calculates the distance of this Point from (0,0).
   * @returns The distance of this Point from the origin.
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the coordinate-wise sum of two Points.
   * @param other The Point to add to this Point.
   * @returns The sum.
   */
  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  /**
   * Creates a deep copy of this Point.
   * @returns A deep copy of this Point.
   */
  clone(): Point {
    return new Point(this.x, this.y);
  }

  /**
   * Returns a deep copy of the given array of Points.
   * @param points The array of Points to clone.
   * @returns A deep copy of all the given Points.
   */
  static cloneArray(points: Point[]): Point[] {
    return points.map((point) => point.clone());
  }
}

/**
 * Given an array of points, finds their 2D average.
 * @param points The array of Points to average.
 * @returns The 2D average of the given Points.
 */
function findCenter(points: Point[]): Point {
  // Add all Points in the given array
  let accumulator = new Point();
  points.forEach((point) => {
    accumulator = accumulator.add(point);
  });

  const normalizedX = accumulator.x / points.length;
  const normalizedY = accumulator.y / points.length;

  return new Point(normalizedX, normalizedY);
}

/**
 * Performs a change of origin for the given Points. This function doesn't change the original array.
 * @param points The points to perform the change.
 * @param newOrigin The new origin.
 * @returns A deep copy of the given points with their new coordinates.
 */
function changeOfOrigin(points: Point[], newOrigin: Point): Point[] {
  const pointsWithChangedOrigin = points.map(
    (point) => new Point(point.x - newOrigin.x, point.y - newOrigin.y)
  );
  return pointsWithChangedOrigin;
}

/**
 * Converts a Point to a Complex number.
 * @param point The Point to convert.
 * @returns The Point in the form of a Complex number.
 */
function pointToComplex(point: Point): Complex {
  return new Complex(point.x, point.y);
}

/**
 * Converts an array of Points to an array of Complex numbers.
 * @param points The Points to convert.
 * @returns The converted signal.
 */
function pointsToSignal(points: Point[]): Complex[] {
  return points.map((point) => pointToComplex(point));
}
export default Point;
