import React from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets_OLD/pages/HelpWidget/components/Section';
import {HelpSectionEnum} from 'scenes/widgets_OLD/stores/HelpStore';

import * as styled from './Momentum.styled';

const Momentum: React.FC = () => {
  const {widgetStore_OLD} = useStore();
  const {helpStore} = widgetStore_OLD;

  const {t} = useI18n();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionEnum.Momentum);
  };

  return (
    <Section
      name={t('helpSection.momentum.title')}
      icon="fly-to"
      expanded={helpStore.showMomentumSection}
      onExpandToggle={handleExpand}
    >
      <styled.TextItem>{t('helpSection.momentum.paragraphs.one')}</styled.TextItem>
      <styled.TextItem>
        {t('helpSection.momentum.paragraphs.two.partOne')}
        <styled.HighlightedSpan>
          {t('helpSection.momentum.paragraphs.two.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.momentum.paragraphs.two.partTwo')}
      </styled.TextItem>
      <styled.TextItem>
        {t('helpSection.momentum.paragraphs.three.partOne')}
        <styled.HighlightedSpan>
          {t('helpSection.momentum.paragraphs.three.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.momentum.paragraphs.three.partTwo')}
      </styled.TextItem>
      <styled.TextItem>{t('helpSection.momentum.paragraphs.four')}</styled.TextItem>
      <styled.Buttons>
        <Button icon="fly-to" label={t('helpSection.momentum.visitSpace')} onClick={() => {}} />
      </styled.Buttons>
    </Section>
  );
};

export default observer(Momentum);
