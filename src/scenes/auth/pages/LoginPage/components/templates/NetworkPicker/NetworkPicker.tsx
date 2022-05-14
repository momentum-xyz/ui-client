import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {Web3ConnectorEnum} from 'core/enums';
import {Web3ConnectorInterface} from 'core/interfaces';
import {NetworkButton, PropsWithThemeInterface} from 'ui-kit';
import walletConnect from 'static/images/walletConnect.svg';
import polkadot from 'static/images/polkadot.svg';
import metamask from 'static/images/metamask.svg';

interface PropsInterface extends PropsWithThemeInterface {
  web3Connectors: Web3ConnectorInterface[];
  onSelect: (network: Web3ConnectorInterface) => void;
}

const NetworkPicker: FC<PropsInterface> = (props) => {
  const {web3Connectors, onSelect, theme} = props;
  const {t} = useTranslation();

  return (
    <>
      {web3Connectors.map((connector) => {
        let imageSrc = polkadot;
        if (connector.name === Web3ConnectorEnum.Metamask) {
          imageSrc = metamask;
        } else if (connector.name === Web3ConnectorEnum.WalletConnect) {
          imageSrc = walletConnect;
        }

        return (
          <NetworkButton
            key={connector.name}
            theme={theme}
            imageSrc={imageSrc}
            label={t(`networks.${connector.name}`)}
            onClick={() => onSelect(connector)}
          />
        );
      })}

      <NetworkButton
        theme={theme}
        iconName="profile"
        label={t(`networks.${Web3ConnectorEnum.Guest}`)}
        disabled
        onClick={() => onSelect({name: Web3ConnectorEnum.Guest, connector: null})}
      />
    </>
  );
};
export default NetworkPicker;
