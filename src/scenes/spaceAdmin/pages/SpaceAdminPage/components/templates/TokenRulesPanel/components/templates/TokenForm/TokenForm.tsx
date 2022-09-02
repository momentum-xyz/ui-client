import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {useTheme} from 'styled-components';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';

import {Dialog, Dropdown, Heading, Input, Loader, Text} from 'ui-kit';
import {TokenFormInterface} from 'api';
import {useStore} from 'shared/hooks';

import * as styled from './TokenForm.styled';

interface PropsInterface {}

const TokenForm: FC<PropsInterface> = () => {
  const theme = useTheme();
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {space, tokenFormDialog, tokenRulesStore} = spaceManagerStore;
  const {tokenFormStore} = tokenRulesStore;
  const {
    control,
    setValue,
    formState: {errors},
    handleSubmit,
    clearErrors,
    watch,
    reset
  } = useForm<TokenFormInterface>();
  const [isTokenId, setIsTokenId] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledType, setIsDisabledType] = useState(true);
  const [isDisabledID, setIsDisabledID] = useState(true);

  useEffect(() => {
    return () => {
      tokenFormStore.resetModel();
      tokenFormStore.fetchTokens();
    };
  }, []);

  useEffect(() => {
    if (tokenFormStore.fetchTokenNameDone) {
      setValue('tokenName', tokenFormStore.tokenName);
      setIsDisabled(false);
    }
  }, [tokenFormStore.tokenNameRequest.state]);

  const formSubmitHandler: SubmitHandler<TokenFormInterface> = (data: TokenFormInterface) => {
    if (space) {
      tokenFormStore.createToken(data);
    }
  };

  const handleTokenFetch = (contractAddress: string) => {
    const networkSelected = watch('network');
    if (contractAddress.match(/^0x[a-fA-F0-9]{40}$/) && networkSelected) {
      clearErrors('tokenName');
      tokenFormStore.fetchTokenName(networkSelected, contractAddress);
    }
  };

  const handleSelectNetwork = (network: string) => {
    const contractAddress = watch('contractAddress');
    if (contractAddress.match(/^0x[a-fA-F0-9]{40}$/) && network) {
      setValue('tokenName', tokenFormStore.tokenName);
      clearErrors('tokenName');
      tokenFormStore.fetchTokenName(network, contractAddress);
    }
  };

  const handleClose = () => {
    reset();
    tokenFormDialog.close();

    return () => {
      tokenFormStore.resetModel();
      tokenFormStore.fetchTokens();
    };
  };

  return (
    <Dialog
      theme={theme}
      title={t('tokenRules.tokenForm.title')}
      showCloseButton
      onClose={tokenFormDialog.close}
      approveInfo={{
        title: tokenFormStore.createTokenDone
          ? 'Okay'
          : t('tokenRules.tokenForm.submitButtonLabel'),
        // 'tokenRuleFormStore.tokenRuleCreated' ? 'handleClose' :
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick: tokenFormStore.createTokenDone ? handleClose : handleSubmit(formSubmitHandler),
        disabled: isDisabled || isDisabledType || (!isTokenId && isDisabledID)
      }}
      closeOnBackgroundClick={false}
      icon="check-on"
      iconSize="medium"
      hasBorder
    >
      {tokenFormStore.createTokenDone ? (
        <styled.Container>
          <Text text={t('tokenRules.tokenForm.tokenCreatedSuccessMessage')} align="left" size="s" />
        </styled.Container>
      ) : tokenFormStore.fetchTokenNameLoading || tokenFormStore.createTokenLoading ? (
        <styled.LoaderContainer>
          <Loader />
        </styled.LoaderContainer>
      ) : (
        <styled.Container className="noScrollIndicator" data-testid="TokenForm-test">
          <styled.Div>
            <styled.TextItem>
              <Text text={t('tokenRules.tokenForm.description')} size="s" align="left" />
            </styled.TextItem>
            <styled.DropDownContainer>
              <styled.DropdownLabel
                type="h4"
                align="left"
                label={t('tokenRules.tokenForm.tokenTypeLabel')}
                transform="uppercase"
              />
              <Controller
                name="tokenType"
                control={control}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    placeholder={t('tokenRules.tokenForm.tokenTypePlaceholder')}
                    value={value}
                    options={tokenRulesStore.types}
                    onOptionSelect={(value) => {
                      setIsDisabledType(false);
                      onChange(value.value);
                      if (value.value === 'erc1155') {
                        setIsTokenId(false);
                      } else {
                        setValue('tokenID', '');
                        setIsTokenId(true);
                        clearErrors('tokenID');
                      }
                    }}
                    variant="secondary"
                    isError={!!errors.tokenType}
                  />
                )}
                rules={{required: true}}
              />
            </styled.DropDownContainer>
            <styled.Item>
              <Controller
                name="tokenID"
                control={control}
                defaultValue=""
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    onChange={(value) => {
                      if (value === '') {
                        setIsDisabledID(true);
                      } else {
                        setIsDisabledID(false);
                      }
                      onChange(value);
                    }}
                    label={t('tokenRules.tokenForm.tokenIDLabel')}
                    placeholder={t('tokenRules.tokenForm.tokenIDPlaceholder')}
                    disabled={isTokenId}
                    isError={!!errors.tokenID}
                  />
                )}
                rules={{required: !isTokenId}}
              />
            </styled.Item>
            <styled.DropDownContainer>
              <styled.DropdownLabel
                type="h4"
                align="left"
                label={t('tokenRules.tokenForm.networkLabel')}
                transform="uppercase"
              />
              <Controller
                name="network"
                control={control}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    placeholder={t('tokenRules.tokenForm.networkPlaceholder')}
                    value={value}
                    options={tokenRulesStore.networks}
                    onOptionSelect={(value) => {
                      onChange(value.value);
                      handleSelectNetwork(value.value);
                    }}
                    variant="secondary"
                    isError={!!errors.network}
                  />
                )}
                rules={{required: true}}
              />
            </styled.DropDownContainer>
            <styled.Item>
              <Controller
                name="contractAddress"
                control={control}
                defaultValue=""
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    onChange={(value) => {
                      setIsDisabled(true);
                      onChange(value);
                      setValue('tokenName', '');
                      handleTokenFetch(value);
                    }}
                    label={t('tokenRules.tokenForm.contractAddressLabel')}
                    placeholder={t('tokenRules.tokenForm.contractAddressPlaceholder')}
                    isError={!!errors.contractAddress}
                  />
                )}
                rules={{required: true, pattern: /^0x[a-fA-F0-9]{40}$/}}
              />
            </styled.Item>
            <Controller
              name="tokenName"
              control={control}
              defaultValue=""
              render={({field: {value}}) => (
                <div>
                  <styled.HeadingItem>
                    <Heading type="h4" align="left" label={value} transform="uppercase" />
                  </styled.HeadingItem>
                  {value && (
                    <styled.Item>
                      <Text
                        text={t('tokenRules.tokenForm.tokenSelectedDescription')}
                        size="s"
                        align="left"
                      />
                    </styled.Item>
                  )}
                </div>
              )}
              rules={{required: true}}
            />
            {(!!errors.tokenName || isDisabled) && (
              <styled.ErrorText>
                <Text
                  text={t('tokenRules.tokenForm.tokenNotFilledDescription')}
                  size="s"
                  align="left"
                />
              </styled.ErrorText>
            )}
          </styled.Div>
        </styled.Container>
      )}
    </Dialog>
  );
};

export default observer(TokenForm);
