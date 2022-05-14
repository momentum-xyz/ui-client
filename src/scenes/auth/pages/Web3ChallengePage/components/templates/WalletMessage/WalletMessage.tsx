import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {PropsWithThemeInterface} from 'ui-kit';
import {Web3ConnectorEnum} from 'core/enums';

import * as styled from './WalletMessage.styled';

interface PropsInterface extends PropsWithThemeInterface {
  connectorType: string | null;
  walletError?: Error | null;
  getErrorMessage: (error: Error) => string;
}

const WalletMessage: FC<PropsInterface> = (props) => {
  const {connectorType, walletError, getErrorMessage} = props;

  const {t} = useTranslation();

  return (
    <>
      {!walletError && (
        <styled.Message>
          {t('messages.extensionOpen', {name: t(`networks.${connectorType || ''}`)})}
          {connectorType === Web3ConnectorEnum.Polkadot && (
            <styled.ExtensionMessage>{t('messages.extensionWindow')}</styled.ExtensionMessage>
          )}
        </styled.Message>
      )}

      {!!walletError && <styled.Error>{getErrorMessage(walletError)}</styled.Error>}
    </>
  );
};
export default WalletMessage;
