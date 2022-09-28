export enum NetworkTypeEnum {
  MOONBEAM = 'moonbeam',
  ETHEREUM = 'eth_mainnet'
}
export enum TokenTypeEnum {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155'
}

export enum TokenRuleStatusEnum {
  APPROVED = 'approved',
  DECLINED = 'denied',
  REQUESTED = 'requested'
}

export enum TokenRuleReviewStatusEnum {
  APPROVED = 'approved',
  DENIED = 'denied'
}

export enum TokenRuleListHeaderEnum {
  ICON = 'icon',
  NAME = 'name',
  STATUS = 'status',
  INFO = 'info'
}

export enum TokenRuleRolesEnum {
  ADMIN = 'admin',
  MEMBER = 'member'
}
