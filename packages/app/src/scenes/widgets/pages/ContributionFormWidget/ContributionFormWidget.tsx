import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './ContributionFormWidget.styled';

const ContributionFormWidget: FC = () => {
  const {widgetManagerStore, widgetStore} = useStore();

  const {t} = useI18n();

  console.log(widgetStore);

  return (
    <styled.Container data-testid="ContributionFormWidget-test">
      <Panel
        size="normal"
        isFullHeight
        variant="primary"
        icon="person_idea"
        title={t('labels.contribute')}
        onClose={() => widgetManagerStore.close(WidgetEnum.CONTRIBUTION_FORM)}
      >
        <styled.Wrapper>XXX</styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(ContributionFormWidget);
