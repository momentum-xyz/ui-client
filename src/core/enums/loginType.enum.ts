export enum LoginTypeEnum {
  Keycloak = 'keycloak',
  Web3 = 'web3',
  Guest = 'guest'
}

export const LoginTypeEnumList: LoginTypeEnum[] = [
  LoginTypeEnum.Keycloak,
  LoginTypeEnum.Web3,
  LoginTypeEnum.Guest
];
