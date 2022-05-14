import React from 'react';

import {render, within, waitFor, fireEvent} from 'ui-kit/utils/test.utils';

import FileUploader from './FileUploader';

describe('FileUploader', () => {
  test('is rendered', () => {
    const rendered = render(
      <FileUploader
        onFilesUpload={() => {}}
        fileType="image"
        maxSize={10}
        dragActiveLabel=""
        label=""
      />
    );
    expect(rendered.baseElement).toBeInTheDocument();
  });

  test('upload file', async () => {
    const file = new File([], 'test.png', {type: 'image/png'});
    const {getByTestId} = render(
      <FileUploader
        onFilesUpload={() => {}}
        fileType="image"
        maxSize={10}
        dragActiveLabel=""
        label=""
      />
    );

    const uploader = getByTestId('FileUploader-input-test') as HTMLInputElement;

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: {files: [file]}
      })
    );

    expect(uploader?.files).toHaveLength(1);
  });
});

export {};
