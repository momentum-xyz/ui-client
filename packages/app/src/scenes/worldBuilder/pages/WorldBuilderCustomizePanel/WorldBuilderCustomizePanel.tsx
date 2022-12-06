import {FC} from 'react';
import {observer} from 'mobx-react-lite';
// import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {
  Dialog,
  Navigation,
  NavigationTabInterface
  // Loader
} from '@momentum-xyz/ui-kit';
import {generatePath, useHistory} from 'react-router-dom';

// import {useStore} from 'shared/hooks';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';

import * as styled from './WorldBuilderCustomizePanel.styled';
import {WORLD_BUILDER_ROUTES} from './WorldBuilderCustomizePanel.routes';

const WorldBuilderCustomizePanel: FC = () => {
  const {mainStore} = useStore();
  const {worldStore} = mainStore;

  const history = useHistory();

  // const {t} = useTranslation();
  const theme = useTheme();

  const tabs: NavigationTabInterface[] = [
    {
      path: generatePath(ROUTES.odyssey.builder.skybox, {worldId: worldStore.worldId}),
      iconName: 'planet'
    },
    {
      path: generatePath(ROUTES.odyssey.builder.uploadAsset, {worldId: worldStore.worldId}),
      iconName: 'add'
    }
  ];

  // const handleSearchFocus = (isFocused: boolean) => {
  //   unityStore.changeKeyboardControl(!isFocused);
  // };

  return (
    <Dialog
      theme={theme}
      // title="World Builder Menu"
      // headerStyle="uppercase"
      showBackground={false}
      showCloseButton
      // showOverflow
      // withOpacity
      isBodyExtendingToEdges
      onClose={() => history.push(generatePath(ROUTES.odyssey.base, {worldId: worldStore.worldId}))}
    >
      <styled.Container>
        <Navigation tabs={tabs} />
        {createSwitchByConfig(WORLD_BUILDER_ROUTES, WORLD_BUILDER_ROUTES[0].path)}
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldBuilderCustomizePanel);
