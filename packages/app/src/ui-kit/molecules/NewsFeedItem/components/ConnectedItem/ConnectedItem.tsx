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
  onOpenOdyssey?: (uuid: string) => void;
}

const ConnectedItem: FC<PropsInterface> = (props) => {
  const {item, userId, onOpenOdyssey} = props;

  const {t} = useTranslation();

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const authUserIsStaking = userId && userId === item.uuid;
  const authUserIsStaked = userId && userId === item.connectedTo?.uuid;

  const stakingUserLabel = authUserIsStaking ? t('newsfeed.you') : item.name;
  const stakedUserLabel = authUserIsStaked ? t('newsfeed.you') : item.connectedTo?.name;

  return (
    <>
      <div>
        <styled.TwoAvatarsContainer>
          <styled.Avatar
            src={getImageAbsoluteUrl(item.image) || ''}
            onClick={() => onOpenOdyssey?.(item.uuid)}
          />
          <styled.AvatarAhead
            src={getImageAbsoluteUrl(item.connectedTo?.image) || ''}
            onClick={() => item.connectedTo?.uuid && onOpenOdyssey?.(item.connectedTo?.uuid)}
          />
        </styled.TwoAvatarsContainer>
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
        <styled.ConnectedInfo>
          <div className="username" onClick={() => onOpenOdyssey?.(item.uuid)}>
            <Text
              size="xxs"
              text={stakingUserLabel}
              weight={authUserIsStaking ? 'bold' : 'normal'}
              decoration="underline"
              align="left"
            />
          </div>
          <Text size="xxs" text={t('newsfeed.stakedIn')} align="left" />
          <div
            className="username"
            onClick={() => item.connectedTo?.uuid && onOpenOdyssey?.(item.connectedTo?.uuid)}
          >
            <Text
              size="xxs"
              text={stakedUserLabel}
              weight={authUserIsStaked ? 'bold' : 'normal'}
              decoration="underline"
              align="left"
            />
          </div>
        </styled.ConnectedInfo>
      </styled.Info>
    </>
  );
};

export default observer(ConnectedItem);
