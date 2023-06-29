import {FC, ReactNode, useCallback} from 'react';
import cn from 'classnames';
import {useDropzone} from 'react-dropzone';

import {Button} from '../../atoms';
import {ErrorsEnum} from '../../enums';

import * as styled from './FileUploader.styled';

export interface FileUploaderPropsInterface {
  label: string;
  buttonSize?: 'small' | 'normal' | 'medium';
  iconButton?: boolean;
  dragActiveLabel: string;
  onFilesUpload: (file: File | undefined) => void;
  onError?: (error: Error) => void;
  fileType?: 'image' | 'video' | 'audio';
  maxSize?: number;
  enableDragAndDrop?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

/*
 * FileUploader: Component used for uploading files.
 *
 * Important: Parent might need position relative in order to work if drag and drop is enabled (by default)! If not used,
 * it might make the app unusable.
 */
const FileUploader: FC<FileUploaderPropsInterface> = ({
  label,
  dragActiveLabel,
  buttonSize = 'normal',
  iconButton,
  onFilesUpload,
  onError,
  fileType,
  maxSize = 3 * Math.pow(1024, 2),
  enableDragAndDrop = true,
  disabled,
  children
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
    <styled.Container data-testid="FileUploader-test" className={cn(iconButton && 'iconButton')}>
      {enableDragAndDrop && <styled.DropZone {...restRootProps} />}
      <input {...getInputProps()} disabled={disabled} data-testid="FileUploader-input-test" />
      {isDragActive ? (
        <styled.Text>{dragActiveLabel}</styled.Text>
      ) : (
        <>
          {children}
          {/* @ts-ignore: FIXME */}
          <Button variant="secondary" label={label} onClick={onClick} disabled={disabled} />
        </>
      )}
    </styled.Container>
  );
};

export default FileUploader;
