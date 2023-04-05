import React from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets_OLD/pages/HelpWidget/components/Section';
import {HelpSectionEnum} from 'scenes/widgets_OLD/stores/HelpStore';

import * as styled from './Discord.styled';

const Discord: React.FC = () => {
  const {t} = useI18n();
  const {
    widgetStore_OLD: {helpStore}
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
        <Button label={t('helpSection.discord.serverButtonLabel')} onClick={handleServerClick} />
        <Button
          label={t('helpSection.discord.supportButtonLabel')}
          onClick={handleSupportChannelClick}
        />
      </styled.Buttons>
    </Section>
  );
};

export default observer(Discord);
