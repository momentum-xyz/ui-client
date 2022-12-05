import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {NftFeedItemInterface} from 'api';
import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './NewsFeedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  onTeleport: (nft: NftItemInterface) => void;
  onConnect: (id: number) => void;
}

const NewsFeedItem: FC<PropsInterface> = (props) => {
  const {item, onTeleport, onConnect} = props;

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const message = useMemo(() => {
    switch (item.type) {
      case 'created': {
        return `${item.name} was created`;
      }
      case 'connected': {
        return `${item.name} and ${item.connectedTo?.name} connected`;
      }
      case 'docked': {
        return `${item.name} docked in ${item.dockedTo?.name}`;
      }
      default:
        return '';
    }
  }, [item.connectedTo?.name, item.dockedTo?.name, item.name, item.type]);

  return (
    <styled.FeedItem data-testid="NewsFeedItem-test">
      <div>
        {item.type !== 'connected' ? (
          <styled.OneAvatar src={item.image} />
        ) : (
          <>
            <styled.TwoAvatarsContainer>
              <styled.Avatar src={item.image} />
              <styled.AvatarAhead src={item.connectedTo?.image} />
            </styled.TwoAvatarsContainer>
          </>
        )}
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
        <div>
          <Text size="xxs" text={message} align="left" />
        </div>
        {item.type === 'created' && (
          <styled.Actions>
            <Button
              size="small"
              label="Connect"
              icon="hierarchy"
              onClick={() => onConnect(item.id)}
            />
            <Button size="small" label="" icon="fly-to" onClick={() => onTeleport(item)} />
          </styled.Actions>
        )}
      </styled.Info>
    </styled.FeedItem>
  );
};

export default observer(NewsFeedItem);
