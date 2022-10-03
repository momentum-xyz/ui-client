import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {PageTopBar} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';
import {Navigation, VisualSettingsPanel} from 'ui-kit';
import {NavigationTabInterface} from 'core/interfaces';
import background from 'static/images/bg.png';

import {STORYBOOK_ROUTES} from './StoryBook.routes';
import * as styled from './StoryBook.styled';

const StoryBook: FC = () => {
  const {themeStore} = useStore().mainStore;

  const theme = useTheme();

  const tabs: NavigationTabInterface[] = [
    {
      path: ROUTES.storyBook.atoms,
      iconName: 'tiles',
      exact: true
    },
    {
      path: ROUTES.storyBook.molecules,
      iconName: 'tiles',
      exact: true
    },
    {
      path: ROUTES.storyBook.organisms,
      iconName: 'tiles',
      exact: true
    }
  ];

  return (
    <styled.StoryBook data-testid="StoryBook-test" background={background}>
      <styled.SettingsContainer>
        <styled.Settings>
          <PageTopBar title="Momentum «storybook»" />
          <VisualSettingsPanel
            theme={theme}
            onAccentColorSelect={themeStore.changeAccentColor}
            onBackgroundColorSelect={themeStore.changeBackgroundColor}
          />
        </styled.Settings>
      </styled.SettingsContainer>

      <styled.Content className="scene-bg">
        <Navigation tabs={tabs} />

        <styled.Components>
          {createSwitchByConfig(STORYBOOK_ROUTES, ROUTES.storyBook.atoms)}
        </styled.Components>
      </styled.Content>
    </styled.StoryBook>
  );
};

export default observer(StoryBook);
