import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Dropdown, Heading, IconSvg, OptionInterface, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './Login.styled';

interface PropsInterface {
  walletOptions: OptionInterface[];
  wallet: string | null;
  isPending: boolean;
  onSelectAddress: (address: string) => void;
  onLogin: () => void;
}

const Login: FC<PropsInterface> = (props) => {
  const {walletOptions, wallet, isPending, onSelectAddress, onLogin} = props;

  const {t} = useTranslation();

  return (
    <Box size="small">
      <styled.Div>
        <styled.Header>
          <IconSvg name="shield-open" size="normal" />
          <Heading type="h3" label={t('actions.signIn')} align="left" />
        </styled.Header>

        <styled.ImageContainer>
          <styled.Image src={polkadot} />
          <Text
            size="xxs"
            text={t('networks.polkadot')}
            align="left"
            transform="uppercase"
            weight="bold"
          />
        </styled.ImageContainer>

        <Dropdown
          variant="third"
          valueType="wallet"
          options={walletOptions}
          placeholder={t('actions.selectAccount')}
          onOptionSelect={(option) => onSelectAddress(option.value)}
        />

        <Button
          icon="wallet"
          size="medium"
          label={t('actions.connectWallet')}
          disabled={!wallet || isPending}
          onClick={onLogin}
        />
      </styled.Div>
    </Box>
  );
};

export default Login;
