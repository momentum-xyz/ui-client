import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import background from 'static/images/worldBuilder.png';
import {Page, WorldBuilderFooter, WorldBuilderHeader, WorldBuilderTemplateItem} from 'ui-kit';

import * as styled from './WorldBuilderTemplatePage.styled';

const CURRENT_STEP = 1;

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
        <WorldBuilderHeader size="small" />
        <styled.TemplatesList>
          {worldBuilderTemplatesStore.templates.map((template) => (
            <WorldBuilderTemplateItem
              key={template.id}
              name={template.name}
              description={template.description}
              imageSrc={template.imageSrc}
              onClick={() => {
                worldBuilderTemplatesStore.selectTemplate(template);
                history.push(ROUTES.worldBuilder.generate);
              }}
            />
          ))}
        </styled.TemplatesList>
        <WorldBuilderFooter
          currentStep={CURRENT_STEP}
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
