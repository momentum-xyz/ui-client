import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {OdysseyInfoWidget, ProfileWidget} from 'scenes/widgets/pages';
import {ExplorePage} from 'scenes/explore/pages';
import {WidgetInfoModelType} from 'stores/WidgetManagerStore';

import * as styled from './WidgetViewerPage.styled';

const WidgetViewerPage: FC = () => {
  const {widgetManagerStore} = useStore();
  const {leftActiveWidget, centerActiveWidget, rightActiveWidget} = widgetManagerStore;

  const visualizeSection = (widgetInfo: WidgetInfoModelType | null, msg: string) => {
    switch (widgetInfo?.type) {
      case WidgetEnum.PROFILE:
        return <ProfileWidget />;
      case WidgetEnum.EXPLORE:
        return <ExplorePage />;
      case WidgetEnum.ODYSSEY_INFO:
        return <OdysseyInfoWidget />;
      default:
        return <div>{msg}</div>;
    }
  };

  return (
    <styled.Container data-testid="WidgetListPage-test">
      <styled.LeftSection>
        <styled.Widget>{visualizeSection(leftActiveWidget, 'LEFT')}</styled.Widget>
      </styled.LeftSection>

      <styled.CenterSection>
        <styled.Widget>{visualizeSection(centerActiveWidget, 'CENTER')}</styled.Widget>
      </styled.CenterSection>

      <styled.RightSection>
        <styled.Widget>{visualizeSection(rightActiveWidget, 'RIGHT')}</styled.Widget>
      </styled.RightSection>
    </styled.Container>
  );
};

export default observer(WidgetViewerPage);
