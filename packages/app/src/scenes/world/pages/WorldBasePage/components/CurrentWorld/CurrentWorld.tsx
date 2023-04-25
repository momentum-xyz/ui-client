import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './CurrentWorld.styled';

interface PropsInterface {
  worldId: string;
}

const CurrentWorld: FC<PropsInterface> = ({worldId}) => {
  return (
    <styled.Container data-testid="CurrentWorld-test">
      <div>World:</div>
      <div>{worldId}</div>
    </styled.Container>
  );
};

export default observer(CurrentWorld);
