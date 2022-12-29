import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {Dialog, useDebouncedEffect} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {TokenRuleListHeaderEnum} from 'core/enums';
import {TokenRuleItemModelInterface} from 'core/models';

import * as styled from './TokenRules.styled';
import {TokenRulesList} from './components';

const TokenRules: FC = () => {
  const {widgetsStore} = useStore();
  const {profileMenuStore} = widgetsStore;
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
            {key: TokenRuleListHeaderEnum.ICON, sortable: false, isSmall: true},
            {key: TokenRuleListHeaderEnum.NAME, label: t('tokenRules.ruleName'), sortable: true},
            {key: TokenRuleListHeaderEnum.STATUS, label: t('tokenRules.status'), sortable: true},
            {key: TokenRuleListHeaderEnum.INFO, sortable: false, isSmall: true}
          ]}
          onEventClick={handleTokenRuleReview}
        />
      </styled.Body>
    </Dialog>
  );
};

export default observer(TokenRules);
