import React, {FC} from 'react';
import {useHistory} from 'react-router';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {PanelLayout, Text, TopBar} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {TokenRuleReviewWidget} from 'scenes/widgets/pages';
import {ROUTES} from 'core/constants';

import * as styled from './SpaceAdminPage.styled';
import {
  SpaceDetailsPanel,
  TokenRuleForm,
  SpaceMembersPanel,
  SubSpacesPanel,
  TokenRulesPanel,
  TokenForm,
  ApplyTokenRuleForm
} from './components';

const SpaceAdminPage: FC = () => {
  const history = useHistory();
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {
    tokenRuleReviewDialog,
    spaceStore,
    tokenRuleFormDialog,
    tokenFormDialog,
    tokenRuleReviewStore,
    applyTokenRuleFormDialog
  } = spaceManagerStore;

  const handleClose = () => {
    history.push(ROUTES.collaboration);
  };

  return (
    <styled.Container>
      <TopBar
        title={spaceStore?.space.name ?? ''}
        subtitle={t('spaceAdmin.subtitle')}
        onClose={handleClose}
      />
      <styled.Body>
        {spaceStore.isAdmin ? (
          <>
            <SpaceDetailsPanel />
            <TokenRulesPanel />
            <SpaceMembersPanel />
            {spaceStore.allowedSpaceTypes.length > 0 && <SubSpacesPanel />}
          </>
        ) : (
          <styled.NoAccess>
            <PanelLayout isCustom>
              <Text isCustom text={t('spaceAdmin.noAccess')} size="l" />
            </PanelLayout>
          </styled.NoAccess>
        )}
      </styled.Body>
      {tokenRuleReviewDialog.isOpen && (
        <TokenRuleReviewWidget
          tokenRuleReviewStore={tokenRuleReviewStore}
          onClose={tokenRuleReviewDialog.close}
        />
      )}
      {tokenRuleFormDialog.isOpen && <TokenRuleForm onClose={tokenRuleFormDialog.close} />}
      {tokenFormDialog.isOpen && <TokenForm />}
      {applyTokenRuleFormDialog.isOpen && <ApplyTokenRuleForm />}
    </styled.Container>
  );
};

export default observer(SpaceAdminPage);
