import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './TextViewer.styled';

interface PropsInterface {
  title?: string | null;
  text?: string | null;
}

const TextViewer: FC<PropsInterface> = ({title, text}) => {
  return (
    <styled.Container data-testid="TextPage-test">
      <styled.Title>{title}</styled.Title>

      <styled.Wrapper>
        <styled.Text>{text}</styled.Text>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(TextViewer);
