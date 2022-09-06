import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {LoginView, NetworkButton, Page, PanelLayout, Text} from 'ui-kit';
import background from 'static/images/worldBuilder.png';
import momentum from 'static/images/momentum.svg';
import walletConnect from 'static/images/walletConnect.svg';
import polkadot from 'static/images/polkadot.svg';
import metamask from 'static/images/metamask.svg';
import {LoginTypeEnum} from 'core/enums';

import {WorldBuilderWalletError} from './components';
import * as styled from './WorldBuilderLoginPage.styled';

const WorldBuilderLoginPage: FC = () => {
  const {loginStore, web3ConnectorsFiltered} = useStore().authStore;
  const {isRefreshButtonShown, isSessionExpired, errorMessage} = loginStore;
  const {isWeb3LoginStarted, isGuestLoginStarted} = loginStore;

  const theme = useTheme();
  const {t} = useTranslation();
  const queryParams = new URLSearchParams(window.location.search);
  const noWorldBuilderPermissions = queryParams.get('noWorldBuilderPermissions');

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (isWeb3LoginStarted) {
      loginStore.web3SignIn();
    }
  }, [isWeb3LoginStarted, loginStore]);

  useEffect(() => {
    if (isGuestLoginStarted) {
      loginStore.guestSignIn();
    }
  }, [isGuestLoginStarted, loginStore]);

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
                {web3ConnectorsFiltered.map((connector) => {
                  let imageSrc = polkadot;
                  if (connector.name === LoginTypeEnum.Metamask) {
                    imageSrc = metamask;
                  } else if (connector.name === LoginTypeEnum.WalletConnect) {
                    imageSrc = walletConnect;
                  }

                  return (
                    <NetworkButton
                      key={connector.name}
                      theme={theme}
                      imageSrc={imageSrc}
                      label={t(`networks.${connector.name}`)}
                      onClick={() => loginStore.chooseNetwork(connector)}
                    />
                  );
                })}
                <styled.RemarksContainer>
                  <Text theme={theme} size="l" text={t('messages.startBuilding')} weight="light" />
                </styled.RemarksContainer>
              </styled.Networks>
            )}
          </LoginView>
          {isSessionExpired && (
            <styled.WorldBuilderError>{t('errors.sessionExpired')}</styled.WorldBuilderError>
          )}
          {noWorldBuilderPermissions === 'true' && (
            <styled.WorldBuilderError>
              {t('errors.noWorldBuilderPermissions')}
            </styled.WorldBuilderError>
          )}
        </PanelLayout>
      </styled.Background>
    </Page>
  );
};

export default observer(WorldBuilderLoginPage);
