export class PrivateSpaceError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PrivateSpaceError';
  }
}
