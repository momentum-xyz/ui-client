import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {PropsWithThemeInterface} from '@momentum-xyz/ui-kit';

import {LoginTypeEnum} from 'core/enums';

import * as styled from './WalletMessage.styled';

interface PropsInterface extends PropsWithThemeInterface {
  loginType: string | null;
  walletError?: Error | null;
  getErrorMessage: (error: Error) => string;
}

const WalletMessage: FC<PropsInterface> = (props) => {
  const {loginType, walletError, getErrorMessage} = props;

  const {t} = useTranslation();

  return (
    <>
      {!walletError && (
        <styled.Message>
          {t('messages.extensionOpen', {name: t(`networks.${loginType || ''}`)})}
          {loginType === LoginTypeEnum.Polkadot && (
            <styled.ExtensionMessage>{t('messages.extensionWindow')}</styled.ExtensionMessage>
          )}
        </styled.Message>
      )}

      {!!walletError && <styled.Error>{getErrorMessage(walletError)}</styled.Error>}
    </>
  );
};
export default WalletMessage;
