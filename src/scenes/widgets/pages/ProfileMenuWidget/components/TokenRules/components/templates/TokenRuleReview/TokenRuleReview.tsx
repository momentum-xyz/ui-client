import React, {FC, useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {Dialog, Heading, Text, ToastContent} from 'ui-kit';
import {TokenRuleStatus} from 'core/enums';
import {useStore} from 'shared/hooks';

import * as styled from './TokenRuleReview.styled';

interface PropsInterface {
  onClose: () => void;
}

const TokenRuleReview: FC<PropsInterface> = ({onClose}) => {
  const theme = useTheme();
  const {sessionStore, widgetStore} = useStore();
  const {profileMenuStore} = widgetStore;
  const {tokenRulesStore} = profileMenuStore;
  const {tokenRuleReviewStore} = tokenRulesStore;
  const {currentTokenRule} = tokenRuleReviewStore;
  const {profile} = sessionStore;

  const handleDelete = useCallback(async () => {
    const isSuccess = await tokenRuleReviewStore.delete();
    if (isSuccess) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleSuccess', {action: t('actions.removed')})}
          isCloseButton
        />
      );
      onClose();
    } else {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleFailure', {action: t('actions.removing')})}
          isCloseButton
        />
      );
    }
  }, []);

  const handleApprove = useCallback(async () => {
    const isSuccess = await tokenRuleReviewStore.approve();

    if (isSuccess) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleSuccess', {action: t('actions.approved')})}
          isCloseButton
        />
      );
      onClose();
    } else {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleFailure', {action: t('actions.approving')})}
          isCloseButton
        />
      );
    }
  }, []);

  const handleDecline = useCallback(async () => {
    const isSuccess = await tokenRuleReviewStore.decline();

    if (isSuccess) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleSuccess', {action: t('actions.declined')})}
          isCloseButton
        />
      );
      onClose();
    } else {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tokenRuleFailure', {action: t('actions.declining')})}
          isCloseButton
        />
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      tokenRuleReviewStore.resetModel();
    };
  }, []);

  return (
    <Dialog
      theme={theme}
      title={t('tokenRules.tokenRuleReview.dialogTitle')}
      icon="whitelist"
      iconSize="medium-large"
      subtitle={tokenRuleReviewStore.isWorldList ? currentTokenRule?.name : undefined}
      showCloseButton
      onClose={onClose}
      approveInfo={
        tokenRuleReviewStore.currentTokenRule?.status === TokenRuleStatus.REQUESTED
          ? {
              title: t('actions.approve'),
              onClick: () => {
                handleApprove();
              }
            }
          : currentTokenRule?.canRemove(profile?.uuid)
          ? {
              title: t('actions.removeRule'),
              onClick: () => {
                handleDelete();
              }
            }
          : undefined
      }
      declineInfo={
        tokenRuleReviewStore.currentTokenRule?.status === TokenRuleStatus.REQUESTED
          ? {
              title: t('actions.decline'),
              onClick: () => {
                handleDecline();
              }
            }
          : undefined
      }
      closeOnBackgroundClick={true}
    >
      <styled.Container data-testid="TokenRuleReview-test">
        <styled.Div>
          <styled.TextItem>
            <Text text={t('tokenRules.tokenRuleReview.dialogDescription')} size="s" align="left" />
          </styled.TextItem>

          <styled.HeadingItem>
            <Heading
              type="h2"
              align="left"
              label={currentTokenRule?.name ? currentTokenRule.name : ''}
              transform="capitalized"
            />
          </styled.HeadingItem>
          <styled.TokenDetailGrid>
            <styled.GridItem>
              <styled.TokenRuleTitle
                type="h5"
                label={t('tokenRules.tokenRuleReview.tokenLabel')}
                weight="bold"
                align="right"
                transform="uppercase"
              />
              <styled.TokenRuleDetail
                text={currentTokenRule?.tokenType ? currentTokenRule.tokenType : ''}
                size="s"
                transform="uppercase"
                align="left"
              />
            </styled.GridItem>
            {tokenRuleReviewStore.isWorldList && (
              <styled.GridItem>
                <styled.TokenRuleTitle
                  type="h5"
                  label={t('tokenRules.tokenRuleReview.tokenIdLabel')}
                  weight="bold"
                  align="right"
                  transform="uppercase"
                />
                <styled.TokenRuleDetail
                  text={currentTokenRule?.id}
                  size="s"
                  align="left"
                  transform="normal"
                />
              </styled.GridItem>
            )}
            <styled.GridItem>
              <styled.TokenRuleTitle
                type="h5"
                label={t('tokenRules.tokenRuleReview.networkLabel')}
                weight="bold"
                align="right"
                transform="uppercase"
              />
              <styled.TokenRuleDetail
                text={currentTokenRule?.network ? currentTokenRule.network : ''}
                size="s"
                transform="capitalized"
                align="left"
              />
            </styled.GridItem>
            <styled.GridItem>
              <styled.TokenRuleTitle
                type="h5"
                label={t('tokenRules.tokenRuleReview.addressLabel')}
                weight="bold"
                align="right"
                transform="uppercase"
              />
              <styled.TokenRuleDetail
                text={currentTokenRule?.contractAddress ? currentTokenRule.contractAddress : ''}
                size="s"
                transform="normal"
                align="left"
              />
            </styled.GridItem>
            <styled.GridItem>
              <styled.TokenRuleTitle
                type="h5"
                label={t('tokenRules.tokenRuleReview.minimumAmountLabel')}
                weight="bold"
                align="right"
                transform="uppercase"
              />
              <styled.TokenRuleDetail
                text={currentTokenRule?.minBalance ? currentTokenRule.minBalance.toString() : ''}
                size="s"
                align="left"
                transform="normal"
              />
            </styled.GridItem>
            {tokenRuleReviewStore.isWorldList && currentTokenRule?.spaceName && (
              <styled.GridItem>
                <styled.TokenRuleTitle
                  type="h5"
                  label={t('tokenRules.tokenRuleReview.spaceRequestedLabel')}
                  weight="bold"
                  align="right"
                  transform="uppercase"
                />
                <styled.TokenRuleDetail
                  text={currentTokenRule.spaceName}
                  size="s"
                  align="left"
                  transform="normal"
                />
              </styled.GridItem>
            )}
            {tokenRuleReviewStore.isWorldList && currentTokenRule?.userName && (
              <styled.GridItem>
                <styled.TokenRuleTitle
                  type="h5"
                  label={t('tokenRules.tokenRuleReview.userRequestedLabel')}
                  weight="bold"
                  align="right"
                  transform="uppercase"
                />
                <styled.TokenRuleDetail
                  text={currentTokenRule.userName}
                  size="s"
                  align="left"
                  transform="normal"
                />
              </styled.GridItem>
            )}
          </styled.TokenDetailGrid>
        </styled.Div>
      </styled.Container>
    </Dialog>
  );
};

export default observer(TokenRuleReview);
