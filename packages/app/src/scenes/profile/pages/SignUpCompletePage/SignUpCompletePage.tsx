import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {PanelLayout} from '@momentum/ui-kit';

import {useStore, useSession} from 'shared/hooks';
import {SignUpFormInterface} from 'scenes/profile/stores/SignUpCompleteStore';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';
import {ROUTES} from 'core/constants';

import {SignUpCompleteForm} from './components';
import * as styled from './SignUpCompletePage.styled';

const SignUpCompletePage: FC = () => {
  const {sessionStore, profileStore} = useStore();
  const {profile} = sessionStore;
  const {signUpCompleteStore} = profileStore;
  const {isUpdating, errors} = signUpCompleteStore;

  const history = useHistory();
  const {idToken} = useSession(() => {});

  useEffect(() => {
    if (idToken) {
      sessionStore.init(idToken);
    }
  }, [idToken, sessionStore]);

  const onSubmitHandle = useCallback(
    async (form: SignUpFormInterface) => {
      const result = await signUpCompleteStore.updateProfile(form);
      if (result?.userOnboarded) {
        await sessionStore.reload();
        history.push(ROUTES.welcome, {from: window.history.state?.state?.from || ROUTES.base});
      }
    },
    [signUpCompleteStore, sessionStore, history]
  );

  const onCancelHandle = useCallback(() => {
    history.push(ROUTES.login, {from: window.history.state?.state?.from || ROUTES.base});
  }, [history]);

  return (
    <styled.Background background={background} data-testid="SignUpCompletePage-test">
      <PanelLayout isBodyExtendingToEdges>
        <styled.Wrapper>
          <styled.LogoContainer>
            <styled.Logo src={momentum} />
          </styled.LogoContainer>

          {!!profile && (
            <SignUpCompleteForm
              user={{
                name: profile.name,
                bio: profile.profile?.bio,
                profileLink: profile.profile?.profileLink,
                avatarHash: profile.profile?.avatarHash
              }}
              fieldErrors={errors}
              isSubmitDisabled={isUpdating}
              onSubmit={onSubmitHandle}
              onCancel={onCancelHandle}
            />
          )}
        </styled.Wrapper>
      </PanelLayout>
    </styled.Background>
  );
};

export default observer(SignUpCompletePage);
