import {FC} from 'react';
import {ToolbarIcon, ToolbarIconInterface, Text, IconSvg} from '@momentum-xyz/ui-kit';
import {generatePath, useHistory, useLocation} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './WorldBuilderWidget.styled';

const WorldBuilderWidget: FC = () => {
  const {unityStore} = useStore();
  const {worldId} = unityStore;

  const history = useHistory();

  const isAdmin = unityStore.isCurrentUserWorldAdmin;

  const collapsedItem: ToolbarIconInterface = {
    title: 'Odyssey Creator',
    icon: 'planet',
    size: 'medium',
    onClick: () => history.push(generatePath(ROUTES.odyssey.creator.base, {worldId}))
    // disabled: !worldStore.isMyWorld
  };

  const expandedItems: ToolbarIconInterface[] = [
    {
      title: 'Close Odyssey Creator',
      // icon: 'planet',
      icon: 'close',
      size: 'medium',
      onClick: () => history.push(generatePath(ROUTES.odyssey.base, {worldId}))
    }
    // {
    //   title: 'Skybox',
    //   icon: 'skybox',
    //   size: 'large',
    //   link: generatePath(ROUTES.odyssey.builder.skybox, {worldId: worldStore.worldId})
    // },
    // {
    //   title: 'Upload',
    //   icon: 'add',
    //   size: 'medium',
    //   link: generatePath(ROUTES.odyssey.builder.spawnAsset.base, {worldId: worldStore.worldId})
    // }
    // {
    //   title: 'Spawn Point',
    //   icon: 'planet',
    //   size: 'medium',
    //   link: generatePath(ROUTES.odyssey.builder.spawnAsset.base, {worldId: worldStore.worldId})
    // }
  ];

  const {pathname} = useLocation();

  const isBuilderMode = pathname.includes(generatePath(ROUTES.odyssey.creator.base, {worldId}));

  if (isBuilderMode) {
    return (
      <styled.ActiveIconsContainer>
        {expandedItems.map((item) => (
          <ToolbarIcon key={item.title} {...item} />
        ))}
        <styled.StandoutBuilderModeContainer>
          <IconSvg name="planet" size="large" />
          <Text
            text="Odyssey Creator Mode Enabled"
            size="xxs"
            transform="uppercase"
            isMultiline={false}
          />
        </styled.StandoutBuilderModeContainer>
      </styled.ActiveIconsContainer>
    );
  }

  return <ToolbarIcon {...collapsedItem} disabled={!isAdmin} />;
};

export default WorldBuilderWidget;
