import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Dialog, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useNavigation, useStore} from 'shared/hooks';

import * as styled from './MutualConnectionsWidget.styled';

const MutualConnectionsWidget: FC = () => {
  const {nftStore, widgetsStore, unityStore} = useStore();
  const {mutualConnectionsStore} = widgetsStore;
  const {mutualConnections} = nftStore;

  const {t} = useTranslation();
  const {goToOdysseyHome} = useNavigation();

  const handleUnstake = useCallback(() => {
    mutualConnectionsStore.dialog.close();
    nftStore.stakingDashorboardDialog.open();
  }, [mutualConnectionsStore, nftStore]);

  const handleTeleportToOdyssey = useCallback(
    (worldId: string) => {
      mutualConnectionsStore.dialog.close();
      goToOdysseyHome(worldId);
    },
    [goToOdysseyHome, mutualConnectionsStore]
  );

  return (
    <Dialog
      title={t('mutualConnections.title')}
      headerStyle="divider-uppercase"
      icon="user-network"
      iconSize="medium-large"
      closeOnBackgroundClick
      onClose={mutualConnectionsStore.dialog.close}
      layoutSize={{width: '437px'}}
      //tabs={<SvgButton iconName="add" size="medium-large" />}
    >
      <styled.Container>
        {(!mutualConnections || !(mutualConnections.length > 0)) && (
          <styled.NoConnectionPanel>
            <styled.NoConnectionText text={t('mutualConnections.noConnection')} size="l" />
          </styled.NoConnectionPanel>
        )}
        {mutualConnections &&
          mutualConnections.map((connection) => (
            <styled.Connection key={connection.id}>
              <styled.InfoContainer>
                <Text
                  text={connection.name}
                  size="m"
                  align="left"
                  transform="uppercase"
                  weight="bold"
                />
                <styled.ConnectionTypeText
                  text={t('mutualConnections.admin')}
                  size="m"
                  align="left"
                />
              </styled.InfoContainer>
              <styled.Buttons>
                <Button
                  label={t('staking.unStake')}
                  size="medium"
                  transform="normal"
                  onClick={handleUnstake}
                />
                <SvgButton
                  iconName="fly-portal"
                  size="medium"
                  onClick={() => handleTeleportToOdyssey(connection.uuid)}
                  disabled={unityStore.worldId === connection.uuid}
                />
              </styled.Buttons>
            </styled.Connection>
          ))}
      </styled.Container>
    </Dialog>
  );
};

export default observer(MutualConnectionsWidget);
