import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {PanelLayout} from 'ui-kit';

import * as styled from './EmojiWidget.styled';
import {EmojiItem} from './components/';

interface PropsInterface {
  onClose: () => void;
}

const EmojiWidget: FC<PropsInterface> = ({onClose}) => {
  const {widgetStore} = useStore();
  const {emojiStore} = widgetStore;
  const {emojiDetailsList} = emojiStore;

  const {t} = useTranslation();

  return (
    <PanelLayout title={t('labels.emoji')} onClose={onClose}>
      <styled.Container>
        <styled.EmojiList>
          {emojiDetailsList.map((em) => (
            <EmojiItem emoji={em} onClick={() => alert('Soon! ' + em.name)} key={em.id} />
          ))}
        </styled.EmojiList>
      </styled.Container>
    </PanelLayout>
  );
};

export default observer(EmojiWidget);
