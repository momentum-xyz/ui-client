import React, {FC} from 'react';
import {useNavigate} from 'react-router';
import {observer} from 'mobx-react-lite';
import {PageTopBar} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import * as styled from './SpaceAdminPage.styled';
import {
  SpaceDetailsPanel,
  ManageEmojiPanel,
  TokenRuleForm,
  SpaceMembersPanel,
  SubSpacesPanel,
  TokenRulesPanel,
  TokenForm,
  ApplyTokenRuleForm,
  ManagePluginPanel
} from './components';

const SpaceAdminPage: FC = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {space, tokenRuleFormDialog, tokenFormDialog, applyTokenRuleFormDialog} = spaceManagerStore;

  const handleClose = () => {
    // @ts-ignore
    if (navigate.location.state?.canGoBack) {
      navigate(-1);
    } else {
      navigate(ROUTES.base);
    }
  };

  if (!space) {
    return null;
  }

  return (
    <styled.Container data-testid="SpaceAdminPage-test">
      <PageTopBar
        title={space?.name ?? ''}
        subtitle={t('spaceAdmin.subtitle')}
        onClose={handleClose}
      />
      <styled.Body>
        {space.isAdmin ? (
          <>
            <styled.VerticalSplit className="noScrollIndicator">
              <SpaceDetailsPanel />
              <styled.SmallPanel>
                <ManageEmojiPanel />
              </styled.SmallPanel>
            </styled.VerticalSplit>
            <TokenRulesPanel />
            <SpaceMembersPanel />
            {space.allowedSpaceTypes.length > 0 && <SubSpacesPanel />}
            <ManagePluginPanel />
          </>
        ) : (
          <styled.NoAccess>
            <styled.NoAccessPanel>
              <styled.NoAccessPanelText text={t('spaceAdmin.noAccess')} size="l" />
            </styled.NoAccessPanel>
          </styled.NoAccess>
        )}
      </styled.Body>
      {tokenRuleFormDialog.isOpen && <TokenRuleForm />}
      {tokenFormDialog.isOpen && <TokenForm />}
      {applyTokenRuleFormDialog.isOpen && <ApplyTokenRuleForm />}
    </styled.Container>
  );
};

export default observer(SpaceAdminPage);
