import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';

import {Button, Dialog, Location, Text, ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {MagicTypeEnum} from 'core/enums';
import {copyToClipboard} from 'core/utils';
import {useStore} from 'shared/hooks';
import {useUnityUserPosition} from 'context/Collaboration/hooks/useUnity';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';

import * as styled from './MagicLinkWidget.styled';

const DIALOG_OFFSET_RIGHT = 105;
const DIALOG_OFFSET_BOTTOM = 60;

const MagicLinkWidget: FC = () => {
  const {magicLinkStore} = useStore().widgetStore;
  const {magicLinkDialog, magicLink} = magicLinkStore;
  const {generate, address} = magicLink;

  const theme = useTheme();
  const {t} = useTranslation();

  const {collaborationState} = useCollaboration();
  const userPosition = useUnityUserPosition();

  useEffect(() => {
    const {collaborationSpace, collaborationTable} = collaborationState;

    if (collaborationSpace?.id) {
      generate(MagicTypeEnum.OPEN_SPACE, collaborationSpace?.id, null);
    } else if (collaborationTable?.id) {
      generate(MagicTypeEnum.JOIN_MEETING, collaborationTable?.id, null);
    } else if (userPosition) {
      generate(MagicTypeEnum.FLY, null, userPosition);
    }
  }, [collaborationState, userPosition]);

  useEffect(() => {
    return () => {
      magicLinkStore.resetModel();
    };
  }, [magicLinkStore]);

  const copyHandle = useCallback(async () => {
    await copyToClipboard(address || '');
    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.linkCopied')}
        isCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
    magicLinkDialog.close();
  }, [copyToClipboard, magicLinkDialog, address]);

  return (
    <Dialog
      theme={theme}
      position="rightBottom"
      headerStyle="uppercase"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title={t('labels.shareLocation')}
      onClose={magicLinkDialog.close}
      showCloseButton
    >
      <styled.Container>
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
