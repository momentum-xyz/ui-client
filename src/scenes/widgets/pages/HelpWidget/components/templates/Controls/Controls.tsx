import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import cn from 'classnames';
import {t} from 'i18next';

import {Heading, IconSvg, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './Controls.styled';

const Controls: React.FC = () => {
  const theme = useTheme();
  const {
    widgetStore: {helpStore}
  } = useStore();

  const handleExpand = () => {
    helpStore.toggleSection('Controls');
  };

  return (
    <styled.Container>
      <styled.TopContainer onClick={handleExpand}>
        <styled.Div>
          <IconSvg name={t('helpSection.controls.iconLabel')} size="large" />
          <Heading
            theme={theme}
            label={t('helpSection.controls.dropDownLabel')}
            align="left"
            type="h1"
            weight="bold"
            transform="uppercase"
          />
        </styled.Div>
        <styled.Div>
          <Text
            text={
              helpStore.showControlsSection
                ? t('helpSection.closeLabel')
                : t('helpSection.openLabel')
            }
            align="left"
            weight="normal"
            size="xs"
            theme={theme}
          />
          <styled.DropDownIcon className={cn({opened: helpStore.showControlsSection})}>
            <IconSvg name="chevron" size="normal" isCustom onClick={handleExpand} />
          </styled.DropDownIcon>
        </styled.Div>
      </styled.TopContainer>
      {helpStore.showControlsSection && (
        <styled.BottomContainer>
          <styled.Border />
          <styled.IconsContainer>
            <styled.ItemRowContainer>
              <styled.TextItem>
                {t('helpSection.controls.buttonsText')}
                <br />
                <styled.ServerSpan>{t('helpSection.controls.wLetter')}</styled.ServerSpan>
                {t('helpSection.controls.forwardLabel')}
                <br />
                <styled.ServerSpan>{t('helpSection.controls.aLetter')}</styled.ServerSpan>
                {t('helpSection.controls.leftLabel')}
                <br />
                <styled.ServerSpan>{t('helpSection.controls.sLetter')}</styled.ServerSpan>
                {t('helpSection.controls.backwardLabel')}
                <br />
                <styled.ServerSpan>{t('helpSection.controls.dLetter')}</styled.ServerSpan>
                {t('helpSection.controls.rightLabel')}
                <br />
                <styled.ServerSpan>{t('helpSection.controls.qLetter')}</styled.ServerSpan>
                {t('helpSection.controls.downWardLabel')}
                <br />
                <styled.ServerSpan>{t('helpSection.controls.eLetter')}</styled.ServerSpan>
                {t('helpSection.controls.upWardLabel')}
                <br />
              </styled.TextItem>
              <IconSvg name={t('helpSection.controls.buttonsIconLabel')} size="huge" />
            </styled.ItemRowContainer>
            <styled.ItemRowContainer>
              <styled.TextItem>
                {t('helpSection.controls.arrowsTextFirst')}
                <styled.ServerSpan>{t('helpSection.controls.arrowsBoldText')}</styled.ServerSpan>
                {t('helpSection.controls.arrowsTextSecond')}
              </styled.TextItem>
              <IconSvg name={t('helpSection.controls.arrowsIconLabel')} size="huge" />
            </styled.ItemRowContainer>
            <styled.ItemRowContainer>
              <styled.TextItem>
                Hold <styled.ServerSpan>Shift</styled.ServerSpan> while flying: Fast flight mode
              </styled.TextItem>
              <IconSvg name={t('helpSection.controls.shiftIconLabel')} size="super-large" />
            </styled.ItemRowContainer>
            <styled.ItemRowContainer>
              <styled.TextItem>
                <styled.ServerSpan>
                  {t('helpSection.controls.mouseBoldTextFirst')}
                </styled.ServerSpan>
                {t('helpSection.controls.mousePadTextFirst')}
                <styled.ServerSpan>{t('helpSection.controls.trackPadBoldText')}</styled.ServerSpan>
                {t('helpSection.controls.mousePadTextSecond')}
                <br />
                <styled.ServerSpan>
                  {t('helpSection.controls.mouseBoldTextSecond')}
                </styled.ServerSpan>
                {t('helpSection.controls.mousePadTextThird')}
              </styled.TextItem>
              <IconSvg name={t('helpSection.controls.mousePadIconLabel')} size="huge" />
            </styled.ItemRowContainer>
            <styled.ItemRowContainer>
              <styled.TextItem>
                {t('helpSection.controls.spaceBarTextFirst')}
                <styled.ServerSpan>{t('helpSection.controls.spaceBarBoldText')}</styled.ServerSpan>
                {t('helpSection.controls.spaceBarTextSecond')}
              </styled.TextItem>
              <IconSvg name={t('helpSection.controls.spaceBarIconLabel')} size="huge" isCustom />
            </styled.ItemRowContainer>
          </styled.IconsContainer>
        </styled.BottomContainer>
      )}
    </styled.Container>
  );
};

export default observer(Controls);
