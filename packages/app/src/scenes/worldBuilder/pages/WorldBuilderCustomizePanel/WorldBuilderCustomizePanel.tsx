import {FC} from 'react';
import {observer} from 'mobx-react-lite';
// import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {
  Dialog
  // Navigation,
  // NavigationTabInterface
  // Loader
} from '@momentum-xyz/ui-kit';
import {useHistory} from 'react-router-dom';

// import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';

// import * as styled from './WorldBuilderCustomizePanel.styled';
import {WORLD_BUILDER_ROUTES} from './WorldBuilderCustomizePanel.routes';

// const tabs: NavigationTabInterface[] = [
//   {
//     path: ROUTES.worldBuilder.builderSkybox,
//     iconName: 'planet'
//   }
// ];

const WorldBuilderCustomizePanel: FC = () => {
  const history = useHistory();

  // const {t} = useTranslation();
  const theme = useTheme();

  // const handleSearchFocus = (isFocused: boolean) => {
  //   unityStore.changeKeyboardControl(!isFocused);
  // };

  return (
    <Dialog
      theme={theme}
      // title="World Builder Menu"
      // headerStyle="uppercase"
      showCloseButton
      // showOverflow
      // withOpacity
      isBodyExtendingToEdges
      onClose={() => history.push(ROUTES.base)}
    >
      {/* <styled.Container>
        <Navigation tabs={tabs} />
      </styled.Container> */}
      {createSwitchByConfig(WORLD_BUILDER_ROUTES, WORLD_BUILDER_ROUTES[0].path)}
    </Dialog>
  );
};

export default observer(WorldBuilderCustomizePanel);
