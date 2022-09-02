import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {Dialog, useDebouncedEffect} from 'ui-kit';
import {TokenRuleListHeader} from 'core/enums';
import {TokenRuleItemModelInterface} from 'core/models';

import * as styled from './TokenRules.styled';
import {TokenRulesList} from './components';

const TokenRules: FC = () => {
  const {widgetStore} = useStore();
  const {profileMenuStore} = widgetStore;
  const {tokenRulesStore} = profileMenuStore;
  const [query, setQuery] = useState('');

  useEffect(() => {
    return () => {
      tokenRulesStore.resetModel();
    };
  }, [tokenRulesStore]);

  useDebouncedEffect(
    () => {
      tokenRulesStore.fetchTokenRules(undefined, query !== '' ? query : undefined);
    },
    500,
    [query]
  );

  const handleTokenRuleReview = (tokenRule: TokenRuleItemModelInterface) => {
    tokenRulesStore.reviewTokenRule(tokenRule);
  };

  const handleClose = () => {
    profileMenuStore.tokenRulesDialog.close();
    profileMenuStore.menuDialog.open();
  };

  return (
    <Dialog
      position="center"
      title={t('tokenRules.overview.title')}
      icon="whitelist"
      iconSize="medium-large"
      onClose={handleClose}
      closeOnBackgroundClick={false}
      layoutSize={{height: '66vh'}}
      isBodyExtendingToEdges
      showBackground={false}
      showCloseButton
    >
      <styled.Body data-testid="TokenRules-test">
        <styled.TokenRuleSearch
          value={query}
          onChange={setQuery}
          placeholder={t('placeholders.search')}
          withBackground
        />
        <TokenRulesList
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

export default observer(TokenRules);
