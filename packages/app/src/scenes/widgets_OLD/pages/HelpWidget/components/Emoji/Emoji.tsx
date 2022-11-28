import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Heading, IconSvg} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Section} from 'scenes/widgets_OLD/pages/HelpWidget/components/Section';
import {HelpSectionEnum} from 'scenes/widgets_OLD/stores/HelpStore';

import * as styled from './Emoji.styled';

const Emoji: React.FC = () => {
  const {widgetStore} = useStore();
  const {helpStore} = widgetStore;

  const {t} = useTranslation();

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionEnum.Emoji);
  };

  return (
    <Section
      name={t('helpSection.emoji.title')}
      icon="smiley-face"
      expanded={helpStore.showEmojiSection}
      onExpandToggle={handleExpand}
    >
      <styled.Block>
        <styled.TextItem>
          {t('helpSection.emoji.paragraphs.one.partOne')}
          <styled.HighlightedSpan>
            {t('helpSection.emoji.paragraphs.one.highlightedPart')}
          </styled.HighlightedSpan>
          {t('helpSection.emoji.paragraphs.one.partTwo')}
        </styled.TextItem>
        <styled.EmojiContainer>
          <styled.EmojiList>
            {helpStore.emojiUrls.map((imgSrc, index) => (
              <styled.Emoji key={index}>
                <styled.EmojiImg src={imgSrc} />
              </styled.Emoji>
            ))}
          </styled.EmojiList>
        </styled.EmojiContainer>
      </styled.Block>

      <styled.Block>
        <styled.TextItem>
          {t('helpSection.emoji.paragraphs.two.partOne')}
          <styled.HighlightedSpan>
            {t('helpSection.emoji.paragraphs.two.highlightedPart')}
          </styled.HighlightedSpan>
          {t('helpSection.emoji.paragraphs.two.partTwo')}
        </styled.TextItem>
        <styled.EmojiButtonContainer>
          <styled.SmileContainer>
            <IconSvg name="smiley-face" size="large" />
          </styled.SmileContainer>
          <styled.ArrowContainer>
            <IconSvg name="arrowLeftBig" size="large" />
            <Heading label={t('actions.clickHere')} type="h3" align="left" transform="uppercase" />
          </styled.ArrowContainer>
        </styled.EmojiButtonContainer>
      </styled.Block>

      <styled.TextItem>
        {t('helpSection.emoji.paragraphs.three.partOne')}
        <styled.HighlightedSpan>
          {t('helpSection.emoji.paragraphs.three.highlightedPartOne')}
        </styled.HighlightedSpan>
        {t('helpSection.emoji.paragraphs.three.partTwo')}
        <styled.HighlightedSpan>
          {t('helpSection.emoji.paragraphs.three.highlightedPartTwo')}
        </styled.HighlightedSpan>
        {t('helpSection.emoji.paragraphs.three.partThree')}
      </styled.TextItem>

      <styled.TextItemLast>
        {t('helpSection.emoji.paragraphs.four.partOne')}
        <styled.HighlightedSpan>
          {t('helpSection.emoji.paragraphs.four.highlightedPart')}
        </styled.HighlightedSpan>
        {t('helpSection.emoji.paragraphs.four.partTwo')}
      </styled.TextItemLast>
    </Section>
  );
};

export default observer(Emoji);
