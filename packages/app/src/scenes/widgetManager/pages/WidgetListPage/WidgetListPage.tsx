import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './WidgetListPage.styled';

const WidgetListPage: FC = () => {
  return (
    <styled.Container data-testid="WidgetListPage-test">
      <styled.LeftSection>
        <styled.Widget>LEFT SECTION</styled.Widget>
      </styled.LeftSection>

      <styled.CenterSection>
        <styled.Widget>CENTER SECTION</styled.Widget>
      </styled.CenterSection>

      <styled.RightSection>
        <styled.Widget>RIGHT SECTION</styled.Widget>
      </styled.RightSection>
    </styled.Container>
  );
};

export default observer(WidgetListPage);
