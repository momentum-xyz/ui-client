import {FC} from 'react';
import {generatePath, NavLink} from 'react-router-dom';
import {SearchInput} from '@momentum-xyz/ui-kit';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

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

      <NavLink
        to={generatePath(ROUTES.odyssey.creator.spawnAsset.standardAssets, {worldId})}
        children={({isActive}) => (
          <styled.Tab className={cn(isActive && 'selected')}>
            <styled.TabText
              text={t('labels.standardAssetPack')}
              size="l"
              weight="light"
              align="left"
            />
          </styled.Tab>
        )}
      />

      <NavLink
        to={generatePath(ROUTES.odyssey.creator.spawnAsset.basicAssets, {worldId})}
        children={({isActive}) => (
          <styled.Tab className={cn(isActive && 'selected')}>
            <styled.TabText
              text={t('labels.basicAssetPack')}
              size="l"
              weight="light"
              align="left"
            />
          </styled.Tab>
        )}
      />

      <NavLink
        to={generatePath(ROUTES.odyssey.creator.spawnAsset.customAssets, {worldId})}
        children={({isActive}) => (
          <styled.Tab className={cn(isActive && 'selected')}>
            <styled.TabText
              text={t('labels.customObjectLibrary')}
              size="l"
              weight="light"
              align="left"
            />
          </styled.Tab>
        )}
      />

      <NavLink
        to={generatePath(ROUTES.odyssey.creator.spawnAsset.uploadAsset, {worldId})}
        children={({isActive}) => (
          <styled.Tab className={cn(isActive && 'selected')}>
            <styled.TabText
              text={t('labels.uploadCustomObject')}
              size="l"
              weight="light"
              align="left"
            />
          </styled.Tab>
        )}
      />
    </styled.Container>
  );
};

export default observer(SpawnAssetMenu);
