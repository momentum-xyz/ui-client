export interface WalletConnectionsInterface {
  stakedAtWallet: string[];
  stakedAtOthers: string[];
}

export interface WalletStatisticsInterface {
  connectionsCount: number;
  mutualConnectionsCount: number;
}
