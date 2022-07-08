import React, {FC, useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {TokenRuleReviewStoreInterface} from 'scenes/widgets/stores/TokenRuleReviewStore';
import {Dialog, Heading, Text, ToastContent} from 'ui-kit';
import {TokenRuleStatus} from 'core/enums';
import {useStore} from 'shared/hooks';

import * as styled from './TokenRuleReviewWidget.styled';

interface PropsInterface {
  tokenRuleReviewStore: TokenRuleReviewStoreInterface;
  onClose: () => void;
}

const TokenRuleReviewWidget: FC<PropsInterface> = ({onClose, tokenRuleReviewStore}) => {
  const theme = useTheme();
  const {
    spaceAdminStore: {spaceManagerStore},
    sessionStore
  } = useStore();
  const {tokenRulesListStore, space: spaceStore} = spaceManagerStore;
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

  useEffect(() => {
    if (
      tokenRuleReviewStore.acceptTokenRuleRequest.isDone ||
      tokenRuleReviewStore.declineTokenRuleRequest.isDone ||
      tokenRuleReviewStore.deleteTokeRuleRequest.isDone
    ) {
      tokenRulesListStore.fetchTokenRules(spaceStore.id);
    }
  }, [
    tokenRuleReviewStore.acceptTokenRuleRequest.state,
    tokenRuleReviewStore.declineTokenRuleRequest.state,
    tokenRuleReviewStore.deleteTokeRuleRequest.state
  ]);

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
      <styled.Container>
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
              isCustom
            />
          </styled.HeadingItem>
          <styled.TokenDetailGrid>
            <styled.GridItem>
              <Heading
                type="h5"
                label={t('tokenRules.tokenRuleReview.tokenLabel')}
                weight="bold"
                isCustom
                align="right"
                transform="uppercase"
              />
              <Text
                text={currentTokenRule?.tokenType ? currentTokenRule.tokenType : ''}
                size="s"
                transform="uppercase"
                isCustom
                align="left"
              />
            </styled.GridItem>
            {tokenRuleReviewStore.isWorldList && (
              <styled.GridItem>
                <Heading
                  type="h5"
                  label={t('tokenRules.tokenRuleReview.tokenIdLabel')}
                  weight="bold"
                  isCustom
                  align="right"
                  transform="uppercase"
                />
                <Text
                  text={currentTokenRule?.id}
                  size="s"
                  isCustom
                  align="left"
                  transform="normal"
                />
              </styled.GridItem>
            )}
            <styled.GridItem>
              <Heading
                type="h5"
                label={t('tokenRules.tokenRuleReview.networkLabel')}
                weight="bold"
                isCustom
                align="right"
                transform="uppercase"
              />
              <Text
                text={currentTokenRule?.network ? currentTokenRule.network : ''}
                size="s"
                isCustom
                transform="capitalized"
                align="left"
              />
            </styled.GridItem>
            <styled.GridItem>
              <Heading
                type="h5"
                label={t('tokenRules.tokenRuleReview.addressLabel')}
                weight="bold"
                isCustom
                align="right"
                transform="uppercase"
              />
              <Text
                text={currentTokenRule?.contractAddress ? currentTokenRule.contractAddress : ''}
                size="s"
                isCustom
                transform="normal"
                align="left"
              />
            </styled.GridItem>
            <styled.GridItem>
              <Heading
                type="h5"
                label={t('tokenRules.tokenRuleReview.minimumAmountLabel')}
                weight="bold"
                isCustom
                align="right"
                transform="uppercase"
              />
              <Text
                text={currentTokenRule?.minBalance ? currentTokenRule.minBalance.toString() : ''}
                size="s"
                isCustom
                align="left"
                transform="normal"
              />
            </styled.GridItem>
            {tokenRuleReviewStore.isWorldList && currentTokenRule?.spaceName && (
              <styled.GridItem>
                <Heading
                  type="h5"
                  label={t('tokenRules.tokenRuleReview.spaceRequestedLabel')}
                  weight="bold"
                  isCustom
                  align="right"
                  transform="uppercase"
                />
                <Text
                  text={currentTokenRule.spaceName}
                  size="s"
                  isCustom
                  align="left"
                  transform="normal"
                />
              </styled.GridItem>
            )}
            {tokenRuleReviewStore.isWorldList && currentTokenRule?.userName && (
              <styled.GridItem>
                <Heading
                  type="h5"
                  label={t('tokenRules.tokenRuleReview.userRequestedLabel')}
                  weight="bold"
                  isCustom
                  align="right"
                  transform="uppercase"
                />
                <Text
                  text={currentTokenRule.userName}
                  size="s"
                  isCustom
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

export default observer(TokenRuleReviewWidget);
