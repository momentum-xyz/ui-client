import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Image, Text} from '@momentum-xyz/ui-kit';
import {newsfeedDateString} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';
import {NftItemModelInterface, UserModelInterface} from 'core/models';
import placeholder from 'static/images/placeholder.png';

import * as styled from './CalendarItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUser: UserModelInterface;
  onTeleport: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
}

const CalendarItem: FC<PropsInterface> = (props) => {
  const {item, onTeleport, currentUser, onAttend} = props;

  const name = item.uuid === currentUser.id ? currentUser.name : item.name;

  return (
    <>
      <styled.OneAvatar>
        <Image
          src={getImageAbsoluteUrl(item.calendarImage) || placeholder}
          sizeProps={{width: '58px', height: '58px'}}
        />
      </styled.OneAvatar>

      <styled.Info>
        <styled.Date>
          {newsfeedDateString(item.calendarStart, false)}
          {' - '}
          {newsfeedDateString(item.calendarEnd, false)}
        </styled.Date>
        <div>
          <Text size="xxs" text={`${item.calendarTitle}`} align="left" />
          <Text size="xxs" text={`${name}`} align="left" />
        </div>
        <styled.Actions>
          <div>
            <Button size="small" label="Attend" icon="add" onClick={() => onAttend(item)} />
          </div>
          <div>
            <Button size="small" label="" icon="fly-portal" onClick={() => onTeleport(item)} />
          </div>
        </styled.Actions>
      </styled.Info>
    </>
  );
};

export default observer(CalendarItem);
