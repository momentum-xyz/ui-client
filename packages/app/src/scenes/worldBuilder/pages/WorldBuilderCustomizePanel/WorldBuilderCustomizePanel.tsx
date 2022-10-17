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
import {useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';
// import background from 'static/images/bg.png';

import * as styled from './WorldBuilderCustomizePanel.styled';

const tabs: NavigationTabInterface[] = [
  {
    path: ROUTES.worldBuilder.builderSkybox,
    iconName: 'planet'
  }
];

const SkyboxSelector: FC = () => {
  return <div>hello</div>;
};

const WORLD_BUILDER_ROUTES = [
  {
    path: ROUTES.worldBuilder.builderSkybox,
    main: () => <SkyboxSelector />,
    exact: true
  }
];

const WorldBuilderCustomizePanel: FC = () => {
  const {worldBuilderStore} = useStore();
  console.log('worldBuilderStore', worldBuilderStore);
  // const {worldBuilderTemplatesStore} = worldBuilderStore;
  // const {selectedTemplate} = worldBuilderTemplatesStore;
  // const {unityStore} = mainStore;

  const history = useHistory();

  // const {t} = useTranslation();
  const theme = useTheme();

  // const handleSearchFocus = (isFocused: boolean) => {
  //   unityStore.changeKeyboardControl(!isFocused);
  // };

  return (
    <Dialog
      theme={theme}
      title="World Builder Menu"
      // headerStyle="uppercase"
      showCloseButton
      // showOverflow
      // withOpacity
      isBodyExtendingToEdges
      onClose={() => history.push(ROUTES.base)}
    >
      <styled.Container>
        <Navigation tabs={tabs} />
      </styled.Container>
      {createSwitchByConfig(WORLD_BUILDER_ROUTES)}
    </Dialog>
  );
};

export default observer(WorldBuilderCustomizePanel);
