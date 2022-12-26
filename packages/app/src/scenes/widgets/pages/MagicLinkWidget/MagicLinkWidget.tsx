import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import {Button, Dialog, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {MagicTypeEnum} from 'core/enums';
import {Location, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';

import * as styled from './MagicLinkWidget.styled';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const MagicLinkWidget: FC = () => {
  const {widgetsStore, mainStore} = useStore();
  const {magicLinkStore} = widgetsStore;
  const {address, copyToClipBoard} = magicLinkStore;
  const {worldStore} = mainStore;

  const theme = useTheme();
  const {t} = useTranslation();

  useEffect(() => {
    magicLinkStore.init();

    return () => {
      magicLinkStore.resetModel();
    };
  }, [magicLinkStore]);

  const handleGenerateLink = useCallback(async () => {
    const isDone = await copyToClipBoard(MagicTypeEnum.ODYSSEY, worldStore.worldId);

    if (isDone) {
      magicLinkStore.magicLinkDialog.close();

      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.linkCopied')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [copyToClipBoard, magicLinkStore.magicLinkDialog, t, worldStore.worldId]);

  return (
    <Dialog
      theme={theme}
      icon="link"
      iconSize="medium"
      position="rightBottom"
      headerStyle="normal"
      headerType="h2"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title={t('labels.shareLinkOfOdyssey')}
      onClose={magicLinkStore.magicLinkDialog.close}
      showBackground={false}
      showCloseButton
    >
      <styled.Container data-testid="MagicLinkWidget-test">
        <Text theme={theme} text={t('messages.magicLink')} align="left" size="xxs" />
        <styled.Content>
          <Location icon="locate" theme={theme} value={address} />
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
