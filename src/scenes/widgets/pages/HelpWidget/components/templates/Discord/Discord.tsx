import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import cn from 'classnames';
import {t} from 'i18next';

import {Button, Heading, IconSvg, Text} from 'ui-kit';

import * as styled from './Discord.styled';

const Discord: React.FC = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // TODO move to Backend in next iteration
  const momentumDiscord = 'https://discord.gg/6PH9nSu7UP';
  const techSupportDiscord = 'https://discord.gg/VfTmyeguDC';

  const handleExpand = () => {
    setIsOpen(!isOpen);
  };

  const handleSupportChannelClick = () => {
    window.open(momentumDiscord, '_blank');
  };

  const handleServerClick = () => {
    window.open(techSupportDiscord, '_blank');
  };
  return (
    <styled.Container>
      <styled.TopContainer onClick={handleExpand}>
        <styled.Div>
          <IconSvg name={t('helpSection.discord.iconLabel')} size="large" />
          <Heading
            theme={theme}
            label={t('helpSection.discord.dropDownLabel')}
            align="left"
            type="h1"
            weight="bold"
            transform="uppercase"
          />
        </styled.Div>
        <styled.Div>
          <Text
            text={isOpen ? t('helpSection.closeLabel') : t('helpSection.openLabel')}
            align="left"
            weight="normal"
            size="xs"
            theme={theme}
          />
          <styled.DropDownIcon className={cn({opened: isOpen})}>
            <IconSvg name="chevron" size="normal" isCustom onClick={handleExpand} />
          </styled.DropDownIcon>
        </styled.Div>
      </styled.TopContainer>
      <styled.BottomContainer className={cn({hide: !isOpen})}>
        <styled.Border />
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
            isCustom
          />
          <Button
            theme={theme}
            label={t('helpSection.discord.supportButtonLabel')}
            icon={t('helpSection.discord.iconLabel')}
            onClick={handleSupportChannelClick}
            isCustom
          />
        </styled.Buttons>
      </styled.BottomContainer>
    </styled.Container>
  );
};

export default observer(Discord);
