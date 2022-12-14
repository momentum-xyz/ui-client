import {FC} from 'react';
import {Portal, Tooltip} from '@momentum-xyz/ui-kit';

import * as styled from './CreatorMenu.styled';

interface PropsInterface {
  onSkyboxClick: () => void;
  onAddObject: () => void;
}

const CreatorMenu: FC<PropsInterface> = ({onSkyboxClick, onAddObject}) => {
  return (
    <Portal>
      <styled.Container>
        <Tooltip label="Skybox">
          <styled.MenuItem onClick={onSkyboxClick}>
            <styled.MenuText name="skybox" size="large" />
          </styled.MenuItem>
        </Tooltip>
        <Tooltip label="Add object">
          <styled.MenuItem onClick={onAddObject}>
            <styled.MenuText name="add" size="medium-large" />
          </styled.MenuItem>
        </Tooltip>
      </styled.Container>
    </Portal>
  );
};

export default CreatorMenu;
