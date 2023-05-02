import {FC} from 'react';
import {Heading, Input, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './StakeAuthorize.styled';

interface PropsInterface {
  amountValue: string;
  tokenSymbol: string;
  onChangeAmountValue: (value: string) => void;
  onStakeClick: () => void;
  onBackClick: () => void;
}

const StakeAuthorize: FC<PropsInterface> = ({
  amountValue,
  tokenSymbol,
  onChangeAmountValue,
  onStakeClick,
  onBackClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Container>
      <styled.TabContent>
        <div>
          <styled.Section>
            <styled.SectionHeader>
              <Heading type="h2" align="left" label={t('staking.authorizeContribution')} />
            </styled.SectionHeader>
            <styled.LabeledLineContainer>
              <styled.LabeledLineLabelContainer>
                <Text
                  size="xxs"
                  align="right"
                  text={t('staking.tokenAmount', {amount: tokenSymbol})}
                />
              </styled.LabeledLineLabelContainer>
              <styled.LabeledLineInputContainer className="view-only">
                <Input value={amountValue} onChange={onChangeAmountValue} disabled />
              </styled.LabeledLineInputContainer>
            </styled.LabeledLineContainer>
            <styled.LabeledLineContainer>
              <styled.LabeledLineLabelContainer>
                <Text size="xxs" align="right" text={t('staking.sendingFrom')} />
              </styled.LabeledLineLabelContainer>
            </styled.LabeledLineContainer>
            <styled.ConsentContainer>
              <Text size="s" align="left" text={t('staking.contributionMessage')} />
            </styled.ConsentContainer>
          </styled.Section>
        </div>

        <styled.Buttons>
          <Button label={t('staking.back')} onClick={onBackClick} />
          <Button label={t('staking.signAndConnect')} icon="check" onClick={onStakeClick} />
        </styled.Buttons>
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakeAuthorize);
