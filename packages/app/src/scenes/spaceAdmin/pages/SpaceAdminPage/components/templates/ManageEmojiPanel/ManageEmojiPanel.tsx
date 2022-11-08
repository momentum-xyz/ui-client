import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Emoji, SectionPanel, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {UploadEmojiDialog, DeleteEmojiDialog} from '../../organisms';

import * as styled from './ManageEmojiPanel.styled';

const ManageEmojiPanel: FC = () => {
  const {
    spaceAdminStore: {spaceManagerStore, manageEmojiStore}
  } = useStore();
  const {space} = spaceManagerStore;
  const {fetchSpaceEmoji, emojiDetail, uploadDialog, deleteDialog} = manageEmojiStore;

  const {t} = useTranslation();

  useEffect(() => {
    if (space?.id) {
      fetchSpaceEmoji(space.id);
    }

    return () => manageEmojiStore.resetModel();
  }, [space?.id, fetchSpaceEmoji]);

  if (!space?.id) {
    return null;
  }

  return (
    <>
      {uploadDialog.isOpen && (
        <UploadEmojiDialog spaceId={space.id} existingEmojiId={emojiDetail?.emojiId} />
      )}
      {deleteDialog.isOpen && emojiDetail && (
        <DeleteEmojiDialog spaceId={space.id} emojiId={emojiDetail?.emojiId} />
      )}
      <SectionPanel title={t('spaceAdmin.manageEmoji.title')}>
        <styled.Body>
          <Text text={t('spaceAdmin.manageEmoji.text1')} size="s" align="left" />
          {!emojiDetail && (
            <Text text={t('spaceAdmin.manageEmoji.noEmojiUploaded')} size="s" align="left" />
          )}
          {!!emojiDetail && (
            <styled.UploadedWidgetPreview>
              <Text text={t('spaceAdmin.manageEmoji.yourUploadedEmoji')} size="s" align="left" />
              <Emoji emoji={emojiDetail.imgSrc} name={emojiDetail.name} onClick={() => {}} />
              <Text text={`(${emojiDetail.name})`} size="s" />
            </styled.UploadedWidgetPreview>
          )}
          <styled.ActionBar>
            {!!emojiDetail && (
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
