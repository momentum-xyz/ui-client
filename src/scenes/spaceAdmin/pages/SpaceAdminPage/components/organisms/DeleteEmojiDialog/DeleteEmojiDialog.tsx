import {FC} from 'react';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {Dialog, Text, ToastContent} from 'ui-kit';

interface PropsInterface {
  spaceId: string;
  emojiId: string;
}

const DeleteEmojiDialog: FC<PropsInterface> = ({spaceId, emojiId}) => {
  const {deleteDialog, isDeletePending, deleteEmoji} = useStore().spaceAdminStore.manageEmojiStore;

  const theme = useTheme();
  const {t} = useTranslation();

  const handleConfirm = async () => {
    try {
      await deleteEmoji(spaceId, emojiId);
      deleteDialog.close();
    } catch (err) {
      console.error(err);
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          text={t('spaceAdmin.manageEmoji.deleteDialog.errorDelete')}
        />
      );
    }
  };

  return (
    <Dialog
      title={t('spaceAdmin.manageEmoji.deleteDialog.title')}
      hasBorder
      theme={theme}
      approveInfo={{
        title: t('spaceAdmin.manageEmoji.deleteDialog.yes'),
        onClick: handleConfirm,
        variant: 'danger',
        icon: 'bin',
        disabled: isDeletePending
      }}
      declineInfo={{
        title: t('spaceAdmin.manageEmoji.deleteDialog.no'),
        onClick: deleteDialog.close,
        variant: 'primary',
        disabled: isDeletePending
      }}
    >
      <Text text={t('spaceAdmin.manageEmoji.deleteDialog.text')} size="s" />
      <br />
    </Dialog>
  );
};

export default DeleteEmojiDialog;
