import {FC} from 'react';
import {useI18n, TimelineTypeEnum} from '@momentum-xyz/core';

import {Frame, IconSvg} from '../../atoms';
import {PostHeading} from '../PostHeading';
import {PostAuthorInterface} from '../../interfaces';

import * as styled from './PostTypeSelector.styled';

export interface PostTypeSelectorPropsInterface {
  author: PostAuthorInterface;
  onSelect: (type: TimelineTypeEnum) => void;
}

const PostTypeSelector: FC<PostTypeSelectorPropsInterface> = ({author, onSelect}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostTypeSelector-test">
      <Frame>
        {/* HEADER */}
        <PostHeading author={author} />

        <styled.Wrapper>
          <styled.PostTypeSelectionInfo>
            {t('messages.createSnapshotOrVideo')}
          </styled.PostTypeSelectionInfo>
          <styled.PostTypeSelectionTypes>
            <styled.PostTypeSelectionTypeButton
              onClick={() => onSelect(TimelineTypeEnum.SCREENSHOT)}
            >
              <IconSvg size="xll" isWhite name="photo_camera" />
              <span>{t('actions.takeSnapshot')}</span>
            </styled.PostTypeSelectionTypeButton>

            <styled.PostTypeSelectionTypeButton onClick={() => onSelect(TimelineTypeEnum.VIDEO)}>
              <IconSvg size="xll" isWhite name="camera" />
              <span>{t('actions.createVideo')}</span>
            </styled.PostTypeSelectionTypeButton>
          </styled.PostTypeSelectionTypes>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default PostTypeSelector;
