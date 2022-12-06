import {Text} from '@momentum-xyz/ui-kit';
import {FC} from 'react';
import {generatePath, matchPath, useHistory, useLocation} from 'react-router-dom';
import cn from 'classnames';

import {ROUTES} from 'core/constants';

import * as styled from './SpawnAssetMenu.styled';

interface PropsInterface {
  worldId: string;
}

const SpawnAssetMenu: FC<PropsInterface> = ({worldId}) => {
  const location = useLocation();
  const history = useHistory();

  return (
    <styled.Container>
      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.spawnAsset.basicAssets}) && 'selected'
        )}
        onClick={() => history.push(generatePath(ROUTES.spawnAsset.basicAssets, {worldId}))}
      >
        <Text text="Basic Asset Pack" size="l" weight="light" align="left" />
      </styled.Tab>
      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.spawnAsset.customAssets}) && 'selected'
        )}
        onClick={() => history.push(generatePath(ROUTES.spawnAsset.customAssets, {worldId}))}
      >
        <Text text="Custom Object Library" size="l" weight="light" align="left" />
      </styled.Tab>
      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.spawnAsset.uploadAsset}) && 'selected'
        )}
        onClick={() => history.push(generatePath(ROUTES.spawnAsset.uploadAsset, {worldId}))}
      >
        <Text text="Upload Custom Object" size="l" weight="light" align="left" />
      </styled.Tab>
    </styled.Container>
  );
};

export default SpawnAssetMenu;
