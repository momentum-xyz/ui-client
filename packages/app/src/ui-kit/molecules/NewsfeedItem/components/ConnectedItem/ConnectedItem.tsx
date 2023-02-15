import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Avatar, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {newsfeedDateString} from '@momentum-xyz/core';

import {NftItemModelInterface, UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';
import {NewsfeedItemInterface} from 'api';

import * as styled from './ConnectedItem.styled';

interface PropsInterface {
  item: NewsfeedItemInterface;
  nftItem: NftItemModelInterface;
  connectedNftItem: NftItemModelInterface;
  currentUser: UserModelInterface;
  onOpenOdyssey?: (uuid: string) => void;
}

const ConnectedItem: FC<PropsInterface> = (props) => {
  const {item, nftItem, connectedNftItem, currentUser, onOpenOdyssey} = props;

  const {t} = useTranslation();

  const isMyNft = currentUser.id === item.uuid;
  const isMyStakedNft = currentUser.id === item.connectedTo?.uuid;

  return (
    <>
      <styled.TwoAvatarsContainer>
        <Avatar
          size="medium"
          showBorder
          showHover
          avatarSrc={getImageAbsoluteUrl(nftItem.image) || ''}
          onClick={() => onOpenOdyssey?.(item.uuid)}
        />

        <styled.AvatarAhead>
          <Avatar
            size="medium"
            showBorder
            showHover
            avatarSrc={getImageAbsoluteUrl(connectedNftItem.image) || ''}
            onClick={() => onOpenOdyssey?.(item.connectedTo?.uuid || '')}
          />
        </styled.AvatarAhead>
      </styled.TwoAvatarsContainer>

      <styled.Info>
        <styled.Date>{newsfeedDateString(item.date, true)}</styled.Date>
        <styled.ConnectedInfo>
          <div className="username" onClick={() => onOpenOdyssey?.(item.uuid)}>
            <Text
              size="xxs"
              text={isMyNft ? t('newsfeed.you') : nftItem.name}
              weight={isMyNft ? 'bold' : 'normal'}
              decoration="underline"
              align="left"
            />
          </div>
          {item.connectedTo?.isMutual ? (
            <Text size="xxs" text={t('newsfeed.and')} align="left" />
          ) : (
            <Text size="xxs" text={t('newsfeed.stakedIn')} align="left" />
          )}
          <div
            className="username"
            onClick={() => item.connectedTo?.uuid && onOpenOdyssey?.(item.connectedTo?.uuid)}
          >
            <Text
              size="xxs"
              text={isMyStakedNft ? t('newsfeed.you') : connectedNftItem.name}
              weight={isMyStakedNft ? 'bold' : 'normal'}
              decoration="underline"
              align="left"
            />
          </div>
          {item.connectedTo?.isMutual && (
            <Text size="xxs" text={t('newsfeed.docked')} align="left" />
          )}
        </styled.ConnectedInfo>
      </styled.Info>
    </>
  );
};

export default observer(ConnectedItem);
