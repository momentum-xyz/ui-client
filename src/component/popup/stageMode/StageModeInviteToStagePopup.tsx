import React from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {StageModeUserInterface} from 'stores/MainStore/models/AgoraStore/models';

import Popup, {PopupTitle} from '../../atoms/Popup';
import Avatar from '../../atoms/Avatar';
import Button from '../../atoms/Button';

export interface StageModeInviteToStagePopupProps {
  user?: StageModeUserInterface;
  onClose?: () => void;
}

const StageModeInviteToStagePopup: React.FC<StageModeInviteToStagePopupProps> = ({
  user,
  onClose
}) => {
  const {agoraStore} = useStore().mainStore;
  const {stageModeStore} = agoraStore;

  const handleInviteClick = async () => {
    if (user) {
      try {
        await stageModeStore.inviteToStage(user.uid);
        onClose?.();
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.inviteToStageFailure', {
              user: user.name
            })}
            isCloseButton
          />
        );
      }
    }
  };

  return (
    <Popup className="w-36">
      <PopupTitle>
        <Avatar size="xm" avatarHash={user?.profile?.avatarHash} />
        <p className="pl-1 text-md">{user?.name}</p>
      </PopupTitle>
      <p className="text-sm">Invite this person to the stage?</p>
      <br />
      <p className="text-xs">
        (This will enable the person to talk, screenshare, and transmit video)
      </p>
      <div className="flex flex-row space-x-2 pt-2">
        <Button type="ghost" onClick={handleInviteClick}>
          Invite to stage
        </Button>
        <Button type="ghost-red" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Popup>
  );
};

export default observer(StageModeInviteToStagePopup);
