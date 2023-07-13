import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {IconSvg} from '../../atoms';
import {FileUploader} from '../../molecules';

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
          label=" "
          iconButton
          dragActiveLabel={t('fileUploader.dragActiveLabel')}
          fileType="image"
          onFilesUpload={onChange}
          onError={(error) => console.error(error)}
          enableDragAndDrop={false}
        />
      </styled.FileUploaderContainer>
    </styled.Container>
  );
};

export default observer(AvatarUpload);
