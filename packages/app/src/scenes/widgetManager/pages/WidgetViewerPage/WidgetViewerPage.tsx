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

  const visualizeSection = (widgetInfo: WidgetInfoModelType | null, msg: string) => {
    switch (widgetInfo?.type) {
      case WidgetEnum.PROFILE:
        return <widgets.ProfileWidget />;
      case WidgetEnum.EXPLORE:
        return <widgets.ExploreWidget />;
      case WidgetEnum.ODYSSEY_INFO:
        return <widgets.OdysseyInfoWidget />;
      default:
        return <div>{msg}</div>;
    }
  };

  return (
    <styled.Container data-testid="WidgetListPage-test">
      <styled.LeftSection>
        <styled.Widget>{visualizeSection(leftActiveWidget, 'LEFT')}</styled.Widget>
      </styled.LeftSection>

      <styled.RightSection>
        <styled.Widget>{visualizeSection(rightActiveWidget, 'RIGHT')}</styled.Widget>
      </styled.RightSection>
    </styled.Container>
  );
};

export default observer(WidgetViewerPage);
