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
  const {widgetStore_OLD, mainStore, collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {magicLinkStore} = widgetStore_OLD;
  const {magicLink} = magicLinkStore;
  const {copyToClipBoard, address, wasCreated, init} = magicLink;
  const {unityStore} = mainStore;

  const theme = useTheme();
  const {t} = useTranslation();

  useEffect(() => {
    init();
    return () => {
      magicLinkStore.resetModel();
    };
  }, [magicLinkStore]);
  useEffect(() => {
    if (wasCreated) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.linkCopied')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
      magicLinkStore.magicLinkDialog.close();
    }
  }, [wasCreated]);

  const handleGenerateLink = useCallback(async () => {
    if (spaceStore.space && !spaceStore.isTable) {
      await copyToClipBoard(MagicTypeEnum.OPEN_SPACE, spaceStore.id);
    } else if (spaceStore.space && spaceStore.isTable) {
      await copyToClipBoard(MagicTypeEnum.JOIN_MEETING, spaceStore.id);
    } else {
      await copyToClipBoard(MagicTypeEnum.FLY, undefined, unityStore.getUserPosition());
    }
  }, [copyToClipBoard, spaceStore, unityStore]);

  return (
    <Dialog
      theme={theme}
      position="rightBottom"
      headerStyle="uppercase"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title={t('labels.shareLocation')}
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
