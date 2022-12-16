import {FC, useEffect} from 'react';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {Heading, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';
import {useStore} from 'shared/hooks';

import {SpawnAssetMenu} from './components';
import {SPAWN_ASSET_ROUTES} from './SpawnAsset.routes';
import * as styled from './SpawnAsset.styled';

const SpawnAsset: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;

  const {worldId} = useParams<{worldId: string}>();
  const history = useHistory();

  const {t} = useTranslation();

  useEffect(() => {
    worldBuilderAssets3dStore.init(worldId);
  }, [worldBuilderAssets3dStore, worldId]);

  return (
    <styled.Wrapper>
      <styled.Container>
        <styled.Header>
          <Heading label={t('titles.spawnAsset')} transform="uppercase" type="h1" />
          <SvgButton
            iconName="close"
            size="medium-large"
            onClick={() => history.push(generatePath(ROUTES.odyssey.builder.base, {worldId}))}
          />
        </styled.Header>
        <styled.Body>
          <SpawnAssetMenu worldId={worldId} />
          <styled.PageContainer>
            {createSwitchByConfig(
              SPAWN_ASSET_ROUTES,
              generatePath(ROUTES.odyssey.builder.spawnAsset.basicAssets, {worldId})
            )}
          </styled.PageContainer>
        </styled.Body>
      </styled.Container>
    </styled.Wrapper>
  );
};

export default observer(SpawnAsset);
