import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Image, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {newsfeedDateString} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';

import * as styled from './DockedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUser: UserModelInterface;
  onOpenOdyssey?: (uuid: string) => void;
}

const DockedItem: FC<PropsInterface> = (props) => {
  const {item, currentUser, onOpenOdyssey} = props;

  const {t} = useTranslation();

  const userIsStaking = currentUser.id === item.uuid;
  const userIsStaked = currentUser.id === item.dockedTo?.uuid;

  const dockingImage = userIsStaking ? currentUser.profile.avatarHash : item.image;
  const dockedImage = userIsStaked ? currentUser.profile.avatarHash : item.dockedTo?.image;

  const dockingUserLabel = userIsStaking ? t('newsfeed.you') : item.name;
  const dockedUserLabel = userIsStaked ? t('newsfeed.you') : item.dockedTo?.name;

  return (
    <>
      <styled.TwoAvatarsContainer>
        <styled.Avatar onClick={() => onOpenOdyssey?.(item.uuid)}>
          <Image
            src={getImageAbsoluteUrl(dockingImage)}
            sizeProps={{width: '38px', height: '38px'}}
          />
        </styled.Avatar>

        <styled.AvatarAhead onClick={() => onOpenOdyssey?.(item.dockedTo?.uuid || '')}>
          <Image
            src={getImageAbsoluteUrl(dockedImage)}
            sizeProps={{width: '38px', height: '38px'}}
          />
        </styled.AvatarAhead>
      </styled.TwoAvatarsContainer>

      <styled.Info>
        <styled.Date>{newsfeedDateString(item.date, true)}</styled.Date>
        <styled.DockedInfo>
          <styled.DockedInfoUsername onClick={() => onOpenOdyssey?.(item.uuid)}>
            <Text
              size="xxs"
              text={dockingUserLabel}
              weight={userIsStaking ? 'bold' : 'normal'}
              decoration="underline"
              align="left"
            />
          </styled.DockedInfoUsername>
          <Text size="xxs" text={t('newsfeed.and')} align="left" />
          <div
            className="username"
            onClick={() => item.connectedTo?.uuid && onOpenOdyssey?.(item.connectedTo?.uuid)}
          >
            <Text
              size="xxs"
              text={dockedUserLabel}
              weight={userIsStaked ? 'bold' : 'normal'}
              decoration="underline"
              align="left"
            />
          </div>
          <Text size="xxs" text={t('newsfeed.docked')} align="left" />
        </styled.DockedInfo>
      </styled.Info>
    </>
  );
};

export default observer(DockedItem);
