import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Image, Text} from '@momentum-xyz/ui-kit';
import {newsfeedDateString} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {NewsfeedItemInterface} from 'api';
import {NftItemModelInterface} from 'core/models';
import placeholder from 'static/images/placeholder.png';

import * as styled from './CalendarItem.styled';

interface PropsInterface {
  item: NewsfeedItemInterface;
  nftItem: NftItemModelInterface;
  onTeleport: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
}

const CalendarItem: FC<PropsInterface> = (props) => {
  const {item, nftItem, onTeleport, onAttend} = props;

  if (!item.calendar) {
    return <></>;
  }

  return (
    <>
      <styled.OneAvatar>
        <Image
          src={getImageAbsoluteUrl(item.calendar.image) || placeholder}
          sizeProps={{width: '58px', height: '58px'}}
        />
      </styled.OneAvatar>

      <styled.Info>
        <styled.Date>
          {newsfeedDateString(item.calendar.start, false)}
          {' - '}
          {newsfeedDateString(item.calendar.end, false)}
        </styled.Date>
        <div>
          <Text size="xxs" text={`${item.calendar.title}`} align="left" />
          <Text size="xxs" text={nftItem.name} align="left" />
        </div>
        <styled.Actions>
          <div>
            <Button size="small" label="Attend" icon="add" onClick={() => onAttend(nftItem)} />
          </div>
          <div>
            <Button size="small" label="" icon="fly-portal" onClick={() => onTeleport(nftItem)} />
          </div>
        </styled.Actions>
      </styled.Info>
    </>
  );
};

export default observer(CalendarItem);
