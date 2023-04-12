import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Select, SymbolAmount, Button} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './MyWallet.styled';

interface PropsInterface {}

const MyWallet: FC<PropsInterface> = (props) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="MyWallet-test">
      <Frame>
        <styled.Title>My Wallet</styled.Title>

        <styled.Filters>
          <div>Account</div>
          <Select wide value="" options={[]} placeholder={t('actions.selectWallet')} />
        </styled.Filters>

        <styled.Title>Rewards</styled.Title>

        <styled.RewardsContainer>
          <span>Total Rewards</span>
          <styled.Amount>
            <SymbolAmount value={0} tokenSymbol="MOM" />
          </styled.Amount>
          <Button icon="wallet" label="Claim Rewards" />
        </styled.RewardsContainer>

        <styled.ScrollableContainer>
          <styled.Title>Balance</styled.Title>

          <styled.TokenBlock>
            <styled.TitleBlock>Account Balance</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount value={0} tokenSymbol="MOM" />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>

          <styled.TokenBlock>
            <styled.TitleBlock>Transferable</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount value={0} tokenSymbol="MOM" />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>

          <styled.TokenBlock>
            <styled.TitleBlock>Staked</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount value={0} tokenSymbol="MOM" />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>

          <styled.TokenBlock>
            <styled.TitleBlock>Unbonding</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount value={0} tokenSymbol="MOM" />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>
        </styled.ScrollableContainer>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(MyWallet);
