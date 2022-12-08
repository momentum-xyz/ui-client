import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Text} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';

import * as styled from './DockedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
}

const DockedItem: FC<PropsInterface> = (props) => {
  const {item} = props;

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
          <Text size="xxs" text={`${item.name} docked in ${item.dockedTo?.name}`} align="left" />
        </div>
      </styled.Info>
    </>
  );
};

export default observer(DockedItem);
