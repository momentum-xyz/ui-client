import {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useHistory} from 'react-router-dom';
import {Portal, Tooltip} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './CreatorMenu.styled';

const CreatorMenu: FC = () => {
  const {worldId} = useStore().unityStore;

  const history = useHistory();
  const {t} = useTranslation();

  const onAddObjectClick = useCallback(() => {
    history.push(generatePath(ROUTES.odyssey.creator.spawnAsset.base, {worldId}));
  }, [history, worldId]);

  const onSkyboxClick = useCallback(() => {
    history.push(generatePath(ROUTES.odyssey.creator.skybox, {worldId}));
  }, [history, worldId]);

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
          <styled.MenuItem onClick={onAddObjectClick}>
            <styled.MenuText name="add" size="medium-large" />
          </styled.MenuItem>
        </Tooltip>
      </styled.Container>
    </Portal>
  );
};

export default CreatorMenu;
