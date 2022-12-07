import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Text} from '@momentum-xyz/ui-kit';

import {NftFeedItemInterface} from 'api';

import * as styled from './ConnectedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
}

const ConnectedItem: FC<PropsInterface> = (props) => {
  const {item} = props;

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  return (
    <>
      <div>
        <styled.TwoAvatarsContainer>
          <styled.Avatar src={item.image} />
          <styled.AvatarAhead src={item.connectedTo?.image} />
        </styled.TwoAvatarsContainer>
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
        <div>
          <Text
            size="xxs"
            text={`${item.name} and ${item.connectedTo?.name} connected`}
            align="left"
          />
        </div>
      </styled.Info>
    </>
  );
};

export default observer(ConnectedItem);
