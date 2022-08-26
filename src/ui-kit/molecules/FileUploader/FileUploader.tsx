import React, {FC, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import {FileType, PropsWithThemeInterface} from 'ui-kit/index';
import {Button} from 'ui-kit/index';

import * as styled from './FileUploader.styled';

interface PropsInterface extends PropsWithThemeInterface {
  label: string;
  dragActiveLabel: string;
  onFilesUpload: (file: File | undefined) => void;
  onError?: (error: Error) => void;
  fileType: FileType;
  buttonIsCustom?: boolean;
  maxSize?: number;
  enableDragAndDrop?: boolean;
}

/*
 * FileUploader: Component used for uploading files.
 *
 * Important: Parent might need position relative in order to work if drag and drop is enabled (by default)! If not used,
 * it might make the app unusable.
 */
const FileUploader: FC<PropsInterface> = ({
  label,
  dragActiveLabel,
  onFilesUpload,
  onError,
  theme,
  fileType,
  maxSize = 3 * Math.pow(1024, 2),
  buttonIsCustom = false,
  enableDragAndDrop = true
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0];

      if (file.size > maxSize) {
        onError?.(new Error('FileSizeTooLarge'));
      } else {
        onFilesUpload(acceptedFiles[0]);
      }
    } else {
      onFilesUpload(undefined);
    }
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: `${fileType as string}/*`,
    multiple: false
  });
  const {onClick, ...restRootProps} = getRootProps();

  return (
    <styled.Container data-testid="FileUploader-test">
      {enableDragAndDrop && <styled.DropZone {...restRootProps} />}
      <input {...getInputProps()} data-testid="FileUploader-input-test" />
      {isDragActive ? (
        <styled.Text>{dragActiveLabel}</styled.Text>
      ) : (
        <Button
          theme={theme}
          label={label}
          size="normal"
          onClick={onClick}
          isCustom={buttonIsCustom}
        />
      )}
    </styled.Container>
  );
};

export default FileUploader;
