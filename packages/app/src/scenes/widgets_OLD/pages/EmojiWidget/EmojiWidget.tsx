import {FC} from 'react';
import {observer} from 'mobx-react-lite';

const EmojiWidget: FC = () => {
  /*const {widgetStore_OLD, sessionStore} = useStore();
  const {emojiDetailsList, fetchAll} = widgetStore_OLD.emojiStore;
  const {user} = sessionStore;

  const {t} = useI18n();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const userUUID = user?.id;
  const userAvatarSrc = user?.avatarSrc || '';
  const userName = user?.name || '';
  const handleEmojiClick = useCallback(
    (emojiId: string, emojiUrl: string) => {
      if (userUUID) {
        // TODO
        // UnityService.sendEmoji({emojiId, emojiUrl, userUUID, userAvatarSrc, userName});
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
              onClick={() => handleEmojiClick(emoji.emojiId, emoji.unityUrl)}
              key={emoji.emojiId}
            />
          ))}
        </styled.EmojiList>
      </styled.Container>
    </PanelLayout>
  );*/

  return <></>;
};

export default observer(EmojiWidget);
