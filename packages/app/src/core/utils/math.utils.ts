export class MathUtils {
  // Convert from degrees to radians
  static degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  // Convert from radians to degrees
  static radiansToDegrees(radians: number) {
    return (radians * 180) / Math.PI;
  }
}
