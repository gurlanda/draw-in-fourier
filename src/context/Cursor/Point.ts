// Stores a 2d point
class Point {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // Returns a deep copy of this Point
  clone(): Point {
    return new Point(this.x, this.y);
  }
}

export default Point;
