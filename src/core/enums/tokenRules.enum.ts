export enum NetworkTypeEnum {
  MOONBEAM = 'moonbeam',
  ETHEREUM = 'eth_mainnet'
}
export enum TokenTypeEnum {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155'
}

export enum TokenRuleStatus {
  APPROVED = 'approved',
  DECLINED = 'denied',
  REQUESTED = 'requested'
}

export enum TokenRuleReviewStatus {
  APPROVED = 'approved',
  DENIED = 'denied'
}

export enum TokenRuleListHeader {
  ICON = 'icon',
  NAME = 'name',
  STATUS = 'status',
  INFO = 'info'
}

export enum TokenRuleRoles {
  ADMIN = 'admin',
  MEMBER = 'member'
}
