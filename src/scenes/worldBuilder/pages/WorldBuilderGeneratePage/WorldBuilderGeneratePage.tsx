import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Page} from 'ui-kit';
import background from 'static/images/worldBuilder.png';
import {useStore} from 'shared/hooks';
import {WorldBuilderFooter, WorldBuilderTemplateItem} from 'scenes/worldBuilder/components';

import * as styled from './WorldBuilderGeneratePage.styled';

const CURRENT_STEP = 2;

const WorldBuilderGeneratePage: FC = () => {
  const {worldBuilderTemplatesStore} = useStore().worldBuilderStore;

  const {t} = useTranslation();

  if (!worldBuilderTemplatesStore.selectedTemplate) {
    return null;
  }

  return (
    <Page backgroundSrc={background} showSimpleProfileMenu>
      <styled.Container>
        <styled.Spacer />
        <styled.TemplateContainer>
          <WorldBuilderTemplateItem
            template={worldBuilderTemplatesStore.selectedTemplate}
            selected
          />
        </styled.TemplateContainer>
        <WorldBuilderFooter currentStep={CURRENT_STEP} buttonLabel={t('actions.generateWorld')} />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderGeneratePage);
