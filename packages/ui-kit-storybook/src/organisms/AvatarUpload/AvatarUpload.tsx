/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {FileUploader} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {IconSvg} from '../../atoms';

import * as styled from './AvatarUpload.styled';

export interface AvatarUploadPropsInterface {
  value: File | undefined;
  onChange: (...event: any[]) => void;
}

const AvatarUpload: FC<AvatarUploadPropsInterface> = ({value, onChange}) => {
  const {t} = useI18n();

  return (
    <styled.Container>
      {value && <styled.ImagePreview src={URL.createObjectURL(value)} />}
      {!value && (
        <div className="icon-container">
          <IconSvg isWhite name="photo_camera" size="xxl" />
        </div>
      )}
      <styled.FileUploaderContainer>
        <FileUploader
          label=""
          dragActiveLabel={t('fileUploader.dragActiveLabel')}
          fileType="image"
          onFilesUpload={onChange}
          onError={(error: any) => console.error(error)}
          enableDragAndDrop={false}
          buttonClassName="image-upload-button"
        />
      </styled.FileUploaderContainer>
    </styled.Container>
  );
};

export default observer(AvatarUpload);
