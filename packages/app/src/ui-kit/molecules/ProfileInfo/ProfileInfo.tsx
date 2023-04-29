import {FC} from 'react';
import cn from 'classnames';
import {signUpDateString, useI18n} from '@momentum-xyz/core';
import {ProfileLine, ButtonEllipse, WalletHash} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './ProfileInfo.styled';

interface PropsInterface {
  address?: string;
  hash?: string | null;
  description?: string;
  joinDate?: string;
  hideBorder?: boolean;
  onVisit?: () => void;
  onStake?: () => void;
}

const ProfileInfo: FC<PropsInterface> = (props) => {
  const {hash, description, address, joinDate, hideBorder, onVisit, onStake} = props;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="ProfileInfo-test" className={cn(hideBorder && 'hideBorder')}>
      {description && <div>{description}</div>}
      {address && (
        <ProfileLine
          icon="link"
          label={
            <styled.LinkAccent target="_blank" href={address}>
              {address}
            </styled.LinkAccent>
          }
        />
      )}
      {joinDate && (
        <ProfileLine icon="astro" label={`${t('actions.joined')} ${signUpDateString(joinDate)}`} />
      )}

      {hash && <WalletHash icon="talisman" hash={hash} />}

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
