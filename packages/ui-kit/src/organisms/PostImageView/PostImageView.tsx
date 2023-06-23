import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {PostHeading, PostSharing} from '../../molecules';
import {ButtonEllipse, Frame, Image} from '../../atoms';
import {PostAuthorInterface, PostEntryInterface} from '../../interfaces';

import * as styled from './PostImageView.styled';

export interface PostImageViewPropsInterface {
  author: PostAuthorInterface;
  entry: PostEntryInterface;
  shareUrl?: string;
  onVisit?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const PostImageView: FC<PostImageViewPropsInterface> = ({
  author,
  entry,
  onVisit,
  shareUrl,
  onDelete,
  onEdit
}) => {
  const [isSharing, setIsSharing] = useState(false);

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
            {!!onDelete && (
              <ButtonEllipse icon="bin" label={t('actions.delete')} onClick={onDelete} />
            )}

            {!!onEdit && <ButtonEllipse icon="pencil" label={t('actions.edit')} onClick={onEdit} />}

            {!!shareUrl && (
              <ButtonEllipse
                icon="share"
                label={t('actions.share')}
                isActive={isSharing}
                onClick={() => setIsSharing(!isSharing)}
              />
            )}

            {!!onVisit && (
              <ButtonEllipse
                icon="rocket_flying"
                label={t('actions.visitOdyssey')}
                onClick={onVisit}
              />
            )}
          </styled.Controls>

          {isSharing && shareUrl && (
            <styled.ShareBlock>
              <PostSharing
                title={entry.objectName || ''}
                targetUrl={shareUrl}
                onClose={() => setIsSharing(false)}
              />
            </styled.ShareBlock>
          )}
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(PostImageView);
