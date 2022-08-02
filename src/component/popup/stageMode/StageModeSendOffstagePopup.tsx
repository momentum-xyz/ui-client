import React from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import Popup, {PopupTitle} from '../../atoms/Popup';
import Avatar from '../../atoms/Avatar';
import Button from '../../atoms/Button';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import User from '../../../context/type/User';

export interface StageModeSendOffstagePopupProps {
  user: User | undefined;
  onClose?: () => void;
}

const StageModeSendOffstagePopup: React.FC<StageModeSendOffstagePopupProps> = ({user, onClose}) => {
  const {agoraStore} = useStore().mainStore;
  const {agoraStageModeStore} = agoraStore;

  const handleSendOffstage = async () => {
    if (user?.id.data) {
      try {
        await agoraStageModeStore.kickUserOffStage(bytesToUuid(user.id.data));
        onClose?.();
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.offStageFailure', {
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
        <Avatar size="xm" avatarHash={user?.profile.avatarHash} />
        <p className="pl-1 text-md">{user?.name}</p>
      </PopupTitle>
      <div className="flex flex-row space-x-2 pt-1 justify-center">
        <Button type="ghost-red" onClick={handleSendOffstage}>
          Send Offstage
        </Button>
        <Button type="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Popup>
  );
};

export default observer(StageModeSendOffstagePopup);
