import {FC} from 'react';
import {ToolbarIcon, ToolbarIconInterface} from '@momentum-xyz/ui-kit';
import {generatePath, useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

const WorldBuilderWidget: FC = () => {
  const {worldStore} = useStore().mainStore;

  const collapsedItem: ToolbarIconInterface = {
    title: 'World Builder',
    icon: 'planet',
    size: 'medium',
    link: generatePath(ROUTES.odyssey.builder.spawnAsset.base, {worldId: worldStore.worldId})
  };

  const expandedItems: ToolbarIconInterface[] = [
    {
      title: 'Close World Builder',
      icon: 'planet',
      size: 'medium',
      link: generatePath(ROUTES.odyssey.base, {worldId: worldStore.worldId})
    },
    {
      title: 'Skybox',
      icon: 'planet',
      size: 'medium',
      link: generatePath(ROUTES.odyssey.builder.skybox, {worldId: worldStore.worldId})
    },
    {
      title: 'Upload',
      icon: 'add',
      size: 'medium',
      link: generatePath(ROUTES.odyssey.builder.spawnAsset.base, {worldId: worldStore.worldId})
    }
    // {
    //   title: 'Spawn Point',
    //   icon: 'planet',
    //   size: 'medium',
    //   link: generatePath(ROUTES.odyssey.builder.spawnAsset.base, {worldId: worldStore.worldId})
    // }
  ];

  const {pathname} = useLocation();

  const isBuilderMode = pathname.includes(ROUTES.worldBuilder.builder);

  if (isBuilderMode) {
    return (
      <>
        {expandedItems.map((item) => (
          <ToolbarIcon key={item.title} {...item} />
        ))}
      </>
    );
  }

  return <ToolbarIcon {...collapsedItem} />;
};

export default WorldBuilderWidget;
