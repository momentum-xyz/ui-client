/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {FileUploader} from '@momentum-xyz/ui-kit';
import {IconSvg} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './FileUpload.styled';

interface PropsInterface {
  value: File | undefined;
  onChange: (...event: any[]) => void;
}

const FileUpload: FC<PropsInterface> = ({value, onChange}) => {
  const {t} = useI18n();

  return (
    <styled.Container>
      <styled.Circle>
        {value && <styled.ImagePreview src={URL.createObjectURL(value)} />}
        <styled.CircleInner>
          <div className="icon-container">
            <IconSvg isWhite name="photo_camera" size="xxl" />
          </div>
          <FileUploader
            label=""
            dragActiveLabel={t('fileUploader.dragActiveLabel')}
            fileType="image"
            onFilesUpload={onChange}
            onError={(error: any) => console.error(error)}
            enableDragAndDrop={false}
            buttonClassName="image-upload-button"
          />
        </styled.CircleInner>
      </styled.Circle>
    </styled.Container>
  );
};

export default observer(FileUpload);
