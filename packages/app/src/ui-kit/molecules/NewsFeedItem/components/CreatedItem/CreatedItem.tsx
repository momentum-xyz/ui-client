import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';
import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './CreatedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  onTeleport: (nft: NftItemInterface) => void;
  onConnect: (id: number) => void;
}

const CreatedItem: FC<PropsInterface> = (props) => {
  const {item, onTeleport, onConnect} = props;

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  return (
    <>
      <div>
        <styled.OneAvatar src={getImageAbsoluteUrl(item.image) || ''} />
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
        <div>
          <Text size="xxs" text={`${item.name} was created`} align="left" />
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
            <Button size="small" label="" icon="fly-to" onClick={() => onTeleport(item)} />
          </div>
        </styled.Actions>
      </styled.Info>
    </>
  );
};

export default observer(CreatedItem);
