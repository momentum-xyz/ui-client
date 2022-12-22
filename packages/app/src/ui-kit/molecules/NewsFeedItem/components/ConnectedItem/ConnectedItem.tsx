import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';

import * as styled from './ConnectedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  userId?: string;
}

const ConnectedItem: FC<PropsInterface> = (props) => {
  const {item, userId} = props;
  const {t} = useTranslation();

  console.log(userId);

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const authUserIsStaking = userId && userId === item.uuid;
  const stakingUserLabel = authUserIsStaking ? t('newsfeed.you') : item.name;

  return (
    <>
      <div>
        <styled.TwoAvatarsContainer>
          <styled.Avatar src={getImageAbsoluteUrl(item.image) || ''} />
          <styled.AvatarAhead src={getImageAbsoluteUrl(item.connectedTo?.image) || ''} />
        </styled.TwoAvatarsContainer>
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
        <div>
          <Text
            size="xxs"
            text={stakingUserLabel}
            weight={authUserIsStaking ? 'bold' : 'normal'}
            decoration="underline"
            align="left"
          />
          <Text size="xxs" text={t('newsfeed.stakedIn')} align="left" />
          {/* <Text size="xxs" text="&nbsp;staked in&nbsp;" align="left" /> */}
          <Text size="xxs" text={item.connectedTo?.name} decoration="underline" align="left" />
        </div>
      </styled.Info>
    </>
  );
};

export default observer(ConnectedItem);
