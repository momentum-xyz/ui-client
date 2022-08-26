import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';
import {PanelLayout} from 'ui-kit';

import * as styled from './EmojiWidget.styled';
import {EmojiItem} from './components/';

interface PropsInterface {
  onClose: () => void;
}

const EmojiWidget: FC<PropsInterface> = ({onClose}) => {
  const {widgetStore, sessionStore} = useStore();
  const {emojiDetailsList} = widgetStore.emojiStore;
  const {profile} = sessionStore;

  const {t} = useTranslation();

  const userUUID = profile?.uuid;
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
          {emojiDetailsList.map((em) => (
            <EmojiItem
              emoji={em}
              onClick={() => handleEmojiClick(em.id, em.unityUrl)}
              key={em.id}
            />
          ))}
        </styled.EmojiList>
      </styled.Container>
    </PanelLayout>
  );
};

export default observer(EmojiWidget);
