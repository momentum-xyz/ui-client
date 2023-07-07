import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './CustomViewer.styled';

const CustomViewer: FC = () => {
  return <styled.Container data-testid="CustomViewer-test">CUSTOM</styled.Container>;
};

export default observer(CustomViewer);
