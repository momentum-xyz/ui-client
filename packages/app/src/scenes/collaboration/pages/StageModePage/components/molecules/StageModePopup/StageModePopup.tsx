import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, PanelLayout, Text} from '@momentum/ui-kit';

import {StageModePopupInfoInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {StageModePopupTypeEnum} from 'core/enums';

import * as styled from './StageModePopup.styled';

const STAGEMODE_POPUP_WIDTH = '242px';

export interface StageModePopupPropsInterface {
  info: StageModePopupInfoInterface;
  isStageFull: boolean;
}

const StageModePopup: React.FC<StageModePopupPropsInterface> = ({info, isStageFull}) => {
  const {collaborationStore} = useStore();
  const {stageModeStore} = collaborationStore;
  const {removeRequestPopup, removeAwaitingPermissionPopup} = stageModeStore;

  const {t} = useTranslation();

  const handleAccept = async (info: StageModePopupInfoInterface) => {
    if (!info.onAccept) {
      return;
    }

    const shouldClose = await info.onAccept();

    if (shouldClose && info.userId) {
      removeRequestPopup(info.userId);
    }
  };

  const handleDecline = async (info: StageModePopupInfoInterface) => {
    if (!info.onDecline) {
      return;
    }

    const shouldClose = await info.onDecline();

    if (shouldClose && info.userId) {
      removeRequestPopup(info.userId);
    }
  };

  switch (info.type) {
    case StageModePopupTypeEnum.AWAITING_PERMISSION:
      return (
        <PanelLayout componentSize={{width: STAGEMODE_POPUP_WIDTH}}>
          <styled.PermissionBody
            onClick={removeAwaitingPermissionPopup}
            data-testid="StageModePopup-test"
          >
            <Text text={t('messages.requestedPermissionToGoOnStage')} size="m" align="left" />
            <Text text={t('messages.waitForModeratorsToAccept')} size="xs" align="left" />
          </styled.PermissionBody>
        </PanelLayout>
      );
    case StageModePopupTypeEnum.RECEIVED_PERMISSION_REQUEST:
      return (
        <PanelLayout
          title={t('titles.userWantsToComeOnStage', {user: info.userName})}
          componentSize={{width: STAGEMODE_POPUP_WIDTH}}
        >
          <styled.RequestBody data-testid="StageModePopup-test">
            <Text text={t('messages.thisPersonWantsToComeOnStage')} size="m" align="left" />
            <Text
              text={
                isStageFull
                  ? t('messages.thisWillEnablePersonToUseStage')
                  : t('messages.stageIsCurrentlyFull')
              }
              size="xs"
              align="left"
            />
            <styled.RequestActions>
              <Button
                label={t('actions.accept')}
                variant="primary"
                disabled={isStageFull}
                size="small"
                onClick={() => handleAccept(info)}
              />

              <Button
                label={t('actions.decline')}
                variant="danger"
                onClick={() => handleDecline(info)}
              />
            </styled.RequestActions>
          </styled.RequestBody>
        </PanelLayout>
      );
  }
};

export default StageModePopup;
