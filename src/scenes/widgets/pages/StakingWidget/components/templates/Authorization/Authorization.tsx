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
import ChillDetails from './components/ChillDetails/ChillDetails';

interface PropsInterface extends PropsWithThemeInterface {
  goToValidators: () => void;
  goToNominator: () => void;
}

const Authorization: FC<PropsInterface> = ({theme, goToValidators, goToNominator}) => {
  const {polkadotProviderStore, validatorsStore} = useStore().widgetStore.stakingStore;
  const {
    channel,
    calculateFee,
    transactionFee,
    bondExtrinsics,
    unbondExtrinsics,
    withdrawUnbondedExtrinsics,
    transactionType,
    setTransactionFee,
    transactionSigner,
    chillExtrinsics
  } = polkadotProviderStore;
  const {selectedValidators} = validatorsStore;
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const deriveExtrinsics = useCallback(async () => {
    if (transactionType === StakingTransactionType.Bond) {
      return bondExtrinsics(selectedValidators);
    } else if (transactionType === StakingTransactionType.Unbond) {
      return unbondExtrinsics();
    } else if (transactionType === StakingTransactionType.WithdrawUnbond) {
      return await withdrawUnbondedExtrinsics();
    } else if (transactionType === StakingTransactionType.Chill) {
      return chillExtrinsics();
    } else {
      return null;
    }
  }, [transactionType, selectedValidators]);

  const clearTransactionState = () => {
    setTransactionFee('');
    setErrorMessage('');
    setSuccessMessage(false);
  };

  const goBackHandler = () => {
    clearTransactionState();
    transactionType === StakingTransactionType.Bond ? goToValidators() : goToNominator();
  };

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
            setErrorMessage(t('errors.somethingWentWrongTryAgain'));
          }
        } else {
          setErrorMessage(error.toString());
        }
      }
    );
  };

  const sign = async () => {
    const txBatch = await deriveExtrinsics();
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

            if (failedExtrinsicData) {
              setLoader(false);
              formatErrorHandler(failedExtrinsicData);
            }
            if (successExtrinsicData && successExtrinsicData.length) {
              setLoader(false);
              setSuccessMessage(true);
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    deriveExtrinsics().then((txBatch) => {
      txBatch && calculateFee(txBatch);
    });
  }, []);

  return (
    <styled.Container theme={theme} data-testid="Authorization-test">
      {transactionType === StakingTransactionType.Bond && <BondDetails />}
      {transactionType === StakingTransactionType.Unbond && <UnbondDetails />}
      {transactionType === StakingTransactionType.WithdrawUnbond && <WithdrawUnbondDetails />}
      {transactionType === StakingTransactionType.Chill && <ChillDetails />}
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
      <styled.ResponseMessageContainer>
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
          <Message type="danger">
            <Text text={errorMessage} isCustom={true} weight="normal" align="center" size="xs" />
          </Message>
        )}
      </styled.ResponseMessageContainer>
      <styled.ButtonContainer>
        <Button
          variant="primary"
          label={t('actions.back')}
          icon="lightningDuotone"
          wide={false}
          onClick={goBackHandler}
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
