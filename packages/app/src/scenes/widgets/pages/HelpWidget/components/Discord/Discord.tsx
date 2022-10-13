import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {t} from 'i18next';
import {Button} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {HelpSectionEnum} from 'scenes/widgets/stores/HelpStore';

import * as styled from './Discord.styled';

const Discord: React.FC = () => {
  const theme = useTheme();
  const {
    widgetStore: {helpStore}
  } = useStore();

  // TODO move to Backend in next iteration
  const momentumDiscord = 'https://discord.gg/6PH9nSu7UP';
  const techSupportDiscord = 'https://discord.gg/VfTmyeguDC';

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionEnum.Discord);
  };

  const handleSupportChannelClick = () => {
    window.open(momentumDiscord, '_blank');
  };

  const handleServerClick = () => {
    window.open(techSupportDiscord, '_blank');
  };
  return (
    <Section
      name={t('helpSection.discord.dropDownLabel')}
      icon="discord"
      expanded={helpStore.showDiscordSection}
      onExpandToggle={handleExpand}
    >
      <styled.TextItemTop>
        {t('helpSection.discord.topTextOne')}
        <styled.ServerSpan onClick={handleServerClick}>
          {t('helpSection.discord.topTextBold')}
        </styled.ServerSpan>
      </styled.TextItemTop>
      <styled.TextItemBottom>
        {t('helpSection.discord.bottomTextOne')}
        <styled.ServerSpan onClick={handleSupportChannelClick}>
          {t('helpSection.discord.bottomTextBold')}
        </styled.ServerSpan>
        {t('helpSection.discord.bottomTextTwo')}
      </styled.TextItemBottom>
      <styled.Buttons>
        <Button
          theme={theme}
          label={t('helpSection.discord.serverButtonLabel')}
          icon={t('helpSection.discord.iconLabel')}
          onClick={handleServerClick}
        />
        <Button
          theme={theme}
          label={t('helpSection.discord.supportButtonLabel')}
          icon={t('helpSection.discord.iconLabel')}
          onClick={handleSupportChannelClick}
        />
      </styled.Buttons>
    </Section>
  );
};

export default observer(Discord);
