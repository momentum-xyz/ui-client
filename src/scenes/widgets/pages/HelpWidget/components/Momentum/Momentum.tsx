import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Button} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {MOMENTUM_SPACE_DEV, MOMENTUM_SPACE} from 'core/constants';

import * as styled from './Momentum.styled';

const Momentum: React.FC = () => {
  const {
    widgetStore: {helpStore},
    mainStore: {unityStore}
  } = useStore();

  const handleExpand = () => {
    helpStore.toggleSection('Momentum');
  };

  const handleFlyToSpace = () => {
    if (process.env.NODE_ENV === 'development') {
      unityStore.teleportToSpace(MOMENTUM_SPACE_DEV);
    } else {
      unityStore.teleportToSpace(MOMENTUM_SPACE);
    }
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
        <Button
          label={t('helpSection.momentum.visitSpace')}
          icon="fly-to"
          onClick={handleFlyToSpace}
        />
      </styled.Buttons>
    </Section>
  );
};

export default observer(Momentum);
