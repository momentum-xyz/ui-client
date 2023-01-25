import {FC} from 'react';
import {Portal, Tooltip} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './CreatorMenu.styled';

interface PropsInterface {
  onSkyboxClick: () => void;
  onAddObject: () => void;
}

const CreatorMenu: FC<PropsInterface> = ({onSkyboxClick, onAddObject}) => {
  const {t} = useTranslation();

  return (
    <Portal>
      <styled.Container data-testid="CreatorMenu-test">
        <Tooltip label={t('labels.skybox')}>
          <styled.MenuItem onClick={onSkyboxClick}>
            <styled.MenuText name="skybox" size="large" />
          </styled.MenuItem>
        </Tooltip>

        <Tooltip label={t('labels.changeMusic')}>
          <styled.MenuItem disabled>
            <styled.MenuText name="music" size="medium-large" />
          </styled.MenuItem>
        </Tooltip>

        <Tooltip label={t('labels.tokenGating')}>
          <styled.MenuItem disabled>
            <styled.MenuText name="whitelist" size="medium-large" />
          </styled.MenuItem>
        </Tooltip>

        <Tooltip label={t('labels.addObject')}>
          <styled.MenuItem onClick={onAddObject}>
            <styled.MenuText name="add" size="medium-large" />
          </styled.MenuItem>
        </Tooltip>
      </styled.Container>
    </Portal>
  );
};

export default CreatorMenu;
