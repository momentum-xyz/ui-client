import React, {FC, useCallback, useEffect, useState} from 'react';
import {web3FromSource} from '@polkadot/extension-dapp';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {SubmittableResultValue} from '@polkadot/api-base/types/submittable';
import {DispatchError, EventRecord} from '@polkadot/types/interfaces';

import {Message, PropsWithThemeInterface, Text, Button, Loader} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {StakingTransactionType} from 'core/enums';

import * as styled from './Authorization.styled';
import {BondDetails, UnbondDetails, WithdrawUnbondDetails} from './components';

interface PropsInterface extends PropsWithThemeInterface {}

const Authorization: FC<PropsInterface> = ({theme}) => {
  const {polkadotProviderStore, validatorsStore} = useStore().widgetStore.stakingStore;
  const {
    channel,
    calculateFee,
    transactionFee,
    bondExtrinsics,
    unbondExtrinsics,
    withdrawUnbondedExtrinsics,
    transactionType,
    transactionSigner
  } = polkadotProviderStore;
  const {selectedValidators} = validatorsStore;
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const deriveExtrinsics = useCallback(() => {
    if (transactionType === StakingTransactionType.Bond) {
      return bondExtrinsics(selectedValidators);
    } else if (transactionType === StakingTransactionType.Unbond) {
      return unbondExtrinsics();
    } else if (transactionType === StakingTransactionType.WithdrawUnbond) {
      return withdrawUnbondedExtrinsics();
    } else {
      return null;
    }
  }, [transactionType, selectedValidators]);

  const previousTabHandler = () => {};

  const formatErrorHandler = (failedExtrinsicData: EventRecord[]) => {
    failedExtrinsicData.forEach(
      ({
        event: {
          data: [error, info]
        }
      }) => {
        if ((error as DispatchError).isModule) {
          const decoded = channel?.registry.findMetaError((error as DispatchError).asModule);
          if (decoded) {
            const {docs, name, section} = decoded;
            setErrorMessage(`${section}.${name} ${docs.join(' ')}`);
          } else {
            setErrorMessage(t('somethingWentWrong'));
          }
        } else {
          setErrorMessage(error.toString());
        }
      }
    );
  };

  const sign = async () => {
    const txBatch = deriveExtrinsics();
    const injector =
      transactionSigner?.meta && (await web3FromSource(transactionSigner?.meta?.source));
    setLoader(true);
    if (transactionSigner) {
      txBatch?.signAndSend(
        transactionSigner?.address,
        {signer: injector?.signer},
        ({status, events}: SubmittableResultValue) => {
          if (status.isInBlock || status.isFinalized) {
            const failedExtrinsicData: EventRecord[] | undefined = events?.filter(({event}) =>
              channel?.events.system.ExtrinsicFailed.is(event)
            );
            const successExtrinsicData = events?.filter(({event}) =>
              channel?.events.system.ExtrinsicSuccess.is(event)
            );

            failedExtrinsicData && formatErrorHandler(failedExtrinsicData);
            successExtrinsicData && successExtrinsicData.length && setSuccessMessage(true);
          }
        }
      );
    }
  };

  useEffect(() => {
    const txBatch = deriveExtrinsics();
    txBatch && calculateFee(txBatch);
  }, [calculateFee, selectedValidators, deriveExtrinsics]);

  return (
    <styled.Container theme={theme}>
      {transactionType === StakingTransactionType.Bond && <BondDetails />}
      {transactionType === StakingTransactionType.Unbond && <UnbondDetails />}
      {transactionType === StakingTransactionType.WithdrawUnbond && <WithdrawUnbondDetails />}
      <styled.AuthorizationRow>
        <Text text={t('staking.fee')} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          {transactionFee && (
            <Text
              theme={theme}
              text={t('staking.feeInfo', {fee: transactionFee})}
              size="xxs"
              align="left"
              weight="normal"
            />
          )}
        </styled.CurrentAddress>
      </styled.AuthorizationRow>
      {loader && (
        <div>
          <Loader />
        </div>
      )}
      {successMessage && (
        <Message type="success">
          <Text
            text={t('staking.signedSuccess')}
            isCustom={true}
            weight="normal"
            align="center"
            size="xs"
          />
        </Message>
      )}
      {errorMessage && (
        <styled.ErrorMessageContainer>
          <Message type="danger">
            <Text text={errorMessage} isCustom={true} weight="normal" align="center" size="xs" />
          </Message>
        </styled.ErrorMessageContainer>
      )}
      <styled.ButtonContainer>
        <Button
          variant="primary"
          label={t('back')}
          icon="lightningDuotone"
          wide={false}
          onClick={previousTabHandler}
        />
        <Button
          variant="primary"
          label={t('staking.signAndSubmit')}
          disabled={!transactionFee || loader || successMessage}
          icon="lightningDuotone"
          wide={false}
          onClick={sign}
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export default observer(Authorization);
