import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {ButtonEllipse, Frame, Hexagon, Image, ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {dateWithoutTime, useI18n} from '@momentum-xyz/core';

import {CustomizableObjectInterface} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './ContentViewer.styled';

interface PropsInterface {
  authorName: string | null | undefined;
  authorAvatarHash?: string | null | undefined;
  content: CustomizableObjectInterface;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ContentViewer: FC<PropsInterface> = ({
  content,
  authorName,
  authorAvatarHash,
  onDelete,
  onEdit
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="ContentViewer-test">
      <Frame>
        <styled.Header>
          <Hexagon
            iconName="astronaut"
            type="fourth-borderless"
            imageSrc={getImageAbsoluteUrl(authorAvatarHash)}
          />

          <styled.UserInfo>
            <styled.UserInfoTitle>
              <styled.UserName>{authorName}</styled.UserName>
              <styled.Date>
                <div>{dateWithoutTime(null)}</div>
              </styled.Date>
            </styled.UserInfoTitle>
          </styled.UserInfo>
        </styled.Header>

        <styled.Wrapper>
          <styled.Title>{content.title}</styled.Title>
          <styled.Grid>
            <Image
              height={280}
              errorIcon="photo_camera"
              src={getImageAbsoluteUrl(content.image_hash, ImageSizeEnum.S5)}
            />
            <styled.Description>{content.text}</styled.Description>
          </styled.Grid>

          <styled.Controls>
            {!!onDelete && (
              <ButtonEllipse icon="bin" label={t('actions.delete')} onClick={onDelete} />
            )}

            {!!onEdit && <ButtonEllipse icon="pencil" label={t('actions.edit')} onClick={onEdit} />}
          </styled.Controls>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(ContentViewer);
