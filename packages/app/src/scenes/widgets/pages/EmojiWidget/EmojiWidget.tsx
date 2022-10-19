import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {PanelLayout, Emoji} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';

import * as styled from './EmojiWidget.styled';

interface PropsInterface {
  onClose: () => void;
}

const EmojiWidget: FC<PropsInterface> = ({onClose}) => {
  const {widgetStore, sessionStore} = useStore();
  const {emojiDetailsList, fetchAll} = widgetStore.emojiStore;
  const {profile} = sessionStore;

  const {t} = useTranslation();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const userUUID = profile?.id;
  const userAvatarSrc = profile?.avatarSrc || '';
  const userName = profile?.name || '';
  const handleEmojiClick = useCallback(
    (emojiId: string, emojiUrl: string) => {
      if (userUUID) {
        UnityService.sendEmoji({emojiId, emojiUrl, userUUID, userAvatarSrc, userName});
      } else {
        console.error('Unable to get user uuid');
      }
    },
    [userUUID, userAvatarSrc, userName]
  );

  return (
    <PanelLayout title={t('labels.emoji')} onClose={onClose}>
      <styled.Container>
        <styled.EmojiList>
          {emojiDetailsList.map((emoji) => (
            <Emoji
              emoji={emoji.imgSrc}
              name={emoji.name}
              onClick={() => handleEmojiClick(emoji.id, emoji.unityUrl)}
              key={emoji.id}
            />
          ))}
        </styled.EmojiList>
      </styled.Container>
    </PanelLayout>
  );
};

export default observer(EmojiWidget);
