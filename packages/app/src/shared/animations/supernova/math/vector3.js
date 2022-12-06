/* eslint-disable */
// @ts-nocheck
export class Vector3 {
  x;
  y;
  z;

  constructor(x = 0, y = x, z = y) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  zero() {
    this.x = this.y = this.z = 0;

    return this;
  }

  copy() {
    return new Vector3(this.x, this.y, this.z);
  }

  set(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;

    return this;
  }

  setCoordinates(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;

    return this;
  }

  addMultiplied(vector, scalar) {
    this.x += vector.x * scalar;
    this.y += vector.y * scalar;
    this.z += vector.z * scalar;

    return this;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;

    return this;
  }

  subtractMultiplied(vector, scalar) {
    this.x -= vector.x * scalar;
    this.y -= vector.y * scalar;
    this.z -= vector.z * scalar;

    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  multiplyVector(other) {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;

    return this;
  }

  divide(scalar) {
    return this.multiply(1 / scalar);
  }

  cross(a, b) {
    this.x = a.y * b.z - b.y * a.z;
    this.y = a.z * b.x - b.z * a.x;
    this.z = a.x * b.y - b.x * a.y;

    return this;
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  normalize() {
    return this.divide(this.length);
  }

  distanceTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dz = other.z - this.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  squaredDistanceTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dz = other.z - this.z;

    return dx * dx + dy * dy + dz * dz;
  }

  randomUnit(random) {
    const lambda = Math.acos(2 * random.float - 1) - 0.5 * Math.PI;
    const phi = 2 * Math.PI * random.float;

    this.x = Math.cos(lambda) * Math.cos(phi);
    this.y = Math.cos(lambda) * Math.sin(phi);
    this.z = Math.sin(lambda);

    return this;
  }

  get length() {
    return Math.sqrt(this.dot(this));
  }
}
