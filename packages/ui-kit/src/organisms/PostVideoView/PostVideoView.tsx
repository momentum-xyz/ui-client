import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, Frame} from '../../atoms';
import {MediaPlayer, PostHeading} from '../../molecules';
import {PostAuthorInterface, PostEntryInterface} from '../../interfaces';

import * as styled from './PostVideoView.styled';

export interface PostVideoViewPropsInterface {
  author: PostAuthorInterface;
  entry: PostEntryInterface;
  onShare?: () => void;
  onVisit?: () => void;
  onEdit?: () => void;
}

const PostVideoView: FC<PostVideoViewPropsInterface> = ({
  author,
  entry,
  onVisit,
  onShare,
  onEdit
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostVideoView-test">
      <Frame>
        {/* HEADER */}
        <PostHeading author={author} entry={entry} />

        <styled.Wrapper>
          <styled.Grid>
            {entry.hashSrc && <MediaPlayer sourceUrl={entry.hashSrc} />}
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

export default observer(PostVideoView);
