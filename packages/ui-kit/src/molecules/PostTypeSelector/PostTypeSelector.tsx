import {FC} from 'react';
import {useI18n, PostTypeEnum} from '@momentum-xyz/core';

import {Frame, IconSvg} from '../../atoms';
import {PostHeading} from '../PostHeading';
import {PostAuthorInterface} from '../../interfaces';

import * as styled from './PostTypeSelector.styled';

export interface PostTypeSelectorPropsInterface {
  author: PostAuthorInterface;
  canPostEvents?: boolean;
  onSelect: (type: PostTypeEnum) => void;
}

const PostTypeSelector: FC<PostTypeSelectorPropsInterface> = ({
  author,
  canPostEvents,
  onSelect
}) => {
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
            <styled.PostTypeSelectionTypeButton onClick={() => onSelect(PostTypeEnum.SCREENSHOT)}>
              <IconSvg size="xll" isWhite name="photo_camera" />
              <span>{t('actions.takeSnapshot')}</span>
            </styled.PostTypeSelectionTypeButton>

            <styled.PostTypeSelectionTypeButton onClick={() => onSelect(PostTypeEnum.VIDEO)}>
              <IconSvg size="xll" isWhite name="camera" />
              <span>{t('actions.createVideo')}</span>
            </styled.PostTypeSelectionTypeButton>

            {canPostEvents && (
              <styled.PostTypeSelectionTypeButton onClick={() => onSelect(PostTypeEnum.EVENT)}>
                <IconSvg size="xll" isWhite name="calendar" />
                <span>{t('actions.createEvent')}</span>
              </styled.PostTypeSelectionTypeButton>
            )}
          </styled.PostTypeSelectionTypes>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default PostTypeSelector;
