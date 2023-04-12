import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {WidgetInfoModelType} from 'stores/WidgetManagerStore';
import * as widgets from 'scenes/widgets/pages';

import * as styled from './WidgetViewerPage.styled';

const WidgetViewerPage: FC = () => {
  const {widgetManagerStore} = useStore();
  const {leftActiveWidget, rightActiveWidget} = widgetManagerStore;

  const visualizeSection = (widgetInfo: WidgetInfoModelType | null) => {
    switch (widgetInfo?.type) {
      case WidgetEnum.LOGIN:
        return <widgets.LoginWidget />;
      case WidgetEnum.PROFILE:
        return <widgets.ProfileWidget />;
      case WidgetEnum.EXPLORE:
        return <widgets.ExploreWidget />;
      case WidgetEnum.WORLD_OVERVIEW:
        return <widgets.WorldOverviewWidget />;
      case WidgetEnum.STAKING_OVERVIEW:
        return <widgets.StakingOverviewWidget />;
      default:
        return <></>;
    }
  };

  return (
    <styled.Container data-testid="WidgetListPage-test">
      <styled.LeftSection>
        <styled.Widget>{visualizeSection(leftActiveWidget)}</styled.Widget>
      </styled.LeftSection>

      {/* TEST */}
      <styled.Widget>
        <widgets.StakingContractsTestWidget />
      </styled.Widget>

      <styled.RightSection>
        <styled.Widget>{visualizeSection(rightActiveWidget)}</styled.Widget>
      </styled.RightSection>
    </styled.Container>
  );
};

export default observer(WidgetViewerPage);
