export class SessionException extends Error {
  constructor() {
    super('Something wrong with session');
    Object.setPrototypeOf(this, SessionException.prototype);
  }
}
