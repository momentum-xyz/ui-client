import React, {FC, useCallback, useEffect, useState} from 'react';
import {formatBalance} from '@polkadot/util';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
import {web3FromSource} from '@polkadot/extension-dapp';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {SubmittableResultValue} from '@polkadot/api-base/types/submittable';
import {DispatchError, EventRecord} from '@polkadot/types/interfaces';

import {Message, PropsWithThemeInterface, Text, Button, Heading, Dropdown, Loader} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {inputToBN} from 'core/utils';

import * as styled from './Authorization.styled';

interface AuthorizationProps extends PropsWithThemeInterface {}

const Authorization: FC<AuthorizationProps> = ({theme}) => {
  const {polkadotProviderStore, validatorsStore} = useStore().widgetStore.stakingStore;
  const {
    stashAccount,
    channel,
    chainDecimals,
    tokenSymbol,
    paymentDestination,
    stakingAmount,
    controllerAccount
  } = polkadotProviderStore;
  const {selectedValidators, selectedValidatorsOptions} = validatorsStore;
  const [fee, setFee] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [controllerChanged, setControllerChanged] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const txBatch = async () => {
    const txBatched: Array<SubmittableExtrinsic | undefined> = [];
    const amountBN = inputToBN(stakingAmount, chainDecimals, tokenSymbol);

    if (stashAccount?.address === controllerAccount?.address) {
      txBatched.push(channel?.tx.staking.bond(stashAccount?.address, amountBN, paymentDestination));
      txBatched.push(channel?.tx.staking.nominate(selectedValidators));
    } else if (stashAccount?.address !== controllerAccount?.address) {
      txBatched.push(channel?.tx.staking.bond(stashAccount?.address, amountBN, paymentDestination));
      txBatched.push(channel?.tx.staking.setController(controllerAccount?.address));
      txBatched.push(channel?.tx.staking.nominate(selectedValidators));
      setControllerChanged(true);
    }

    return channel?.tx.utility.batchAll(txBatched);
  };

  const calculateFee = useCallback(async () => {
    setDisableBtn(true);

    const batched = await txBatch();
    const calculatedFee = stashAccount && (await batched?.paymentInfo(stashAccount?.address));
    const feeFormatted = formatBalance(calculatedFee?.partialFee, {withSiFull: true}, 12);
    setFee(feeFormatted);

    setDisableBtn(false);
  }, [stashAccount]);

  const sign = async (txBatch: SubmittableExtrinsic | undefined) => {
    const injector = stashAccount?.meta && (await web3FromSource(stashAccount?.meta?.source));
    setDisableBtn(true);
    setLoader(true);
    if (stashAccount) {
      txBatch?.signAndSend(
        stashAccount?.address,
        {signer: injector?.signer},
        ({status, events}: SubmittableResultValue) => {
          if (status.isInBlock || status.isFinalized) {
            const failedExtrinsicData: EventRecord[] | undefined = events?.filter(({event}) =>
              channel?.events.system.ExtrinsicFailed.is(event)
            );

            if (failedExtrinsicData) {
              failedExtrinsicData.forEach(
                ({
                  event: {
                    data: [error, info]
                  }
                }) => {
                  if ((error as DispatchError).isModule) {
                    const decoded = channel?.registry.findMetaError(
                      (error as DispatchError).asModule
                    );
                    if (decoded) {
                      const {docs, name, section} = decoded;
                      setErrorMessage(`${section}.${name} ${docs.join(' ')}`);
                    } else {
                      setErrorMessage(t('somethingWentWrong'));
                    }
                    setLoader(false);
                  } else {
                    setLoader(false);
                    setErrorMessage(error.toString());
                  }
                }
              );
            }

            const successData = events?.filter(({event}) =>
              channel?.events.system.ExtrinsicSuccess.is(event)
            );
            if (successData && successData.length) {
              console.log(successData);
              setSuccessMessage(true);
              setLoader(false);
            }
          }
        }
      );
    }
  };

  const signAndBond = async () => {
    setDisableBtn(true);
    const batched = await txBatch();
    await sign(batched);
  };

  useEffect(() => {
    calculateFee();
  }, []);

  return (
    <styled.Container theme={theme}>
      <Heading type="h2" align="left" weight="bold" label={t('staking.transactionCalls')} />
      <styled.AuthorizationRow>
        <Text text={t('staking.bond')} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          <Text text={`${stakingAmount} ${tokenSymbol}`} size="xs" align="left" />
        </styled.CurrentAddress>
      </styled.AuthorizationRow>
      {selectedValidators.length > 0 && (
        <styled.AuthorizationRow>
          <Text text={t('staking.nominateCall')} size="xs" weight="bold" transform="uppercase" />
          <styled.CurrentAddress>
            <Dropdown
              placeholder={t('staking.selectedNominees')}
              value={selectedValidatorsOptions[0].value}
              options={selectedValidatorsOptions}
              onOptionSelect={() => void 0}
              variant="secondary"
            />
          </styled.CurrentAddress>
        </styled.AuthorizationRow>
      )}
      {controllerChanged && (
        <styled.AuthorizationRow>
          <Text text={t('staking.setController')} size="xs" weight="bold" transform="uppercase" />
          <styled.CurrentAddress>
            <Text text={`${controllerAccount?.address || ''}`} size="xs" align="left" />
          </styled.CurrentAddress>
        </styled.AuthorizationRow>
      )}
      <Heading type="h2" align="left" weight="bold" label={t('staking.sendingFrom')} />
      <styled.AuthorizationRow>
        <Text text={stashAccount?.meta?.name || ''} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          <Text text={stashAccount?.address || ''} size="xs" align="left" />
        </styled.CurrentAddress>
      </styled.AuthorizationRow>
      <styled.AuthorizationRow>
        <Text text={t('staking.fee')} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          {fee && (
            <Text
              theme={theme}
              text={t('staking.feeInfo', {fee: `${fee}`})}
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
        <Message type="danger">
          <Text text={errorMessage} isCustom={true} weight="normal" align="center" size="xs" />
        </Message>
      )}
      <styled.ButtonContainer>
        <Button
          variant="primary"
          label={fee ? t('staking.signAndSubmit') : t('staking.nominateAndBond')}
          disabled={disableBtn || successMessage || !!errorMessage}
          icon="lightningDuotone"
          wide={false}
          onClick={signAndBond}
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export default observer(Authorization);
