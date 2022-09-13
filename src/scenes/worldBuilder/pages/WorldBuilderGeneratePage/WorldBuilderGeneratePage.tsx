import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Page, WorldBuilderFooter, WorldBuilderTemplateItem} from 'ui-kit';
import background from 'static/images/worldBuilder.png';
import {useStore} from 'shared/hooks';

import * as styled from './WorldBuilderGeneratePage.styled';

const CURRENT_STEP = 2;

const WorldBuilderGeneratePage: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderTemplatesStore} = worldBuilderStore;
  const {selectedTemplate} = worldBuilderTemplatesStore;

  const {t} = useTranslation();

  const handleGenerateWorld = useCallback(async () => {
    const url = await worldBuilderStore.generateWorld();

    if (url) {
      window.location.href = url;
    }
  }, [worldBuilderStore]);

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
        <WorldBuilderFooter
          currentStep={CURRENT_STEP}
          buttonLabel={t('actions.generateWorld')}
          onNext={handleGenerateWorld}
          isButtonDisabled={!worldBuilderStore.canGenerateWorld}
        />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderGeneratePage);
