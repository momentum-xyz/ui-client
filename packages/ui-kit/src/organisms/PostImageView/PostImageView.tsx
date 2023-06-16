import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {PostHeading} from '../../molecules';
import {ButtonEllipse, Frame, Image} from '../../atoms';
import {PostAuthorInterface, PostEntryInterface} from '../../interfaces';

import * as styled from './PostImageView.styled';

export interface PostImageViewPropsInterface {
  author: PostAuthorInterface;
  entry: PostEntryInterface;
  onShare?: () => void;
  onVisit?: () => void;
  onEdit?: () => void;
}

const PostImageView: FC<PostImageViewPropsInterface> = ({
  author,
  entry,
  onVisit,
  onShare,
  onEdit
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostImageView-test">
      <Frame>
        {/* HEADER */}
        <PostHeading author={author} entry={entry} />

        <styled.Wrapper>
          <styled.Grid>
            <Image src={entry.hashSrc} height={160} errorIcon="photo_camera" />
            <styled.Description>{entry.description}</styled.Description>
          </styled.Grid>

          <styled.Controls>
            {!!onEdit && <ButtonEllipse icon="pencil" label={t('actions.edit')} onClick={onEdit} />}
            {!!onShare && (
              <ButtonEllipse icon="share" label={t('actions.share')} onClick={onShare} />
            )}
            {!!onVisit && (
              <ButtonEllipse
                icon="rocket_flying"
                label={t('actions.visitOdyssey')}
                onClick={onVisit}
              />
            )}
          </styled.Controls>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(PostImageView);
