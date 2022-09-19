import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, Emoji, SectionPanel, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {UploadEmojiDialog, DeleteEmojiDialog} from '../../organisms';

import * as styled from './ManageEmojiPanel.styled';

const ManageEmojiPanel: FC = () => {
  const {
    spaceAdminStore: {
      spaceManagerStore: {space},
      manageEmojiStore: {emojiDetailsList, fetchSpaceEmojies, uploadDialog, deleteDialog}
    }
  } = useStore();

  const {t} = useTranslation();

  useEffect(() => {
    if (space?.id) {
      fetchSpaceEmojies(space.id);
    }
  }, [space?.id, fetchSpaceEmojies]);

  if (!space?.id) {
    return null;
  }
  const spaceEmoji = emojiDetailsList.find((emoji) => emoji.spaceId === space.id);

  // const handleClickUpload = () => setShowUploadDialog(true);
  // const handleCancelUpload = () => setShowUploadDialog(false);

  // const handleConfirmUpload = async (image: File, name: string) => {
  //   if (spaceEmoji) {
  //     await deleteEmoji(space.id, spaceEmoji.id);
  //   }
  //   await uploadEmojiToSpace(space.id, image, name);
  //   setShowUploadDialog(false);
  // };

  // const handleClickDelete = () => setShowDeleteDialog(true);
  // const handleCancelDelete = () => setShowDeleteDialog(false);

  // const handleConfirmDelete = async () => {
  //   if (spaceEmoji) {
  //     await deleteEmoji(space.id, spaceEmoji.id);
  //     setShowDeleteDialog(false);
  //   }
  // };

  return (
    <>
      {uploadDialog.isOpen && (
        <UploadEmojiDialog
          spaceId={space.id}
          existingEmojiId={spaceEmoji?.id}
          // onSave={handleConfirmUpload} onClose={uploadDialog.close}
        />
      )}
      {deleteDialog.isOpen && !!spaceEmoji && (
        <DeleteEmojiDialog
          spaceId={space.id}
          emojiId={spaceEmoji.id}
          // onConfirm={handleConfirmDelete} onCancel={handleCancelDelete}
        />
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
                onClick={deleteDialog.open}
              />
            )}
            <Button label={t('spaceAdmin.manageEmoji.uploadEmoji')} onClick={uploadDialog.open} />
          </styled.ActionBar>
        </styled.Body>
      </SectionPanel>
    </>
  );
};

export default observer(ManageEmojiPanel);
