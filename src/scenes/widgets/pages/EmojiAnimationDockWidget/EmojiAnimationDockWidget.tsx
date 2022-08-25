import {FC, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {usePosBusEvent} from 'shared/hooks';

import {EmojiWithAvatarAnimation} from './components';

const ANIMATION_DURATION_SEC = 5;

// TODO make it model
interface EmojiItemInterface {
  type: 'emoji' | 'megamoji';
  emojiUrl: string;
  userId?: string;
  emojiId?: string;
  idx: number;
  offset: number;
}
type EmojiItemInterfaceStoreType = Set<EmojiItemInterface>;

const EmojiAnimationDock: FC = () => {
  const [items, setItems] = useState<EmojiItemInterfaceStoreType>(() => new Set());
  const refIndex = useRef(1);

  const newEmojiHandler =
    (type: EmojiItemInterface['type']) => (emojiUrl: string, userId?: string, emojiId?: string) => {
      const item: EmojiItemInterface = {
        type,
        userId,
        emojiUrl,
        emojiId,
        idx: refIndex.current++,
        offset: Math.ceil(Math.random() * 100)
      };

      setItems((items) => new Set(items).add(item));
      console.log('MOUNT', item);

      setTimeout(() => {
        console.log('UNMOUNT', item);
        setItems((items) => {
          const s = new Set(items);
          s.delete(item);
          return s;
        });
      }, ANIMATION_DURATION_SEC * 1000);
    };

  usePosBusEvent('emoji', newEmojiHandler('emoji'));
  usePosBusEvent('megamoji', newEmojiHandler('megamoji'));

  const renderItems = () => {
    return Array.from(items).map(({idx, ...props}) => (
      <EmojiWithAvatarAnimation key={idx} {...props}></EmojiWithAvatarAnimation>
    ));
  };

  return <>{renderItems()}</>;
};

export default observer(EmojiAnimationDock);
