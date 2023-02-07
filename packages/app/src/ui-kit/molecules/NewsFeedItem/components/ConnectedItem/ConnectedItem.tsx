import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';
import astronautIcon from 'static/images/astronaut-green.svg';

import * as styled from './ConnectedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUser: UserModelInterface;
  onOpenOdyssey?: (uuid: string) => void;
}

const ConnectedItem: FC<PropsInterface> = (props) => {
  const {item, currentUser, onOpenOdyssey} = props;

  const {t} = useTranslation();

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const userIsStaking = currentUser.id === item.uuid;
  const userIsStaked = currentUser.id === item.connectedTo?.uuid;

  const stakingUserImage = userIsStaking ? currentUser.profile.avatarHash : item.image;
  const stakedUserImage = userIsStaked ? currentUser.profile.avatarHash : item.connectedTo?.image;

  const stakingUserLabel = userIsStaking ? t('newsfeed.you') : item.name;
  const stakedUserLabel = userIsStaked ? t('newsfeed.you') : item.connectedTo?.name;

  return (
    <>
      <div>
        <styled.TwoAvatarsContainer>
          <styled.Avatar
            src={getImageAbsoluteUrl(stakingUserImage) || astronautIcon}
            onClick={() => onOpenOdyssey?.(item.uuid)}
          />
          <styled.AvatarAhead
            src={getImageAbsoluteUrl(stakedUserImage) || astronautIcon}
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
              weight={userIsStaking ? 'bold' : 'normal'}
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
              weight={userIsStaked ? 'bold' : 'normal'}
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
