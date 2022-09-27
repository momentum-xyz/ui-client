import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {LoginTypeEnum} from 'core/enums';
import {Web3ConnectorInterface} from 'core/interfaces';
import {NetworkButton} from 'ui-kit';
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
            onClick={() => onSelect(connector)}
          />
        );
      })}

      <NetworkButton
        theme={theme}
        iconName="profile"
        label={t(`networks.${LoginTypeEnum.Guest}`)}
        onClick={() => onSelect({name: LoginTypeEnum.Guest, connector: null})}
      />
    </>
  );
};
export default NetworkPicker;
