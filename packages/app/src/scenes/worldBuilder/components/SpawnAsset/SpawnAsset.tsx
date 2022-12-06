import {FC} from 'react';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {Heading, SvgButton} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';

import {SpawnAssetMenu} from './components';
import {SPAWN_ASSET_ROUTES} from './SpawnAsset.routes';
import * as styled from './SpawnAsset.styled';

const SpawnAsset: FC = () => {
  const {worldId} = useParams<{worldId: string}>();
  const history = useHistory();

  return (
    <styled.Wrapper>
      <styled.Container>
        <styled.Header>
          <Heading label="Spawn Asset" transform="uppercase" type="h1" />
          <SvgButton
            iconName="close"
            size="medium-large"
            onClick={() => history.push(ROUTES.base)}
          />
        </styled.Header>
        <styled.Body>
          <SpawnAssetMenu worldId={worldId} />
          <styled.PageContainer>
            {createSwitchByConfig(
              SPAWN_ASSET_ROUTES,
              generatePath(ROUTES.spawnAsset.basicAssets, {worldId})
            )}
          </styled.PageContainer>
        </styled.Body>
      </styled.Container>
    </styled.Wrapper>
  );
};

export default SpawnAsset;
