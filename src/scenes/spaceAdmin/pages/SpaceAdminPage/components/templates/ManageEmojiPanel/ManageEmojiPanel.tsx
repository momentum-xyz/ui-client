import {observer} from 'mobx-react-lite';
import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, SectionPanel, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {EmojiItem} from 'scenes/widgets/pages/EmojiWidget/components';

import {UploadEmojiDialog} from '../../organisms';

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

  console.log('EMOJIS', emojiDetailsList);
  if (!space?.id) {
    return null;
  }
  const spaceEmoji = emojiDetailsList.find((emoji) => emoji.spaceId === space.id);

  const handleClickUpload = () => {
    setShowUploadDialog(true);
  };

  const handleConfirmUpload = async (image: File, name: string) => {
    if (spaceEmoji) {
      await deleteEmoji(space.id, spaceEmoji.id);
    }
    await uploadEmojiToSpace(space.id, image, name);
    setShowUploadDialog(false);
  };
  const handleCancelUpload = () => {
    setShowUploadDialog(false);
  };

  const handleDelete = async () => {
    // TODO add are-you-sure dialog
    if (spaceEmoji) {
      try {
        await deleteEmoji(space.id, spaceEmoji.id);
        // TODO add toast success
      } catch (err) {
        // TODO add error toast
        console.log('Error deleting emoji', err);
      }
    }
  };

  return (
    <>
      {showUploadDialog && (
        <UploadEmojiDialog onSave={handleConfirmUpload} onClose={handleCancelUpload} />
      )}
      <SectionPanel title={t('spaceAdmin.manageEmoji.title')}>
        <styled.Body>
          <Text text={t('spaceAdmin.manageEmoji.text1')} size="s" align="left" />
          <Text text={t('spaceAdmin.manageEmoji.text2')} size="s" align="left" />
          {!!spaceEmoji && (
            <styled.UploadedWidgetPreview>
              <Text text={t('spaceAdmin.manageEmoji.yourUploadedEmoji')} size="s" align="left" />
              <EmojiItem
                emoji={spaceEmoji}
                onClick={() => {
                  // TODO send it to animations panel?
                }}
              />
              <Text text={`(${spaceEmoji.name})`} size="s" />
              {/* <styled.EmojiPreviewHolder>
                <styled.EmojiPreview src={}
              </styled.EmojiPreviewHolder> */}
            </styled.UploadedWidgetPreview>
          )}
          <styled.ActionBar>
            {!!spaceEmoji && (
              <Button
                label={t('spaceAdmin.manageEmoji.deleteEmoji')}
                variant="danger"
                onClick={handleDelete}
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
