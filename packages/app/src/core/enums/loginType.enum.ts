/**
 * Enum for login type.
 * @readonly
 * @enum {string}
 */

export enum LoginTypeEnum {
  Polkadot = 'polkadot',
  Metamask = 'metamask',
  WalletConnect = 'walletconnect',
  Keycloak = 'keycloak',
  Guest = 'guest'
}

/**
 * Login type list based on LoginTypeEnum.
 * @readonly
 */

export const LoginTypeEnumList: LoginTypeEnum[] = [
  LoginTypeEnum.Polkadot,
  LoginTypeEnum.Metamask,
  LoginTypeEnum.WalletConnect,
  LoginTypeEnum.Keycloak,
  LoginTypeEnum.Guest
];
