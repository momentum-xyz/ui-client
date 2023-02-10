import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {NewsfeedItemInterface} from 'api';
import {NewsfeedTypeEnum} from 'core/enums';
import {NftItemModelInterface, UserModelInterface} from 'core/models';

import {CalendarItem, ConnectedItem, CreatedItem} from './components';
import * as styled from './NewsfeedItem.styled';

interface PropsInterface {
  item: NewsfeedItemInterface;
  nftItems: NftItemModelInterface[];
  currentUser: UserModelInterface | null;
  onTeleport: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const NewsfeedItem: FC<PropsInterface> = (props) => {
  const {item, nftItems, currentUser, onTeleport, onConnect, onAttend, onOpenOdyssey} = props;

  if (!currentUser || !nftItems.length) {
    return <></>;
  }

  const nft = nftItems.find((i) => i.uuid === item.uuid);
  const connectedNft = item.connectedTo?.uuid
    ? nftItems.find((i) => i.uuid === item.connectedTo?.uuid)
    : null;

  return (
    <styled.Container data-testid={`NewsfeedItem-${item.type}-test`}>
      {item.type === NewsfeedTypeEnum.CREATED && nft && (
        <CreatedItem
          item={item}
          nftItem={nft}
          onTeleport={onTeleport}
          onConnect={onConnect}
          onOpenOdyssey={onOpenOdyssey}
        />
      )}

      {item.type === NewsfeedTypeEnum.CONNECTED && nft && connectedNft && (
        <ConnectedItem
          item={item}
          nftItem={nft}
          connectedNftItem={connectedNft}
          currentUser={currentUser}
          onOpenOdyssey={onOpenOdyssey}
        />
      )}

      {item.type === NewsfeedTypeEnum.CALENDAR && nft && (
        <CalendarItem item={item} nftItem={nft} onTeleport={onTeleport} onAttend={onAttend} />
      )}
    </styled.Container>
  );
};

export default observer(NewsfeedItem);
