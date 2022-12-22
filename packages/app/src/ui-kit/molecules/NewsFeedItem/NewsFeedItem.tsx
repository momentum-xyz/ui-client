import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {NftFeedItemInterface} from 'api';
import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './NewsFeedItem.styled';
import {CalendarItem, ConnectedItem, CreatedItem, DockedItem} from './components';

interface PropsInterface {
  item: NftFeedItemInterface;
  userId?: string;
  onTeleport: (nft: NftItemInterface) => void;
  onAttend: (nft: NftItemInterface) => void;
  onConnect: (id: number) => void;
}

const NewsFeedItem: FC<PropsInterface> = (props) => {
  const {item, userId, onTeleport, onConnect, onAttend} = props;

  console.warn(item);
  // eslint-disable-next-line no-debugger
  // debugger;

  return (
    <styled.FeedItem data-testid={`NewsFeedItem-${item.type}-test`}>
      {item.type === 'created' && (
        <CreatedItem item={item} onTeleport={onTeleport} onConnect={onConnect} />
      )}

      {item.type === 'connected' && <ConnectedItem item={item} userId={userId} />}

      {item.type === 'docked' && <DockedItem item={item} />}

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
