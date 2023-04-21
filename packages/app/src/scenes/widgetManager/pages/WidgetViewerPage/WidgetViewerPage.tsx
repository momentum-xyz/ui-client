import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';
import * as widgets from 'scenes/widgets/pages';

import * as styled from './WidgetViewerPage.styled';

const WidgetViewerPage: FC = () => {
  const {widgetManagerStore} = useStore();
  const {leftActiveWidget, rightActiveWidget} = widgetManagerStore;

  const visualizeSection = (widgetInfo: WidgetInfoModelInterface) => {
    switch (widgetInfo?.type) {
      case WidgetEnum.LOGIN:
        return <widgets.LoginWidget />;
      case WidgetEnum.MY_PROFILE:
        return <widgets.ProfileWidget />;
      case WidgetEnum.EXPLORE:
        return <widgets.ExploreWidget />;
      case WidgetEnum.USER_DETAILS:
        return <widgets.UserDetailsWidget {...widgetInfo} />;
      case WidgetEnum.WORLD_DETAILS:
        return <widgets.WorldDetailsWidget {...widgetInfo} />;
      case WidgetEnum.STAKING_VIEW:
        return <widgets.StakingViewWidget />;
      case WidgetEnum.VOICE_CHAT:
        return <widgets.VoiceChatWidget />;
      default:
        return <></>;
    }
  };

  return (
    <styled.Container data-testid="WidgetListPage-test">
      <styled.LeftSection>
        <styled.Widget>{leftActiveWidget && visualizeSection(leftActiveWidget)}</styled.Widget>
      </styled.LeftSection>

      {/* TEST */}
      {/* <styled.Widget>
        <widgets.StakingContractsTestWidget />
      </styled.Widget> */}

      <styled.RightSection>
        <styled.Widget>{rightActiveWidget && visualizeSection(rightActiveWidget)}</styled.Widget>
      </styled.RightSection>
    </styled.Container>
  );
};

export default observer(WidgetViewerPage);
