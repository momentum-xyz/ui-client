import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, Image} from '../../../../atoms';

import * as styled from './PostImageView.styled';

interface PropsInterface {
  imageSrc: string | null;
  description: string | null;
  onDelete?: () => void;
  onShare?: () => void;
  onVisit?: () => void;
  onEdit?: () => void;
}

const PostImageView: FC<PropsInterface> = ({
  imageSrc,
  description,
  onDelete,
  onVisit,
  onShare,
  onEdit
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostImageView-test">
      <styled.Grid>
        <Image src={imageSrc} height={160} errorIcon="photo_camera" />
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

export default PostImageView;
