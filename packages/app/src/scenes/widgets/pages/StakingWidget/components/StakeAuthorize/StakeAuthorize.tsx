import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Input, numberInputSuffixMask, Textarea} from '@momentum-xyz/ui-kit';

import * as styled from './StakeAuthorize.styled';

interface PropsInterface {
  worldName: string;
  amountValue: string;
  tokenSymbol: string;
  selectedWalletId: string | null;
  onChangeAmountValue: (value: string) => void;
  onStakeClick: (comment: string) => void;
  onBackClick: () => void;
}

const MAX_TOKEN_VALUE = 9999999999;

const StakeAuthorize: FC<PropsInterface> = ({
  worldName,
  amountValue,
  tokenSymbol,
  selectedWalletId,
  onChangeAmountValue,
  onStakeClick,
  onBackClick
}) => {
  const [comment, setComment] = useState('');

  return (
    <styled.Container data-testid="StakeAmount-test">
      <styled.Title>Authorise</styled.Title>
      <styled.Description>
        Double check if the information presented below is correct and authorise your transaction by
        pressing sign and stake.
      </styled.Description>

      <styled.Section>
        <styled.SectionGrid>
          <div>Amount</div>
          <Input
            wide
            value={amountValue}
            opts={numberInputSuffixMask(tokenSymbol, 5, false, MAX_TOKEN_VALUE)}
            onChange={onChangeAmountValue}
          />
        </styled.SectionGrid>

        <styled.SectionGrid>
          <div>Sending From</div>
          <styled.BorderedValue>
            <span>{selectedWalletId}</span>
          </styled.BorderedValue>
        </styled.SectionGrid>

        <styled.SectionGrid>
          <div>Sending To</div>
          <styled.BorderedValue>
            <span>{worldName}</span>
          </styled.BorderedValue>
        </styled.SectionGrid>
      </styled.Section>

      <styled.Comment>
        <styled.Name>Write a comment</styled.Name>
        <Textarea
          value={comment}
          placeholder="Why do you want to stake in this Odyssey?"
          onChange={setComment}
        />
      </styled.Comment>

      <styled.Buttons>
        <Button label="Go back" onClick={onBackClick} variant="secondary" />
        <Button label="Sign & Stake" onClick={() => onStakeClick(comment)} />
      </styled.Buttons>
    </styled.Container>
  );
};

export default observer(StakeAuthorize);
