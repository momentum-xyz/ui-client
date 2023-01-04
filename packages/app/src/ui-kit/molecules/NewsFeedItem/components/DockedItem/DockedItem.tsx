import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftFeedItemInterface} from 'api';

import * as styled from './DockedItem.styled';

interface PropsInterface {
  item: NftFeedItemInterface;
  currentUserId?: string;
  onOpenOdyssey?: (uuid: string) => void;
}

const DockedItem: FC<PropsInterface> = (props) => {
  const {item, currentUserId, onOpenOdyssey} = props;

  const {t} = useTranslation();

  const formattedDate = useMemo(() => {
    return format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
  }, [item.date]);

  const authUserIsStaking = currentUserId && currentUserId === item.uuid;
  const authUserIsStaked = currentUserId && currentUserId === item.connectedTo?.uuid;

  const dockingUserLabel = authUserIsStaking ? t('newsfeed.you') : item.name;
  const dockedUserLabel = authUserIsStaked ? t('newsfeed.you') : item.connectedTo?.name;

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
        <styled.DockedInfo>
          <styled.DockedInfoUsername onClick={() => onOpenOdyssey?.(item.uuid)}>
            <Text
              size="xxs"
              text={dockingUserLabel}
              weight={authUserIsStaking ? 'bold' : 'normal'}
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
              weight={authUserIsStaked ? 'bold' : 'normal'}
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
