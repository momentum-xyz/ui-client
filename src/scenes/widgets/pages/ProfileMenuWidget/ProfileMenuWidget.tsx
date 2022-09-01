import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {Menu, Setting, TokenRuleReview, TokenRules} from './components';

interface PropsInterface {
  isWorldBuilder?: boolean;
}

const ProfileMenuWidget: FC<PropsInterface> = ({isWorldBuilder = false}) => {
  const {widgetStore} = useStore();
  const {profileMenuStore} = widgetStore;
  const {tokenRulesStore} = profileMenuStore;

  const handleCloseTokenRuleReview = () => {
    tokenRulesStore.tokenRuleReviewDialog.close();
    tokenRulesStore.fetchTokenRules();
  };

  return (
    <>
      {profileMenuStore.menuDialog.isOpen && <Menu isWorldBuilder={isWorldBuilder} />}
      {profileMenuStore.settingDialog.isOpen && <Setting />}
      {profileMenuStore.tokenRulesDialog.isOpen && <TokenRules />}
      {tokenRulesStore.tokenRuleReviewDialog.isOpen && (
        <TokenRuleReview onClose={handleCloseTokenRuleReview} />
      )}
    </>
  );
};

export default observer(ProfileMenuWidget);
