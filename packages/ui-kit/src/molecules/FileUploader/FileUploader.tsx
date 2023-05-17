import {FC, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import {Button} from '../../atoms';
import {ErrorsEnum} from '../../enums';

import * as styled from './FileUploader.styled';

interface PropsInterface {
  label: string;
  buttonSize?: 'small' | 'normal' | 'medium';
  dragActiveLabel: string;
  onFilesUpload: (file: File | undefined) => void;
  onError?: (error: Error) => void;
  fileType?: 'image' | 'video';
  maxSize?: number;
  enableDragAndDrop?: boolean;
  disabled?: boolean;
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
  fileType,
  maxSize = 3 * Math.pow(1024, 2),
  enableDragAndDrop = true,
  disabled
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
    <styled.Container data-testid="FileUploader-test">
      {enableDragAndDrop && <styled.DropZone {...restRootProps} />}
      <input {...getInputProps()} disabled={disabled} data-testid="FileUploader-input-test" />
      {isDragActive ? (
        <styled.Text>{dragActiveLabel}</styled.Text>
      ) : (
        // @ts-ignore: FIXME
        <Button label={label} onClick={onClick} disabled={disabled} />
      )}
    </styled.Container>
  );
};

export default FileUploader;
