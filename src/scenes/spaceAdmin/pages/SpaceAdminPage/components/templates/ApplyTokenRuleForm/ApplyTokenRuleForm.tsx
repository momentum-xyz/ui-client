import {useTheme} from 'styled-components';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {ApplyTokenRuleInterface} from 'api';
import {useStore} from 'shared/hooks';
import {
  Dialog,
  Dropdown,
  Heading,
  Loader,
  SearchDropdown,
  Text,
  useDebouncedCallback
} from 'ui-kit';
import {TokenRuleItemModelInterface} from 'core/models';
import {TokenRuleRoles} from 'core/enums';

import * as styled from './ApplyTokenRuleForm.styled';

interface PropsInterface {}

const ApplyTokenRuleForm: FC<PropsInterface> = () => {
  const theme = useTheme();
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {
    applyTokenRuleFormDialog,
    applyTokenRuleStore,
    tokenRuleFormDialog,
    spaceStore,
    tokenRulesListStore
  } = spaceManagerStore;
  const [isFocused, setIsFocused] = useState(false);
  const [tokenRule, setTokenRule] = useState<string>('');
  const [selectedTokenRule, setSelectedTokenRule] = useState<TokenRuleItemModelInterface>();
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [isDisabledDropdown, setIsDisabledDropdown] = useState(true);

  const {
    control,
    setValue,
    // formState: {errors},
    handleSubmit,
    reset
  } = useForm<ApplyTokenRuleInterface>();

  const formSubmitHandler: SubmitHandler<ApplyTokenRuleInterface> = ({role, tokenGroupUserId}) => {
    if (spaceStore.space.id) {
      applyTokenRuleStore.applyTokenRule(
        tokenGroupUserId,
        role === TokenRuleRoles.ADMIN,
        spaceStore.space.id
      );
    }
  };

  const debouncedSearch = useDebouncedCallback((query: string) => {
    applyTokenRuleStore.search(query);
  }, 500);

  const handleClickOnButton = () => {
    tokenRuleFormDialog.open();
  };

  const handleClose = () => {
    reset();
    applyTokenRuleFormDialog.close();
    tokenRulesListStore.fetchTokenRules(spaceStore.space.id);
    applyTokenRuleStore.resetModel();
  };

  const handleSelectTokenRule = (item: TokenRuleItemModelInterface) => {
    setSelectedTokenRule(item);
    setTokenRule(item.name);
    setValue('tokenGroupUserId', item.id);
    setIsFocused(false);
    setIsDisabledButton(false);
  };

  const handleSearchTokenRules = (value: string) => {
    if (selectedTokenRule) {setSelectedTokenRule(undefined);}
    if (!isDisabledButton) {setIsDisabledButton(true);}
    if (value.length > 1) {
      applyTokenRuleStore.searchRequest.cancel();
      debouncedSearch(value);
    } else if (value.length < 2) {
      debouncedSearch('');
      setSelectedTokenRule(undefined);
    }
  };

  return (
    <Dialog
      theme={theme}
      title={t('tokenRules.applyTokenRuleForm.title')}
      showCloseButton
      onClose={applyTokenRuleFormDialog.close}
      approveInfo={{
        title: applyTokenRuleStore.tokenRuleApplied
          ? t('tokenRules.applyTokenRuleForm.succeedButtonLabel')
          : t('tokenRules.applyTokenRuleForm.submitButtonLabel'),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick: applyTokenRuleStore.tokenRuleApplied
          ? handleClose
          : handleSubmit(formSubmitHandler),
        disabled: isDisabledButton || isDisabledDropdown
      }}
      closeOnBackgroundClick={false}
      icon="check-on"
      iconSize="medium"
    >
      {applyTokenRuleStore.tokenRuleApplied ? (
        <styled.Container>
          <Text
            text={t('tokenRules.applyTokenRuleForm.tokenRuleAppliedSuccessMessage')}
            align="left"
            size="s"
          />
        </styled.Container>
      ) : applyTokenRuleStore.applyPending ? (
        <styled.LoaderContainer>
          <Loader />
        </styled.LoaderContainer>
      ) : (
        <styled.Container className="noScrollIndicator">
          <styled.Div>
            <styled.TextItem>
              <Text text={t('tokenRules.applyTokenRuleForm.description')} size="s" align="left" />
            </styled.TextItem>
            <SearchDropdown
              setIsFocused={setIsFocused}
              data={applyTokenRuleStore.results.slice()}
              ButtonLabel={t('tokenRules.applyTokenRuleForm.addLabelButton')}
              onClick={handleSelectTokenRule}
              value={tokenRule}
              isFocused={isFocused}
              setValue={setTokenRule}
              search={handleSearchTokenRules}
              searchInputLabel={t('tokenRules.applyTokenRuleForm.searchInputLabel')}
              searchInputPlaceholder={t('tokenRules.applyTokenRuleForm.searchInputPlaceholder')}
              onButtonClick={handleClickOnButton}
            />
            <styled.DropDownContainer>
              <Heading type="h4" align="left" label="member role" transform="uppercase" isCustom />
              <Controller
                name="role"
                control={control}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    placeholder={t('tokenRules.applyTokenRuleForm.dropdown.placeholder')}
                    value={value}
                    options={[
                      {
                        label: t('tokenRules.memberLabel'),
                        value: TokenRuleRoles.MEMBER
                      },
                      {
                        label: t('tokenRules.adminLabel'),
                        value: TokenRuleRoles.ADMIN
                      }
                    ]}
                    onOptionSelect={(option) => {
                      onChange(option.value);
                      if (isDisabledDropdown) {setIsDisabledDropdown(false);}
                    }}
                    variant="secondary"
                  />
                )}
              />
            </styled.DropDownContainer>
            {selectedTokenRule && (
              <styled.BottomContainer>
                <styled.HeadingItem>
                  <Heading
                    type="h2"
                    align="left"
                    label={selectedTokenRule?.name}
                    transform="capitalized"
                    isCustom
                  />
                </styled.HeadingItem>
                <styled.TokenDetailGrid>
                  <styled.GridItem>
                    <Heading
                      type="h5"
                      label={t('tokenRules.applyTokenRuleForm.selectedTokenTypeLabel')}
                      weight="bold"
                      isCustom
                      align="right"
                      transform="uppercase"
                    />
                    <styled.TextWrapper>
                      <Text
                        text={selectedTokenRule?.tokenType ?? ''}
                        size="s"
                        transform="uppercase"
                        isCustom
                        align="left"
                      />
                    </styled.TextWrapper>
                  </styled.GridItem>
                  <styled.GridItem>
                    <Heading
                      type="h5"
                      label={t('tokenRules.applyTokenRuleForm.selectedTokenNetworkLabel')}
                      weight="bold"
                      isCustom
                      align="right"
                      transform="uppercase"
                    />
                    <styled.TextWrapper>
                      <Text
                        text={selectedTokenRule?.network ?? ''}
                        size="s"
                        transform="uppercase"
                        isCustom
                        align="left"
                      />
                    </styled.TextWrapper>
                  </styled.GridItem>
                  <styled.GridItem>
                    <Heading
                      type="h5"
                      label={t('tokenRules.applyTokenRuleForm.selectedTokenAddressLabel')}
                      weight="bold"
                      isCustom
                      align="right"
                      transform="uppercase"
                    />
                    <styled.TextWrapper>
                      <Text
                        text={selectedTokenRule?.contractAddress ?? ''}
                        size="s"
                        transform="uppercase"
                        isCustom
                        align="left"
                      />
                    </styled.TextWrapper>
                  </styled.GridItem>
                  <styled.GridItem>
                    <Heading
                      type="h5"
                      label={t('tokenRules.applyTokenRuleForm.selectedTokenMinBalanceLabel')}
                      weight="bold"
                      isCustom
                      align="right"
                      transform="uppercase"
                    />
                    <styled.TextWrapper>
                      <Text
                        text={selectedTokenRule?.minBalance?.toString() ?? ''}
                        size="s"
                        transform="uppercase"
                        isCustom
                        align="left"
                      />
                    </styled.TextWrapper>
                  </styled.GridItem>
                </styled.TokenDetailGrid>
              </styled.BottomContainer>
            )}
          </styled.Div>
        </styled.Container>
      )}
    </Dialog>
  );
};

export default observer(ApplyTokenRuleForm);
