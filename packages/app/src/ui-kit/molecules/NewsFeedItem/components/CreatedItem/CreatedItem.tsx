import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Button, Text} from '@momentum-xyz/ui-kit';

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

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const name = item.uuid === currentUser.id ? currentUser.name : item.name;
  const image = item.uuid === currentUser.id ? currentUser.profile.avatarHash : item.image;

  return (
    <>
      <div>
        <styled.OneAvatar
          src={getImageAbsoluteUrl(image) || ''}
          onClick={() => onOpenOdyssey?.(item.uuid)}
        />
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
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
