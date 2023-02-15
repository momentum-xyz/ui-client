import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Avatar, Button, Text} from '@momentum-xyz/ui-kit';
import {newsfeedDateString} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {NewsfeedItemInterface} from 'api';
import {NftItemModelInterface} from 'core/models';

import * as styled from './CreatedItem.styled';

interface PropsInterface {
  item: NewsfeedItemInterface;
  nftItem: NftItemModelInterface;
  onTeleport: (nft: NftItemModelInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const CreatedItem: FC<PropsInterface> = (props) => {
  const {item, nftItem, onTeleport, onConnect, onOpenOdyssey} = props;

  return (
    <>
      <Avatar
        size="normal"
        showBorder
        showHover
        avatarSrc={getImageAbsoluteUrl(nftItem.image) || ''}
        onClick={() => onOpenOdyssey?.(item.uuid)}
      />

      <styled.Info>
        <styled.Date>{newsfeedDateString(item.date, true)}</styled.Date>
        <div>
          <Text size="xxs" text={`${nftItem.name} was created`} align="left" />
        </div>
        <styled.Actions>
          <div>
            <Button
              size="small"
              label="Connect"
              icon="hierarchy"
              onClick={() => onConnect(nftItem.id)}
            />
          </div>

          <div>
            <Button size="small" label="" icon="fly-portal" onClick={() => onTeleport(nftItem)} />
          </div>
        </styled.Actions>
      </styled.Info>
    </>
  );
};

export default observer(CreatedItem);
