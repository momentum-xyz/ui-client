import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Button} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {HelpSectionType} from 'scenes/widgets/stores/HelpStore';

import * as styled from './Wiki.styled';

const Wiki: React.FC = () => {
  const {
    widgetStore: {helpStore}
  } = useStore();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionType.Wiki);
  };

  const handleLinkClick = () => {
    window.open('https://wiki.odyssey.org/', '_blank');
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
