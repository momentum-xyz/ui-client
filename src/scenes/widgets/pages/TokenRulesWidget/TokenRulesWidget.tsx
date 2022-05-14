import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {Dialog, SearchInput, TokenRuleList, useDebouncedEffect} from 'ui-kit';
import {TokenRuleListHeader} from 'core/enums';
import {TokenRuleItemModelInterface} from 'core/models';

import * as styled from './TokenRulesWidget.styled';

const TokenRulesWidget: FC = () => {
  const {widgetStore} = useStore();
  const {tokenRulesStore} = widgetStore;
  const {tokenRulesListStore} = tokenRulesStore;
  const [query, setQuery] = useState('');

  useEffect(() => {
    return tokenRulesListStore.resetModel;
  }, []);

  useDebouncedEffect(
    () => {
      tokenRulesListStore.fetchTokenRules(undefined, query !== '' ? query : undefined);
    },
    500,
    [query]
  );

  const handleTokenRuleReview = (tokenRule: TokenRuleItemModelInterface) => {
    tokenRulesStore.reviewTokenRule(tokenRule);
  };

  return (
    <Dialog
      title={t('tokenRules.overview.title')}
      onClose={tokenRulesStore.widgetDialog.close}
      isBodyExtendingToEdges
      showBackground={false}
      icon="whitelist"
      iconSize="medium-large"
      showCloseButton
      layoutSize={{height: '66vh'}}
      closeOnBackgroundClick={false}
      controlUnityKeyboardControll
    >
      <styled.Body>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={t('placeholders.search')}
          withBackground
          isCustom
        />
        <TokenRuleList
          store={tokenRulesListStore}
          columnHeaders={[
            {key: TokenRuleListHeader.ICON, sortable: false, isSmall: true},
            {key: TokenRuleListHeader.NAME, label: t('tokenRules.ruleName'), sortable: true},
            {key: TokenRuleListHeader.STATUS, label: t('tokenRules.status'), sortable: true},
            {key: TokenRuleListHeader.INFO, sortable: false, isSmall: true}
          ]}
          onEventClick={handleTokenRuleReview}
        />
      </styled.Body>
    </Dialog>
  );
};

export default observer(TokenRulesWidget);
