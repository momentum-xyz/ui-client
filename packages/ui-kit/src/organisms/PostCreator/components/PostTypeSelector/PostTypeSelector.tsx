import {FC} from 'react';
import {useI18n, PostTypeEnum} from '@momentum-xyz/core';

import {IconSvg} from '../../../../atoms';

import * as styled from './PostTypeSelector.styled';

interface PropsInterface {
  canPostEvents?: boolean;
  onSelect: (type: PostTypeEnum) => void;
}

const PostTypeSelector: FC<PropsInterface> = ({canPostEvents, onSelect}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="PostTypeSelector-test">
      <styled.PostTypeSelectionInfo>
        {t('messages.createSnapshotOrVideo')}
      </styled.PostTypeSelectionInfo>
      <styled.PostTypeSelectionTypes>
        <styled.PostTypeSelectionTypeButton onClick={() => onSelect(PostTypeEnum.IMAGE)}>
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
  );
};

export default PostTypeSelector;
