import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Image, Text} from '@momentum-xyz/ui-kit';
import {newsfeedDateString} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';
import {NftItemModelInterface, UserModelInterface} from 'core/models';

import * as styled from './CreatedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUser: UserModelInterface;
  onTeleport: (nft: NftItemModelInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const CreatedItem: FC<PropsInterface> = (props) => {
  const {item, currentUser, onTeleport, onConnect, onOpenOdyssey} = props;

  const name = item.uuid === currentUser.id ? currentUser.name : item.name;
  const image = item.uuid === currentUser.id ? currentUser.profile.avatarHash : item.image;

  return (
    <>
      <styled.OneAvatar onClick={() => onOpenOdyssey?.(item.uuid)}>
        <Image src={getImageAbsoluteUrl(image)} sizeProps={{width: '58px', height: '58px'}} />
      </styled.OneAvatar>

      <styled.Info>
        <styled.Date>{newsfeedDateString(item.date, true)}</styled.Date>
        <div>
          <Text size="xxs" text={`${name} was created`} align="left" />
        </div>
        <styled.Actions>
          <div>
            <Button
              size="small"
              label="Connect"
              icon="hierarchy"
              onClick={() => onConnect(item.id)}
            />
          </div>

          <div>
            <Button size="small" label="" icon="fly-portal" onClick={() => onTeleport(item)} />
          </div>
        </styled.Actions>
      </styled.Info>
    </>
  );
};

export default observer(CreatedItem);
