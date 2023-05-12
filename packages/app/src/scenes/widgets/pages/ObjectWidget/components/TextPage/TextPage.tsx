import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './TextPage.styled';

const TextPage: FC = () => {
  const {objectStore} = useStore();
  const {assetStore} = objectStore;
  const {content} = assetStore;

  return (
    <styled.Container data-testid="TextPage-test">
      <styled.Title>{content?.title}</styled.Title>
      <styled.ScrollableContainer>
        <styled.Text>{content?.content}</styled.Text>
      </styled.ScrollableContainer>
    </styled.Container>
  );
};

export default observer(TextPage);
