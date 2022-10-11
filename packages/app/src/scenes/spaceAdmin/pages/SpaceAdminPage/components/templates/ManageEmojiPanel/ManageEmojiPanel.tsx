import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Emoji, SectionPanel, Text} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';

import {UploadEmojiDialog, DeleteEmojiDialog} from '../../organisms';

import * as styled from './ManageEmojiPanel.styled';

const ManageEmojiPanel: FC = () => {
  const {
    spaceAdminStore: {spaceManagerStore, manageEmojiStore}
  } = useStore();
  const {space} = spaceManagerStore;
  const {emojiDetailsList, fetchSpaceEmojies, uploadDialog, deleteDialog} = manageEmojiStore;

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

  return (
    <>
      {uploadDialog.isOpen && (
        <UploadEmojiDialog spaceId={space.id} existingEmojiId={spaceEmoji?.id} />
      )}
      {deleteDialog.isOpen && !!spaceEmoji && (
        <DeleteEmojiDialog spaceId={space.id} emojiId={spaceEmoji.id} />
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
              <Emoji emoji={spaceEmoji.imgSrc} name={spaceEmoji.name} onClick={() => {}} />
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
