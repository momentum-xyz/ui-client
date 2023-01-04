import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {NftFeedItemInterface} from 'api';
import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './NewsFeedItem.styled';
import {CalendarItem, ConnectedItem, CreatedItem, DockedItem} from './components';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUserId?: string;
  onTeleport: (nft: NftItemInterface) => void;
  onAttend: (nft: NftItemInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const NewsFeedItem: FC<PropsInterface> = (props) => {
  const {item, currentUserId, onTeleport, onConnect, onAttend, onOpenOdyssey} = props;

  return (
    <styled.FeedItem data-testid={`NewsFeedItem-${item.type}-test`}>
      {item.type === 'created' && (
        <CreatedItem
          item={item}
          onTeleport={onTeleport}
          onConnect={onConnect}
          onOpenOdyssey={onOpenOdyssey}
        />
      )}

      {item.type === 'connected' && !item.mutual && (
        <ConnectedItem item={item} currentUserId={currentUserId} onOpenOdyssey={onOpenOdyssey} />
      )}

      {item.type === 'connected' && item.mutual && (
        <DockedItem item={item} currentUserId={currentUserId} onOpenOdyssey={onOpenOdyssey} />
      )}

      {item.type === 'calendar_event' && (
        <CalendarItem item={item} onTeleport={onTeleport} onAttend={onAttend} />
      )}

      {!['created', 'connected', 'docked', 'calendar_event'].includes(item.type) && (
        <>Unknown type</>
      )}
    </styled.FeedItem>
  );
};

export default observer(NewsFeedItem);
