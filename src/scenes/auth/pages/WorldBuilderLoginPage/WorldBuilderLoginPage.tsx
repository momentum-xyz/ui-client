import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {LoginView, NetworkButton, Page, PanelLayout, Text} from 'ui-kit';
import background from 'static/images/worldBuilder.png';
import momentum from 'static/images/momentum.svg';
import polkadot from 'static/images/polkadot.svg';
import {LoginTypeEnum} from 'core/enums';

import {WorldBuilderWalletError} from './components';
import * as styled from './WorldBuilderLoginPage.styled';

const WorldBuilderLoginPage: FC = () => {
  const {loginStore} = useStore().authStore;
  const {isRefreshButtonShown, isSessionExpired, errorMessage} = loginStore;
  const {isWeb3LoginStarted} = loginStore;

  const theme = useTheme();
  const {t} = useTranslation();
  const queryParams = new URLSearchParams(window.location.search);
  const noWorldBuilderPermissions = queryParams.get('noWorldBuilderPermissions') === 'true';

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (isWeb3LoginStarted) {
      loginStore.web3SignIn();
    }
  }, [isWeb3LoginStarted, loginStore]);

  return (
    <Page backgroundSrc={background}>
      <styled.Background>
        <PanelLayout isBodyExtendingToEdges>
          <LoginView
            logo={momentum}
            title={t('messages.signIn')}
            {...(isRefreshButtonShown && {
              backBtn: {
                variant: 'primary',
                title: t('actions.refresh'),
                onClick: () => {
                  document.location.reload();
                }
              }
            })}
          >
            {errorMessage ? (
              <WorldBuilderWalletError error={errorMessage} />
            ) : (
              <styled.Networks>
                <NetworkButton
                  theme={theme}
                  imageSrc={polkadot}
                  label={t(`networks.polkadot`)}
                  onClick={() =>
                    loginStore.chooseNetwork({
                      name: LoginTypeEnum.Polkadot,
                      connector: null
                    })
                  }
                />
                {noWorldBuilderPermissions ? (
                  <styled.WorldBuilderError>
                    {t('errors.noWorldBuilderPermissions')}
                  </styled.WorldBuilderError>
                ) : (
                  <styled.RemarksContainer>
                    <Text
                      theme={theme}
                      size="l"
                      text={t('messages.startBuilding')}
                      weight="light"
                    />
                  </styled.RemarksContainer>
                )}
              </styled.Networks>
            )}
          </LoginView>
          {isSessionExpired && (
            <styled.WorldBuilderError>{t('errors.sessionExpired')}</styled.WorldBuilderError>
          )}
        </PanelLayout>
      </styled.Background>
    </Page>
  );
};

export default observer(WorldBuilderLoginPage);
