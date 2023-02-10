import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Image, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {newsfeedDateString} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';

import * as styled from './ConnectedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUser: UserModelInterface;
  onOpenOdyssey?: (uuid: string) => void;
}

const ConnectedItem: FC<PropsInterface> = (props) => {
  const {item, currentUser, onOpenOdyssey} = props;

  const {t} = useTranslation();

  const userIsStaking = currentUser.id === item.uuid;
  const userIsStaked = currentUser.id === item.connectedTo?.uuid;

  const stakingUserImage = userIsStaking ? currentUser.profile.avatarHash : item.image;
  const stakedUserImage = userIsStaked ? currentUser.profile.avatarHash : item.connectedTo?.image;

  const stakingUserLabel = userIsStaking ? t('newsfeed.you') : item.name;
  const stakedUserLabel = userIsStaked ? t('newsfeed.you') : item.connectedTo?.name;

  return (
    <>
      <styled.TwoAvatarsContainer>
        <styled.Avatar onClick={() => onOpenOdyssey?.(item.uuid)}>
          <Image
            src={getImageAbsoluteUrl(stakingUserImage)}
            sizeProps={{width: '38px', height: '38px'}}
          />
        </styled.Avatar>

        <styled.AvatarAhead onClick={() => onOpenOdyssey?.(item.connectedTo?.uuid || '')}>
          <Image
            src={getImageAbsoluteUrl(stakedUserImage)}
            sizeProps={{width: '38px', height: '38px'}}
          />
        </styled.AvatarAhead>
      </styled.TwoAvatarsContainer>

      <styled.Info>
        <styled.Date>{newsfeedDateString(item.date, true)}</styled.Date>
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
