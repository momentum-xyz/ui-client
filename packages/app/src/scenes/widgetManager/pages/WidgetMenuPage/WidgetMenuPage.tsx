import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Menu, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetTypeEnum} from 'core/enums';

import * as styled from './WidgetMenuPage.styled';

const WidgetMenuPage: FC = () => {
  const {sessionStore} = useStore();
  const {userImageUrl, isGuest} = sessionStore;

  const [activeKey, setActiveKey] = useState<WidgetTypeEnum>();

  const CENTER_ITEMS: MenuItemInterface<WidgetTypeEnum>[] = [
    {key: WidgetTypeEnum.UNIVERSE, iconName: 'info_2'}
  ];

  const LEFT_ITEMS: MenuItemInterface<WidgetTypeEnum>[] = [
    {key: WidgetTypeEnum.MAIN_MENU, iconName: 'menu_info'},
    {key: WidgetTypeEnum.PROFILE, imageSrc: userImageUrl},
    {key: WidgetTypeEnum.RABBIT, iconName: 'rabbit_fill'},
    {key: WidgetTypeEnum.EMOJI, iconName: 'smiley-face'}
  ];

  return (
    <styled.Container data-testid="WidgetMenuPage-test">
      <Menu
        leftItems={!isGuest ? LEFT_ITEMS : []}
        centerItems={CENTER_ITEMS}
        activeKey={activeKey}
        onChangeActiveKey={(key) => {
          setActiveKey(key);
        }}
      />
    </styled.Container>
  );
};

export default observer(WidgetMenuPage);
