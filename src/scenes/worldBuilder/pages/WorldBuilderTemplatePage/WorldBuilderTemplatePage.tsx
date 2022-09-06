import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';

import {WorldBuilderFooter, WorldBuilderHeader} from 'scenes/worldBuilder/components';
import {WorldBuilderTemplateModelInterface} from 'scenes/worldBuilder/stores/WorldBuilderTemplatesStore/models';
import {useStore} from 'shared/hooks';
import background from 'static/images/worldBuilder.png';
import {Page} from 'ui-kit';

import {WorldBuilderTemplateItem} from './components';
import * as styled from './WorldBuilderTemplatePage.styled';

const WorldBuilderTemplatePage: FC = () => {
  const {worldBuilderTemplatesStore} = useStore().worldBuilderStore;

  useEffect(() => {
    worldBuilderTemplatesStore.fetchTemplates();

    return () => {
      worldBuilderTemplatesStore.resetModel();
    };
  }, [worldBuilderTemplatesStore]);

  return (
    <Page backgroundSrc={background} showSimpleProfileMenu>
      <styled.Container>
        <styled.Spacer />
        <WorldBuilderHeader size="small" />
        <styled.TemplatesList>
          {worldBuilderTemplatesStore.templates.map(
            (template: WorldBuilderTemplateModelInterface) => (
              <WorldBuilderTemplateItem
                key={template.id}
                template={template}
                onClick={() => {
                  // TODO: go to generate page
                }}
              />
            )
          )}
        </styled.TemplatesList>
        <WorldBuilderFooter currentStep={1} showButton={false} />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderTemplatePage);
