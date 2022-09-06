import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {
  WorldBuilderFooter,
  WorldBuilderHeader,
  WorldBuilderTemplateItem
} from 'scenes/worldBuilder/components';
import {WorldBuilderTemplateModelInterface} from 'scenes/worldBuilder/stores/WorldBuilderTemplatesStore/models';
import {useStore} from 'shared/hooks';
import background from 'static/images/worldBuilder.png';
import {Page} from 'ui-kit';

import * as styled from './WorldBuilderTemplatePage.styled';

const WorldBuilderTemplatePage: FC = () => {
  const {worldBuilderTemplatesStore} = useStore().worldBuilderStore;

  const history = useHistory();

  useEffect(() => {
    worldBuilderTemplatesStore.unselectTemplate();
    worldBuilderTemplatesStore.fetchTemplates();
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
                  worldBuilderTemplatesStore.selectTemplate(template);
                  history.push(ROUTES.worldBuilder.generate);
                }}
              />
            )
          )}
        </styled.TemplatesList>
        <WorldBuilderFooter
          currentStep={1}
          showButton={false}
          onNext={() => {
            // TODO: Go to url for building world in unity that will be retrieved from API
          }}
        />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderTemplatePage);
