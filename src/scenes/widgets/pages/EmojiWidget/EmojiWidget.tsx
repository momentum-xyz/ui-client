import {FC, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {groupBy} from 'lodash-es';

import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';
import {PanelLayout, Text} from 'ui-kit';
import {EmojiDetailsInterface} from 'core/models';

import * as styled from './EmojiWidget.styled';
import {EmojiItem} from './components/';

interface PropsInterface {
  onClose: () => void;
}

const groupEmojiesBySpaces = (emojies: EmojiDetailsInterface[]) => {
  const emojiesBySpace = groupBy(emojies, (emj) => emj.spaceName || emj.spaceId);

  Object.values(emojiesBySpace).forEach((emojies) => emojies.sort((l, r) => l.order - r.order));

  return emojiesBySpace;
};

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

  const emojiesBySpace = useMemo(() => groupEmojiesBySpaces(emojiDetailsList), [emojiDetailsList]);

  return (
    <PanelLayout title={t('labels.emoji')} onClose={onClose}>
      <styled.Container>
        {Object.entries(emojiesBySpace).map(([spaceName, emojies]) => (
          <div key={spaceName}>
            <Text text={spaceName} size="s" align="left" />
            <styled.EmojiList>
              {emojies.map((em) => (
                <EmojiItem
                  emoji={em}
                  onClick={() => handleEmojiClick(em.id, em.unityUrl)}
                  key={em.id}
                />
              ))}
            </styled.EmojiList>
          </div>
        ))}
      </styled.Container>
    </PanelLayout>
  );
};

export default observer(EmojiWidget);
