import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router-dom';

import {Button} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {ROUTES} from 'core/constants';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';
import {HelpSectionType} from 'scenes/widgets/stores/HelpStore';

import * as styled from './Momentum.styled';

const Momentum: React.FC = () => {
  const {
    widgetStore: {helpStore},
    mainStore: {unityStore, worldStore}
  } = useStore();

  const {worldConfig} = worldStore;

  const history = useHistory();

  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionType.Momentum);
  };

  const handleFlyToSpace = (openCalendar = false) => {
    if (worldConfig?.community_space_id) {
      joinMeetingSpace(worldConfig.community_space_id).then(() => {
        unityStore.teleportToSpace(worldConfig.community_space_id);
        setTimeout(() => {
          history.push(openCalendar ? ROUTES.collaboration.calendar : ROUTES.collaboration);
        }, 2000);
      });

      helpStore.helpDialog.close();
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
        <styled.HighlightedSpan onClick={() => handleFlyToSpace()}>
          {t('helpSection.momentum.paragraphs.two.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.momentum.paragraphs.two.partTwo')}
      </styled.TextItem>
      <styled.TextItem>
        {t('helpSection.momentum.paragraphs.three.partOne')}
        <styled.HighlightedSpan onClick={() => handleFlyToSpace(true)}>
          {t('helpSection.momentum.paragraphs.three.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.momentum.paragraphs.three.partTwo')}
      </styled.TextItem>
      <styled.TextItem>{t('helpSection.momentum.paragraphs.four')}</styled.TextItem>
      <styled.Buttons>
        <Button
          label={t('helpSection.momentum.visitSpace')}
          icon="fly-to"
          onClick={() => handleFlyToSpace()}
        />
      </styled.Buttons>
    </Section>
  );
};

export default observer(Momentum);
