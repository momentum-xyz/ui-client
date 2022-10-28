import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {PanelLayout} from '@momentum-xyz/ui-kit';

import {useStore, useSession} from 'shared/hooks';
import {SignUpFormInterface} from 'scenes/profile/stores/SignUpCompleteStore';
import background from 'static/images/bg.png';
import momentum from 'static/images/momentum.svg';
import {ROUTES} from 'core/constants';

import {SignUpCompleteForm} from './components';
import * as styled from './SignUpCompletePage.styled';

const SignUpCompletePage: FC = () => {
  const {sessionStore, profileStore} = useStore();
  const {user} = sessionStore;
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
      if (result?.onBoarded) {
        await sessionStore.loadUserProfile();
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

          {!!user && (
            <SignUpCompleteForm
              user={{
                name: user.name,
                bio: user.profile?.bio,
                profileLink: user.profile?.profileLink,
                avatarHash: user.profile?.avatarHash
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
