import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, Dialog, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {MagicTypeEnum} from 'core/enums';
import {MagicLink, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';

import * as styled from './MagicLinkWidget.styled';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const MagicLinkWidget: FC = () => {
  const {widgetsStore, universeStore} = useStore();
  const {magicLinkStore} = widgetsStore;
  const {address, copyToClipBoard} = magicLinkStore;

  const {t} = useI18n();

  useEffect(() => {
    magicLinkStore.init();

    return () => {
      magicLinkStore.resetModel();
    };
  }, [magicLinkStore]);

  const handleGenerateLink = useCallback(async () => {
    const isDone = await copyToClipBoard(MagicTypeEnum.ODYSSEY, universeStore.worldId);

    if (isDone) {
      magicLinkStore.dialog.close();

      toast.info(
        <ToastContent
          icon="alert"
          title={t('titles.alert')}
          text={t('messages.linkCopied')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [copyToClipBoard, magicLinkStore.dialog, t, universeStore.worldId]);

  return (
    <Dialog
      icon="link"
      iconSize="medium"
      position="rightBottom"
      headerStyle="normal"
      headerType="h2"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title={t('labels.shareLinkOfOdyssey')}
      onClose={magicLinkStore.dialog.close}
      showBackground={false}
      showCloseButton
    >
      <styled.Container data-testid="MagicLinkWidget-test">
        <Text text={t('messages.magicLink')} align="left" size="xxs" />
        <styled.Content>
          <MagicLink icon="locate" value={address} />
        </styled.Content>
        <styled.Actions>
          <Button
            icon="copy"
            size="medium"
            variant="secondary"
            label={t('actions.copyLink')}
            onClick={handleGenerateLink}
          />
        </styled.Actions>
      </styled.Container>
    </Dialog>
  );
};

export default observer(MagicLinkWidget);
