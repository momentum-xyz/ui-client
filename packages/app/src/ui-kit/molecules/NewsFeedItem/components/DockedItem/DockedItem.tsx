import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

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

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const userIsStaking = currentUser.id === item.uuid;
  const userIsStaked = currentUser.id === item.connectedTo?.uuid;

  const dockingImage = userIsStaking ? currentUser.profile.avatarHash : item.image;
  const dockedImage = userIsStaked ? currentUser.profile.avatarHash : item.connectedTo?.image;

  const dockingUserLabel = userIsStaking ? t('newsfeed.you') : item.name;
  const dockedUserLabel = userIsStaked ? t('newsfeed.you') : item.connectedTo?.name;

  return (
    <>
      <div>
        <styled.TwoAvatarsContainer>
          <styled.Avatar
            src={getImageAbsoluteUrl(dockingImage) || ''}
            onClick={() => onOpenOdyssey?.(item.uuid)}
          />
          <styled.AvatarAhead
            src={getImageAbsoluteUrl(dockedImage) || ''}
            onClick={() => item.connectedTo?.uuid && onOpenOdyssey?.(item.connectedTo?.uuid)}
          />
        </styled.TwoAvatarsContainer>
      </div>
      <styled.Info>
        <styled.Date>{formattedDate}</styled.Date>
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
