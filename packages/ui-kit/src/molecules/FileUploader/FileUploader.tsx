import React, {FC, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import {PropsWithThemeInterface} from '../../interfaces';
import {FileType} from '../../types';
import {Button} from '../../atoms';
import {ErrorsEnum} from '../../enums';

import * as styled from './FileUploader.styled';
interface PropsInterface extends PropsWithThemeInterface {
  label: string;
  buttonSize?: 'small' | 'normal' | 'medium';
  dragActiveLabel: string;
  onFilesUpload: (file: File | undefined) => void;
  onError?: (error: Error) => void;
  fileType: FileType;
  maxSize?: number;
  enableDragAndDrop?: boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
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
  buttonSize = 'normal',
  onFilesUpload,
  onError,
  theme,
  fileType,
  maxSize = 3 * Math.pow(1024, 2),
  enableDragAndDrop = true,
  disabled,
  className,
  buttonClassName
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];

        if (file.size > maxSize) {
          onError?.(new Error(ErrorsEnum.FileSizeTooLarge));
        } else {
          onFilesUpload(acceptedFiles[0]);
        }
      } else {
        onFilesUpload(undefined);
      }
    },
    [maxSize, onError, onFilesUpload]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: fileType ? {[`${fileType as string}/*`]: []} : undefined, // TODO AK Test if this works as intended
    multiple: false
  });
  const {onClick, ...restRootProps} = getRootProps();

  return (
    <styled.Container data-testid="FileUploader-test" className={className}>
      {enableDragAndDrop && <styled.DropZone {...restRootProps} />}
      <input {...getInputProps()} disabled={disabled} data-testid="FileUploader-input-test" />
      {isDragActive ? (
        <styled.Text>{dragActiveLabel}</styled.Text>
      ) : (
        <Button
          theme={theme}
          label={label}
          size={buttonSize}
          onClick={onClick}
          disabled={disabled}
          className={buttonClassName}
        />
      )}
    </styled.Container>
  );
};

export default FileUploader;
