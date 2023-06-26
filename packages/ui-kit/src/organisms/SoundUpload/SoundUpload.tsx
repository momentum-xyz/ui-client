import {FC, memo} from 'react';
import cn from 'classnames';
import {useI18n} from '@momentum-xyz/core';

import {FileUploader} from '../../molecules';

import * as styled from './SoundUpload.styled';

const MAX_FILE_SIZE_BYTES = 16 * Math.pow(1024, 2);

export interface SoundUploadPropsInterface {
  value: File | undefined | null;
  onChange: (file: File | undefined) => void;
}

const SoundUpload: FC<SoundUploadPropsInterface> = ({value, onChange}) => {
  const {t} = useI18n();

  return (
    <styled.Uploader className={cn(value && 'hasFile')} data-testid="SoundUpload-test">
      {!value ? (
        <>
          <styled.Message>
            <styled.Description>{t('actions.dragDropSound')}</styled.Description>
            <styled.Extensions>
              <div>{t('messages.followingSoundFiles')}</div>
              <div>{`• ${t('messages.soundExtensions')}`}</div>
            </styled.Extensions>
          </styled.Message>

          <FileUploader
            label={t('actions.uploadYourSound')}
            dragActiveLabel={t('actions.dropItHere')}
            maxSize={MAX_FILE_SIZE_BYTES}
            fileType="audio"
            onFilesUpload={(file) => onChange(file)}
            enableDragAndDrop
          />
        </>
      ) : (
        <styled.SelectedFile>{value.name}</styled.SelectedFile>
      )}
    </styled.Uploader>
  );
};

export default memo(SoundUpload);
