import {Map3dUserInterface} from '@momentum-xyz/core';

export interface Map3dPropsInterface {
  currentUser: Map3dUserInterface;
  items: Map3dUserInterface[];
  selectedUuid?: string;
  getImageUrl(imageUrlOrHash: string | undefined | null): string | null;
  getConnections(wallet: string): Promise<string[]>;
  onSelect: (uuid: string) => void;
}
