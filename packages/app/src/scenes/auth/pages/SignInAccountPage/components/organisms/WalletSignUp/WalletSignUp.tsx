import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit-storybook';

import {WalletConfigInterface} from 'wallets';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';

import * as styled from './WalletSignUp.styled';

interface PropsInterface {
  walletConf: WalletConfigInterface;
  onCancel: () => void;
  onConnected: (address: string) => void;
  onError?: (error: any) => void;
}

const WalletSignUp: FC<PropsInterface> = ({walletConf, onConnected, onError, onCancel}) => {
  const {nftStore} = useStore();
  const {name, useWallet} = walletConf;
  const {nftItems} = nftStore;

  const {signChallenge, content, account, accountHex} = useWallet({
    appVariables: appVariables as any,
    walletsToDisplay: 'withoutNfts',
    existingNftAddresses: nftItems.map((d) => d.owner)
  });
  console.log('WalletSignUp', {name, signChallenge, content, account, accountHex});

  const innerView = content || (
    <div>
      {!!account && (
        <div>
          <styled.TitleText className="wallet">{account}</styled.TitleText>
        </div>
      )}
    </div>
  );

  const accountCanLogin = accountHex && nftStore.nftItems.find((d) => d.owner === account);

  return (
    <styled.Container>
      <styled.TitleText>Connect with {name}</styled.TitleText>
      <styled.WalletInnerViewContainer>{innerView}</styled.WalletInnerViewContainer>
      {accountHex && accountCanLogin && (
        <span>a registration with this wallet exists, go to to the sign in flow</span>
      )}
      <Button label="Install browser extension" icon="star" wide />
      <div className="separator" style={{height: '16px'}}></div>
      <Button
        label="Connect your wallet"
        icon="wallet"
        disabled={!accountHex || !!accountCanLogin}
        wide
        onClick={() => {
          if (!account) {
            console.log('Account not selected');
            return;
          }
          onConnected(account);
        }}
      />
    </styled.Container>
  );
};

export default observer(WalletSignUp);
