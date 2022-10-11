import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import {Button, Dialog, Text} from '@momentum/ui-kit';
import {copyToClipboard} from '@momentum/core';

import {useStore} from 'shared/hooks';
import {MagicTypeEnum} from 'core/enums';
import {Location, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';

import * as styled from './MagicLinkWidget.styled';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const MagicLinkWidget: FC = () => {
  const {widgetStore, mainStore, collaborationStore} = useStore();
  const {magicLinkStore} = widgetStore;
  const {magicLinkDialog, magicLink} = magicLinkStore;
  const {generate, address} = magicLink;
  const {unityStore} = mainStore;

  const theme = useTheme();
  const {t} = useTranslation();

  useEffect(() => {
    return () => {
      magicLinkStore.resetModel();
    };
  }, [magicLinkStore]);

  useEffect(() => {
    if (collaborationStore.space && !collaborationStore.space.isTable) {
      generate(MagicTypeEnum.OPEN_SPACE, collaborationStore.space.id, null);
    } else if (collaborationStore.space) {
      generate(MagicTypeEnum.JOIN_MEETING, collaborationStore.space.id, null);
    } else {
      generate(MagicTypeEnum.FLY, null, unityStore.getUserPosition());
    }
  }, [collaborationStore.space, generate, unityStore]);

  const copyHandle = useCallback(async () => {
    await copyToClipboard(address || '');
    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.linkCopied')}
        showCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
    magicLinkDialog.close();
  }, [address, t, magicLinkDialog]);

  return (
    <Dialog
      theme={theme}
      position="rightBottom"
      headerStyle="uppercase"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title={t('labels.shareLocation')}
      onClose={magicLinkDialog.close}
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
            onClick={copyHandle}
          />
        </styled.Actions>
      </styled.Container>
    </Dialog>
  );
};

export default observer(MagicLinkWidget);
