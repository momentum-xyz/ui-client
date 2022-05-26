import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {PanelLayout} from 'ui-kit';
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

  const updateProfileHandle = useCallback(
    async (form: SignUpFormInterface) => {
      const result = await signUpCompleteStore.updateProfile(form);
      if (result?.userOnboarded) {
        await sessionStore.reload();
        history.push(ROUTES.base);
      }
    },
    [signUpCompleteStore, sessionStore, history]
  );

  return (
    <styled.Background background={background}>
      <PanelLayout isBodyExtendingToEdges>
        <styled.Wrapper>
          <styled.Logo src={momentum} />
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
              onSubmit={updateProfileHandle}
            />
          )}
        </styled.Wrapper>
      </PanelLayout>
    </styled.Background>
  );
};

export default observer(SignUpCompletePage);
