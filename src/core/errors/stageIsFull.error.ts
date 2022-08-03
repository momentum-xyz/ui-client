export class StageIsFullError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'StageIsFullError';
  }
}
