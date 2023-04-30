export class ServerError extends Error {
  constructor() {
    super(`Internal server errror`);
    this.name = 'InvalidParamError';
  }
}
