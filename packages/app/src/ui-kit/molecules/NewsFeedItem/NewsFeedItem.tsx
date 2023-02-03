import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {NftFeedItemInterface} from 'api';
import {NftItemModelInterface, UserModelInterface} from 'core/models';

import * as styled from './NewsFeedItem.styled';
import {CalendarItem, ConnectedItem, CreatedItem, DockedItem} from './components';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUser: UserModelInterface | null;
  onTeleport: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const NewsFeedItem: FC<PropsInterface> = (props) => {
  const {item, currentUser, onTeleport, onConnect, onAttend, onOpenOdyssey} = props;

  if (!currentUser) {
    return <></>;
  }

  return (
    <styled.FeedItem data-testid={`NewsFeedItem-${item.type}-test`}>
      {item.type === 'created' && (
        <CreatedItem
          item={item}
          currentUser={currentUser}
          onTeleport={onTeleport}
          onConnect={onConnect}
          onOpenOdyssey={onOpenOdyssey}
        />
      )}

      {item.type === 'connected' && !item.mutual && (
        <ConnectedItem item={item} currentUser={currentUser} onOpenOdyssey={onOpenOdyssey} />
      )}

      {item.type === 'connected' && item.mutual && (
        <DockedItem item={item} currentUser={currentUser} onOpenOdyssey={onOpenOdyssey} />
      )}

      {item.type === 'calendar_event' && (
        <CalendarItem
          item={item}
          currentUser={currentUser}
          onTeleport={onTeleport}
          onAttend={onAttend}
        />
      )}

      {!['created', 'connected', 'docked', 'calendar_event'].includes(item.type) && (
        <>Unknown type</>
      )}
    </styled.FeedItem>
  );
};

export default observer(NewsFeedItem);
