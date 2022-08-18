import React, {FC, useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';

import {Dialog, Input, Text, SearchDropdown, Loader, useDebouncedCallback} from 'ui-kit';
import {TokenRuleFormInterface} from 'api';
import {useStore} from 'shared/hooks';
import {TokenItemModelInterface} from 'core/models';

import * as styled from './TokenRuleForm.styled';

interface PropsInterface {}

const TokenRuleForm: FC<PropsInterface> = () => {
  const theme = useTheme();
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {tokenRulesStore, tokenRuleFormDialog, space, tokenFormDialog} = spaceManagerStore;
  const {tokenRuleFormStore, tokenFormStore} = tokenRulesStore;
  const [isFocused, setIsFocused] = useState(false);
  const [token, setToken] = useState<string>('');
  const [isDisabledTokenName, setIsDisabledTokenName] = useState(true);
  const [isDisabledTokenRule, setIsDisabledTokenRule] = useState(true);
  const [isDisabledMinBalance, setIsDisabledMinBalance] = useState(true);

  const {
    control,
    setValue,
    formState: {errors},
    handleSubmit
  } = useForm<TokenRuleFormInterface>();

  useEffect(() => {
    if (space && tokenRuleFormStore.tokenRuleFormRequest.isDone) {
      tokenRulesStore.fetchTokenRules(space.id);
    }
  }, [tokenRuleFormStore.tokenRuleFormRequest.state]);

  useEffect(() => {
    if (tokenFormStore.createTokenDone && tokenFormStore.acceptedToken) {
      setToken(tokenFormStore.acceptedToken?.name);
      setValue('tokenId', tokenFormStore.acceptedToken?.id);
      setIsDisabledTokenRule(false);
    }
  }, [tokenFormStore.tokenCreateRequest.state]);

  const handleSelectToken = (token: TokenItemModelInterface) => {
    setValue('tokenId', token.id);
    setIsDisabledTokenRule(false);
    setIsFocused(false);
    setToken(token.name);
  };

  const formSubmitHandler: SubmitHandler<TokenRuleFormInterface> = (
    data: TokenRuleFormInterface
  ) => {
    if (space) {
      tokenRuleFormStore.createTokenRule(data, space.id);
    }
  };

  const handleClose = () => {
    tokenRuleFormDialog.close();
    tokenRuleFormStore.resetModel();
  };

  const handleClickOnButton = () => {
    tokenFormDialog.open();
    setIsFocused(false);
  };

  const debouncedSearch = useDebouncedCallback((query: string) => {
    tokenFormStore.searchToken(query);
  }, 500);

  const handleSearchTokens = (value: string) => {
    setIsDisabledTokenRule(true);
    tokenFormStore.hideResults();
    if (value.length > 1) {
      tokenFormStore.searchRequest.cancel();
      debouncedSearch(value);
    } else if (value.length < 2) {
      debouncedSearch('');
    }
  };

  return (
    <Dialog
      theme={theme}
      title={t('tokenRules.tokenRuleForm.title')}
      showCloseButton
      onClose={handleClose}
      approveInfo={{
        title: tokenRuleFormStore.tokenRuleCreated
          ? 'Okay'
          : t('tokenRules.tokenRuleForm.submitButtonLabel'),
        onClick: tokenRuleFormStore.tokenRuleCreated
          ? handleClose
          : handleSubmit(formSubmitHandler),
        disabled: isDisabledMinBalance || isDisabledTokenName || isDisabledTokenRule
      }}
      icon="check-on"
      iconSize="medium"
      closeOnBackgroundClick={false}
      hasBorder
    >
      {tokenRuleFormStore.tokenRuleCreated ? (
        <styled.Container>
          <Text
            text={t('tokenRules.tokenRuleForm.tokenRuleCreatedSuccessMessage')}
            align="left"
            size="s"
          />
        </styled.Container>
      ) : tokenRuleFormStore.createTokenRuleLoading ? (
        <styled.LoaderContainer>
          <Loader />
        </styled.LoaderContainer>
      ) : (
        <styled.Container className="noScrollIndicator" data-testid="TokenRuleForm-test">
          <styled.Div>
            <styled.TextItem>
              <Text text={t('tokenRules.tokenRuleForm.description')} size="s" align="left" />
            </styled.TextItem>
            <styled.Item>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    onChange={(value) => {
                      if (value === '') {
                        setIsDisabledTokenName(true);
                      } else {
                        setIsDisabledTokenName(false);
                      }
                      onChange(value);
                    }}
                    label={t('tokenRules.tokenRuleForm.tokenRuleNameLabel')}
                    placeholder={t('tokenRules.tokenRuleForm.tokenRuleNamePlaceholder')}
                    isCustom
                    isError={!!errors.name}
                  />
                )}
                rules={{required: true}}
              />
            </styled.Item>
            <SearchDropdown
              setIsFocused={setIsFocused}
              data={tokenFormStore.results.slice()}
              ButtonLabel={t('tokenRules.tokenRuleForm.addLabelButton')}
              onClick={handleSelectToken}
              value={token}
              isFocused={isFocused}
              setValue={setToken}
              search={handleSearchTokens}
              searchInputLabel={t('tokenRules.tokenRuleForm.searchInputLabel')}
              searchInputPlaceholder={t('tokenRules.tokenRuleForm.searchInputPlaceholder')}
              onButtonClick={handleClickOnButton}
            />
            <styled.BalanceItem>
              <Controller
                name="minBalance"
                control={control}
                render={({field: {onChange, value}}) => (
                  <Input
                    value={value}
                    onChange={(value) => {
                      if (value === '') {
                        setIsDisabledMinBalance(true);
                      } else {
                        setIsDisabledMinBalance(false);
                      }
                      onChange(value);
                    }}
                    label={t('tokenRules.tokenRuleForm.minimumBalanceLabel')}
                    placeholder={t('tokenRules.tokenRuleForm.minimumBalancePlaceholder')}
                    isCustom
                    type="number"
                    isError={!!errors.minBalance}
                  />
                )}
                rules={{required: true}}
              />
            </styled.BalanceItem>
          </styled.Div>
        </styled.Container>
      )}
    </Dialog>
  );
};

export default observer(TokenRuleForm);
