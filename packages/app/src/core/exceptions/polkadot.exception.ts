export class PolkadotExtensionException extends Error {
  constructor() {
    super('no polkadot extension is installed');
    Object.setPrototypeOf(this, PolkadotExtensionException.prototype);
  }
}
