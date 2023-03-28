import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {WidgetTypeEnum} from 'core/enums';
import {ProfileWidget} from 'scenes/widgets/pages';
import {ExplorePage} from 'scenes/explore/pages';

import * as styled from './WidgetViewerPage.styled';

const WidgetViewerPage: FC = () => {
  const {widgetManagerStore} = useStore();
  const {leftActiveWidget, centerActiveWidget, rightActiveWidget} = widgetManagerStore;

  const visualizeSection = (type: WidgetTypeEnum | undefined, msg: string) => {
    switch (type) {
      case WidgetTypeEnum.PROFILE:
        return <ProfileWidget />;
      case WidgetTypeEnum.EXPLORE:
        return <ExplorePage />;
      default:
        return <div>{msg}</div>;
    }
  };

  return (
    <styled.Container data-testid="WidgetListPage-test">
      <styled.LeftSection>
        <styled.Widget>{visualizeSection(leftActiveWidget?.type, 'LEFT')}</styled.Widget>
      </styled.LeftSection>

      <styled.CenterSection>
        <styled.Widget>{visualizeSection(centerActiveWidget?.type, 'CENTER')}</styled.Widget>
      </styled.CenterSection>

      <styled.RightSection>
        <styled.Widget>{visualizeSection(rightActiveWidget?.type, 'RIGHT')}</styled.Widget>
      </styled.RightSection>
    </styled.Container>
  );
};

export default observer(WidgetViewerPage);
