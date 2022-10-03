import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {IconSvg} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets/pages/HelpWidget/components/Section';
import {HelpSectionEnum} from 'scenes/widgets/stores/HelpStore';

import * as styled from './Controls.styled';

const Controls: React.FC = () => {
  const {
    widgetStore: {helpStore}
  } = useStore();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionEnum.Controls);
  };

  return (
    <Section
      name={t('helpSection.controls.dropDownLabel')}
      icon="controls"
      expanded={helpStore.showControlsSection}
      onExpandToggle={handleExpand}
    >
      <styled.ItemRowContainer data-testid="Controls-test">
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
          {t('helpSection.controls.spaceBarTextFirst')}{' '}
          <styled.ServerSpan>{t('helpSection.controls.shiftTextBold')}</styled.ServerSpan>{' '}
          {t('helpSection.controls.shiftTextSecond')}
        </styled.TextItem>
        <IconSvg name={t('helpSection.controls.shiftIconLabel')} size="super-large" />
      </styled.ItemRowContainer>
      <styled.ItemRowContainer>
        <styled.TextItem>
          <styled.ServerSpan>{t('helpSection.controls.mouseBoldTextFirst')}</styled.ServerSpan>
          {t('helpSection.controls.mousePadTextFirst')}
          <styled.ServerSpan>{t('helpSection.controls.trackPadBoldText')}</styled.ServerSpan>
          {t('helpSection.controls.mousePadTextSecond')}
          <br />
          <styled.ServerSpan>{t('helpSection.controls.mouseBoldTextSecond')}</styled.ServerSpan>
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
        <styled.SpaceBarIcon name={t('helpSection.controls.spaceBarIconLabel')} size="huge" />
      </styled.ItemRowContainer>
    </Section>
  );
};

export default observer(Controls);
