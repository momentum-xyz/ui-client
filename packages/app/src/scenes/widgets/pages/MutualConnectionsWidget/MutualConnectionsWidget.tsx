import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Dialog, SvgButton, Text} from '@momentum-xyz/ui-kit';

import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './MutualConnectionsWidget.styled';

interface PropsInterface {
  mutualConnections?: Array<NftItemInterface>;
  onClose: () => void;
}

const MutualConnectionsWidget: FC<PropsInterface> = ({mutualConnections, onClose}) => {
  return (
    <Dialog
      title="Mutual connections list"
      headerStyle="divider-uppercase"
      icon="user-network"
      iconSize="medium-large"
      closeOnBackgroundClick
      onClose={onClose}
      layoutSize={{width: '437px'}}
      tabs={<SvgButton iconName="add" size="medium-large" />}
    >
      <styled.Container>
        {(!mutualConnections || !(mutualConnections.length > 0)) && (
          <styled.NoConnectionPanel>
            <styled.NoConnectionText text="There are no connections yet" size="l" />
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
                <styled.ConnectionTypeText text="Connection" size="m" align="left" />
              </styled.InfoContainer>
              <styled.Buttons>
                <Button label="make admin" size="small" />
                <SvgButton iconName="user-network" size="medium" />
              </styled.Buttons>
            </styled.Connection>
          ))}
      </styled.Container>
    </Dialog>
  );
};

export default observer(MutualConnectionsWidget);
