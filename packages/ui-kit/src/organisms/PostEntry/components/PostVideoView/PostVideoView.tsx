import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse} from '../../../../atoms';
import {MediaPlayer} from '../../../../molecules';

import * as styled from './PostVideoView.styled';

interface PropsInterface {
  videoSrc: string | null;
  description: string | null;
  onDelete?: () => void;
  onShare?: () => void;
  onVisit?: () => void;
  onEdit?: () => void;
}

const PostVideoView: FC<PropsInterface> = ({
  videoSrc,
  description,
  onDelete,
  onVisit,
  onShare,
  onEdit
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostVideoView-test">
      <styled.Grid>
        {videoSrc && <MediaPlayer sourceUrl={videoSrc} />}
        <styled.Description>{description}</styled.Description>
      </styled.Grid>

      <styled.Controls>
        {!!onDelete && <ButtonEllipse icon="bin" label={t('actions.delete')} onClick={onDelete} />}
        {!!onEdit && <ButtonEllipse icon="pencil" label={t('actions.edit')} onClick={onEdit} />}
        {!!onShare && <ButtonEllipse icon="share" label={t('actions.share')} onClick={onShare} />}
        {!!onVisit && (
          <ButtonEllipse icon="rocket_flying" label={t('actions.visitOdyssey')} onClick={onVisit} />
        )}
      </styled.Controls>
    </styled.Container>
  );
};

export default PostVideoView;
