import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {Dialog, Text, ToastContent} from 'ui-kit';

interface PropsInterface {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const DeleteEmojiDialog: FC<PropsInterface> = ({onConfirm, onCancel}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
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
    } finally {
      setIsLoading(false);
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
        disabled: isLoading
      }}
      declineInfo={{
        title: t('spaceAdmin.manageEmoji.deleteDialog.no'),
        onClick: onCancel,
        variant: 'primary',
        disabled: isLoading
      }}
    >
      <Text text={t('spaceAdmin.manageEmoji.deleteDialog.text')} size="s" />
      <br />
    </Dialog>
  );
};

export default DeleteEmojiDialog;
