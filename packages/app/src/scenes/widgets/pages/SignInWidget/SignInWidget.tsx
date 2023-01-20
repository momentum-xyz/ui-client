import React, {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Dialog, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import image from 'static/images/world.svg';

import * as styled from './SignInWidget.styled';

const MENU_OFFSET_LEFT = 10;
const MENU_OFFSET_TOP = 20;

const SignInWidget: FC = () => {
  const {sessionStore} = useStore();

  const {t} = useTranslation();

  return (
    <Dialog
      icon="add"
      position="leftTop"
      headerType="h2"
      iconSize="medium"
      title={t('actions.createOrSignIn')}
      offset={{left: MENU_OFFSET_LEFT, top: MENU_OFFSET_TOP}}
      showBackground={false}
      withoutOpacity
      headerStyle="normal"
      shortTopPadding
      layoutSize={{width: '285px'}}
      topComponent={
        <styled.Sinus>
          <SinusBox />
        </styled.Sinus>
      }
    >
      <styled.Container>
        <Text size="m" text={t('messages.howSignUp')} align="left" />
        <styled.Image src={image} />
        <Text size="s" text={t('messages.signUp')} align="left" />

        <Button
          wide
          size="medium"
          icon="planet"
          label={t('actions.createOdyssey')}
          onClick={() => sessionStore.signInRedirect(true)}
        />

        <Text size="s" text={t('messages.orSignIn')} align="left" />

        <Button
          wide
          size="medium"
          icon="shield-open"
          label={t('actions.signIn')}
          onClick={() => sessionStore.signInRedirect()}
        />
      </styled.Container>
    </Dialog>
  );
};

export default memo(SignInWidget);
