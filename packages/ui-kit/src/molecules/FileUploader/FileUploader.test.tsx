import React from 'react';

import {render, waitFor, fireEvent} from 'utils/test.utils';

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
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      fireEvent.change(uploader, {
        target: {files: [file]}
      })
    );

    expect(uploader?.files).toHaveLength(1);
  });
});

export {};
