import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Page, WorldBuilderFooter, WorldBuilderTemplateItem} from 'ui-kit';
import background from 'static/images/worldBuilder.png';
import {useStore} from 'shared/hooks';

import * as styled from './WorldBuilderGeneratePage.styled';

const CURRENT_STEP = 2;

const WorldBuilderGeneratePage: FC = () => {
  const {worldBuilderTemplatesStore} = useStore().worldBuilderStore;
  const {selectedTemplate} = worldBuilderTemplatesStore;

  const {t} = useTranslation();

  if (!selectedTemplate) {
    return null;
  }

  return (
    <Page backgroundSrc={background} showSimpleProfileMenu>
      <styled.Container>
        <styled.TemplateContainer>
          <WorldBuilderTemplateItem
            name={selectedTemplate.name}
            description={selectedTemplate.description}
            imageSrc={selectedTemplate.imageSrc}
            selected
          />
        </styled.TemplateContainer>
        <WorldBuilderFooter currentStep={CURRENT_STEP} buttonLabel={t('actions.generateWorld')} />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderGeneratePage);
