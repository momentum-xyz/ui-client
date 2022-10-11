import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {Button} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {HelpSectionEnum} from 'scenes/widgets/stores/HelpStore';

import * as styled from './Wiki.styled';

const WIKI_URL = 'https://momentum-xyz.github.io/docs/category/learn/';

const Wiki: React.FC = () => {
  const {
    widgetStore: {helpStore}
  } = useStore();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionEnum.Wiki);
  };

  const handleLinkClick = () => {
    window.open(WIKI_URL, '_blank');
  };

  return (
    <Section
      name={t('helpSection.wiki.title')}
      icon="notes"
      expanded={helpStore.showWikiSection}
      onExpandToggle={handleExpand}
    >
      <styled.TextItem>
        {t('helpSection.wiki.partOne')}
        <styled.HighlightedSpan>{t('helpSection.wiki.highlightedPart')}</styled.HighlightedSpan>
        {t('helpSection.wiki.partTwo')}
      </styled.TextItem>
      <styled.Buttons>
        <Button label={t('helpSection.wiki.link')} icon="notes" onClick={handleLinkClick} />
      </styled.Buttons>
    </Section>
  );
};

export default observer(Wiki);
