import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {Menu, Setting, TokenRuleReview, TokenRules} from './components';

const ProfileMenuWidget: FC = () => {
  const {widgetStore_OLD} = useStore();
  const {profileMenuStore} = widgetStore_OLD;
  const {tokenRulesStore} = profileMenuStore;

  const handleCloseTokenRuleReview = () => {
    tokenRulesStore.tokenRuleReviewDialog.close();
    tokenRulesStore.fetchTokenRules();
  };

  return (
    <>
      {profileMenuStore.menuDialog.isOpen && <Menu />}
      {profileMenuStore.settingDialog.isOpen && <Setting />}
      {profileMenuStore.tokenRulesDialog.isOpen && <TokenRules />}
      {tokenRulesStore.tokenRuleReviewDialog.isOpen && (
        <TokenRuleReview onClose={handleCloseTokenRuleReview} />
      )}
    </>
  );
};

export default observer(ProfileMenuWidget);
