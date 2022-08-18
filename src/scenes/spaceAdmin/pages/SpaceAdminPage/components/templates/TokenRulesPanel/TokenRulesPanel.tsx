import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {SectionPanel, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {EditTokenRuleDialog, RemoveTokenRuleDialog, TokenRuleListItem} from './components';
import * as styled from './TokenRulesPanel.styled';

interface PropsInterface {}

const TokenRulesPanel: FC<PropsInterface> = () => {
  const {spaceManagerStore} = useStore().spaceAdminStore;
  const {
    applyTokenRuleFormDialog,
    tokenRuleReviewStore,
    editTokenRuleDialog,
    removeTokenRuleDialog,
    tokenRulesListStore,
    space
  } = spaceManagerStore;
  const {tokenRules, fetchTokenRules} = tokenRulesListStore;

  const [selectedTokenRule, setSelectedTokenRule] = useState<{
    id: string;
    isAdmin?: boolean;
    name?: string;
  }>();

  const handleAddTokenRule = () => {
    applyTokenRuleFormDialog.open();
  };

  const handleEdit = (id: string, type?: string) => {
    setSelectedTokenRule({id: id, isAdmin: type === 'admin'});
    editTokenRuleDialog.open();
  };
  const handleDelete = (tokenRuleId: string, name: string) => {
    setSelectedTokenRule({id: tokenRuleId, name: name});
    removeTokenRuleDialog.open();
  };

  const removeTokenRule = useCallback(async (tokenRuleId: string) => {
    const isSuccess = await tokenRuleReviewStore.deleteTokenRule(tokenRuleId);
    if (isSuccess) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleSuccess', {action: t('actions.deleting')})}
          isCloseButton
        />
      );
      removeTokenRuleDialog.close();
      fetchTokenRules(space?.id);
    } else {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleFailure', {action: t('actions.deleting')})}
          isCloseButton
        />
      );
      removeTokenRuleDialog.close();
    }
  }, []);

  return (
    <SectionPanel
      title={t('spaceAdmin.sectionPanel.tokenRulesPanel')}
      isCustom
      onAdd={handleAddTokenRule}
    >
      {removeTokenRuleDialog.isOpen && (
        <RemoveTokenRuleDialog
          userName={selectedTokenRule?.name ?? ''}
          /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
          onConfirmation={removeTokenRule}
          tokenRuleId={selectedTokenRule?.id ?? ''}
          onClose={removeTokenRuleDialog.close}
        />
      )}
      {editTokenRuleDialog.isOpen && (
        <EditTokenRuleDialog
          tokenGroupUserId={selectedTokenRule?.id ?? ''}
          isAdmin={selectedTokenRule?.isAdmin ?? false}
          onClose={editTokenRuleDialog.close}
        />
      )}
      <styled.Container className="noScrollIndicator" data-testid="TokenRulesPanel-test">
        {tokenRules.map((tokenRule) => (
          <TokenRuleListItem
            key={tokenRule.id}
            name={tokenRule.name}
            type="member"
            tokenRuleId={tokenRule.id}
            tokenGroupUserId={tokenRule.tokenGroupUserId}
            onEdit={handleEdit}
            onRemove={handleDelete}
          />
        ))}
      </styled.Container>
    </SectionPanel>
  );
};

export default observer(TokenRulesPanel);
