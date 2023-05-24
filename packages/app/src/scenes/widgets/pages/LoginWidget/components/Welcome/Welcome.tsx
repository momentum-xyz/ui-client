import {FC} from 'react';
import {Frame, Image, Button, ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './Welcome.styled';

interface PropsInterface {
  user: UserModelInterface;
  onClose: () => void;
}

const Welcome: FC<PropsInterface> = ({user, onClose}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="Welcome-test">
      <Frame title={t('login.welcomeUser', {name: user.name})}>
        <Image
          height={200}
          errorIcon="astronaut"
          src={getImageAbsoluteUrl(user.profile.avatarHash, ImageSizeEnum.S5)}
        />
        <styled.ReadyText>{t('login.areYouReadyText')}</styled.ReadyText>
        <Button
          wide
          icon="astro"
          variant="primary"
          label={t('login.startYourJourney')}
          onClick={onClose}
        />
      </Frame>
    </styled.Container>
  );
};

export default Welcome;
