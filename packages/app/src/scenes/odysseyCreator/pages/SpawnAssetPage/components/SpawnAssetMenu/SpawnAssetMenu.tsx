import React, {FC} from 'react';
import {generatePath, matchPath, useHistory, useLocation} from 'react-router-dom';
import {SearchInput} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import * as styled from './SpawnAssetMenu.styled';

interface PropsInterface {
  worldId: string;
}

const SpawnAssetMenu: FC<PropsInterface> = ({worldId}) => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {unityInstanceStore} = unityStore;
  const {spawnAssetStore} = odysseyCreatorStore;
  const {searchQuery} = spawnAssetStore;

  const location = useLocation();
  const history = useHistory();
  const {t} = useTranslation();

  return (
    <styled.Container>
      <styled.Search>
        <SearchInput
          variant="secondary"
          value={searchQuery.query}
          placeholder={t(`placeholders.searchForAssets`)}
          onFocus={() => unityInstanceStore.changeKeyboardControl(false)}
          onBlur={() => unityInstanceStore.changeKeyboardControl(true)}
          onChange={searchQuery.setQuery}
        />
      </styled.Search>

      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.odyssey.creator.spawnAsset.basicAssets}) &&
            'selected'
        )}
        onClick={() =>
          history.push(generatePath(ROUTES.odyssey.creator.spawnAsset.basicAssets, {worldId}))
        }
      >
        <styled.TabText text={t('labels.basicAssetPack')} size="l" weight="light" align="left" />
      </styled.Tab>
      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.odyssey.creator.spawnAsset.standardAssets}) &&
            'selected'
        )}
        onClick={() =>
          history.push(generatePath(ROUTES.odyssey.creator.spawnAsset.standardAssets, {worldId}))
        }
      >
        <styled.TabText text={t('labels.standardAssetPack')} size="l" weight="light" align="left" />
      </styled.Tab>
      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.odyssey.creator.spawnAsset.customAssets}) &&
            'selected'
        )}
        onClick={() =>
          history.push(generatePath(ROUTES.odyssey.creator.spawnAsset.customAssets, {worldId}))
        }
      >
        <styled.TabText
          text={t('labels.customObjectLibrary')}
          size="l"
          weight="light"
          align="left"
        />
      </styled.Tab>
      <styled.Tab
        className={cn(
          matchPath(location.pathname, {path: ROUTES.odyssey.creator.spawnAsset.uploadAsset}) &&
            'selected'
        )}
        onClick={() =>
          history.push(generatePath(ROUTES.odyssey.creator.spawnAsset.uploadAsset, {worldId}))
        }
      >
        <styled.TabText
          text={t('labels.uploadCustomObject')}
          size="l"
          weight="light"
          align="left"
        />
      </styled.Tab>
    </styled.Container>
  );
};

export default observer(SpawnAssetMenu);
