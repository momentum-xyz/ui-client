import {FC} from 'react';
import {ToolbarIcon, ToolbarIconInterface, Text, IconSvg} from '@momentum-xyz/ui-kit';
import {generatePath, useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './WorldBuilderWidget.styled';

const WorldBuilderWidget: FC = () => {
  const {worldStore} = useStore().mainStore;

  const collapsedItem: ToolbarIconInterface = {
    title: 'World Builder',
    icon: 'planet',
    size: 'medium',
    link: generatePath(ROUTES.odyssey.builder.base, {worldId: worldStore.worldId})
  };

  const expandedItems: ToolbarIconInterface[] = [
    {
      title: 'Close World Builder',
      // icon: 'planet',
      icon: 'close',
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

  const isBuilderMode = pathname.includes(
    generatePath(ROUTES.odyssey.builder.base, {worldId: worldStore.worldId})
  );

  if (isBuilderMode) {
    return (
      <styled.ActiveIconsContainer>
        {expandedItems.map((item) => (
          <ToolbarIcon key={item.title} {...item} />
        ))}
        <styled.StandoutBuilderModeContainer>
          <IconSvg name="planet" size="large" />
          <Text
            text="World Builder Mode Enabled"
            size="xxs"
            transform="uppercase"
            isMultiline={false}
          />
        </styled.StandoutBuilderModeContainer>
      </styled.ActiveIconsContainer>
    );
  }

  return <ToolbarIcon {...collapsedItem} />;
};

export default WorldBuilderWidget;
