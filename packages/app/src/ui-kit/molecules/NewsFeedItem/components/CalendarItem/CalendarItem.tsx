import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';
import {NftItemModelInterface} from 'core/models';
import placeholder from 'static/images/placeholder.png';

import * as styled from './CalendarItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  onTeleport: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
}

const CalendarItem: FC<PropsInterface> = (props) => {
  const {item, onTeleport, onAttend} = props;

  const formattedStartDate = useMemo(() => {
    if (item.calendarStart) {
      return format(new Date(item.calendarStart), `MM/dd/yyyy h:mm aa`);
    } else {
      return '';
    }
  }, [item.calendarStart]);

  const formattedEndDate = useMemo(() => {
    if (item.calendarEnd) {
      return format(new Date(item.calendarEnd), `MM/dd/yyyy h:mm aa`);
    } else {
      return '';
    }
  }, [item.calendarEnd]);

  return (
    <>
      <div>
        <styled.OneAvatar src={getImageAbsoluteUrl(item.calendarImage) || placeholder} />
      </div>
      <styled.Info>
        <styled.Date>
          {formattedStartDate} - {formattedEndDate}
        </styled.Date>
        <div>
          <Text size="xxs" text={`${item.calendarTitle}`} align="left" />
          <Text size="xxs" text={`${item.name}`} align="left" />
        </div>
        <styled.Actions>
          <div>
            <Button size="small" label="Attend" icon="add" onClick={() => onAttend(item)} />
          </div>
          <div>
            <Button size="small" label="" icon="fly-to" onClick={() => onTeleport(item)} />
          </div>
        </styled.Actions>
      </styled.Info>
    </>
  );
};

export default observer(CalendarItem);
