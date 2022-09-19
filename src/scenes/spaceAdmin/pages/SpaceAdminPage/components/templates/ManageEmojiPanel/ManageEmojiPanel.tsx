import {observer} from 'mobx-react-lite';
import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, Emoji, SectionPanel, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {UploadEmojiDialog, DeleteEmojiDialog} from '../../organisms';

import * as styled from './ManageEmojiPanel.styled';

const ManageEmojiPanel: FC = () => {
  const {
    widgetStore: {
      emojiStore: {emojiDetailsList, uploadEmojiToSpace, deleteEmoji}
    },
    spaceAdminStore: {
      spaceManagerStore: {space}
    }
  } = useStore();
  const {t} = useTranslation();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!space?.id) {
    return null;
  }
  const spaceEmoji = emojiDetailsList.find((emoji) => emoji.spaceId === space.id);

  const handleClickUpload = () => setShowUploadDialog(true);
  const handleCancelUpload = () => setShowUploadDialog(false);

  const handleConfirmUpload = async (image: File, name: string) => {
    if (spaceEmoji) {
      await deleteEmoji(space.id, spaceEmoji.id);
    }
    await uploadEmojiToSpace(space.id, image, name);
    setShowUploadDialog(false);
  };

  const handleClickDelete = () => setShowDeleteDialog(true);
  const handleCancelDelete = () => setShowDeleteDialog(false);

  const handleConfirmDelete = async () => {
    if (spaceEmoji) {
      await deleteEmoji(space.id, spaceEmoji.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      {showUploadDialog && (
        <UploadEmojiDialog onSave={handleConfirmUpload} onClose={handleCancelUpload} />
      )}
      {showDeleteDialog && (
        <DeleteEmojiDialog onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      )}
      <SectionPanel title={t('spaceAdmin.manageEmoji.title')}>
        <styled.Body>
          <Text text={t('spaceAdmin.manageEmoji.text1')} size="s" align="left" />
          {!spaceEmoji && (
            <Text text={t('spaceAdmin.manageEmoji.noEmojiUploaded')} size="s" align="left" />
          )}
          {!!spaceEmoji && (
            <styled.UploadedWidgetPreview>
              <Text text={t('spaceAdmin.manageEmoji.yourUploadedEmoji')} size="s" align="left" />
              <Emoji
                emoji={spaceEmoji}
                onClick={() => {
                  // TODO send it to animations panel?
                }}
              />
              <Text text={`(${spaceEmoji.name})`} size="s" />
            </styled.UploadedWidgetPreview>
          )}
          <styled.ActionBar>
            {!!spaceEmoji && (
              <Button
                label={t('spaceAdmin.manageEmoji.deleteEmoji')}
                variant="danger"
                onClick={handleClickDelete}
              />
            )}
            <Button label={t('spaceAdmin.manageEmoji.uploadEmoji')} onClick={handleClickUpload} />
          </styled.ActionBar>
        </styled.Body>
      </SectionPanel>
    </>
  );
};

export default observer(ManageEmojiPanel);
