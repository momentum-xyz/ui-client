import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {WorldBuilderFooter, WorldBuilderHeader} from 'scenes/worldBuilder/components';
import background from 'static/images/worldBuilder.png';
import {Page} from 'ui-kit';

import * as styled from './WorldBuilderTemplatePage.styled';

const WorldBuilderTemplatePage: FC = () => {
  const {t} = useTranslation();

  return (
    <Page backgroundSrc={background} showSimpleProfileMenu>
      <styled.Container>
        <styled.Spacer />
        <WorldBuilderHeader size="small" />
        <styled.TemplatesList>Templates</styled.TemplatesList>
        <WorldBuilderFooter currentStep={1} buttonLabel={t('actions.generateWorld')} />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderTemplatePage);
