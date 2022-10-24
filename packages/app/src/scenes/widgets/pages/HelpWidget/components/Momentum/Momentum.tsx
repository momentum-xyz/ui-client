import React from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';
import {t} from 'i18next';
import {Button} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {HelpSectionEnum} from 'scenes/widgets/stores/HelpStore';

import * as styled from './Momentum.styled';

const Momentum: React.FC = () => {
  const {widgetStore, mainStore, flightStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {worldConfig} = worldStore;
  const {helpStore} = widgetStore;

  const history = useHistory();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionEnum.Momentum);
  };

  const handleFlyToSpace = (openCalendar = false) => {
    if (worldConfig?.community_space_id) {
      helpStore.helpDialog.close();
      unityStore.teleportToSpace(worldConfig.community_space_id);
      setTimeout(() => {
        const params = {spaceId: worldConfig.community_space_id};
        history.push(
          openCalendar
            ? generatePath(ROUTES.collaboration.calendar, params)
            : generatePath(ROUTES.collaboration.dashboard, params)
        );
      }, TELEPORT_DELAY_MS);
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
        <styled.HighlightedSpan
          {...(!flightStore.isFlightWithMe && {onClick: () => handleFlyToSpace()})}
        >
          {t('helpSection.momentum.paragraphs.two.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.momentum.paragraphs.two.partTwo')}
      </styled.TextItem>
      <styled.TextItem>
        {t('helpSection.momentum.paragraphs.three.partOne')}
        <styled.HighlightedSpan
          {...(!flightStore.isFlightWithMe && {onClick: () => handleFlyToSpace(true)})}
        >
          {t('helpSection.momentum.paragraphs.three.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.momentum.paragraphs.three.partTwo')}
      </styled.TextItem>
      <styled.TextItem>{t('helpSection.momentum.paragraphs.four')}</styled.TextItem>
      <styled.Buttons>
        <Button
          icon="fly-to"
          label={t('helpSection.momentum.visitSpace')}
          disabled={flightStore.isFlightWithMe}
          onClick={() => handleFlyToSpace()}
        />
      </styled.Buttons>
      {flightStore.isFlightWithMe && (
        <styled.FlightWithMeTextItem>
          {t('helpSection.momentum.visitSpaceDisabled')}
        </styled.FlightWithMeTextItem>
      )}
    </Section>
  );
};

export default observer(Momentum);
