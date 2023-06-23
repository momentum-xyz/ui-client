import {FC} from 'react';
import cn from 'classnames';
import {signUpDateString, useI18n} from '@momentum-xyz/core';
import {ProfileLine, ButtonEllipse, WalletHash, IconNameType, TextCut} from '@momentum-xyz/ui-kit';

import * as styled from './ProfileInfo.styled';

interface PropsInterface {
  weblink?: string | null;
  hash?: string | null;
  walletIcon?: IconNameType;
  description?: string | null;
  descriptionLines?: number;
  joinDate?: string | null;
  createDate?: string | null;
  hideBorder?: boolean;
  onVisit?: () => void;
  onStake?: () => void;
}

const ProfileInfo: FC<PropsInterface> = ({
  hash,
  walletIcon,
  description,
  descriptionLines = 0,
  weblink,
  joinDate,
  createDate,
  hideBorder,
  onVisit,
  onStake
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="ProfileInfo-test" className={cn(hideBorder && 'hideBorder')}>
      {description && <TextCut text={description} lines={descriptionLines} />}

      {weblink && (
        <ProfileLine
          icon="link"
          label={
            <styled.LinkAccent target="_blank" href={weblink}>
              {weblink}
            </styled.LinkAccent>
          }
        />
      )}
      {joinDate && (
        <ProfileLine icon="astro" label={`${t('actions.joined')} ${signUpDateString(joinDate)}`} />
      )}

      {createDate && (
        <ProfileLine
          icon="star"
          label={`${t('actions.created')} ${signUpDateString(createDate)}`}
        />
      )}

      {hash && <WalletHash icon={walletIcon} hash={hash} />}

      {(!!onVisit || !!onStake) && (
        <styled.Actions>
          {!!onVisit && (
            <ButtonEllipse icon="fly-to" label={t('actions.visitOdyssey')} onClick={onVisit} />
          )}
          {!!onStake && (
            <ButtonEllipse icon="stake" label={t('actions.stakeInOdyssey')} onClick={onStake} />
          )}
        </styled.Actions>
      )}
    </styled.Container>
  );
};

export default ProfileInfo;
