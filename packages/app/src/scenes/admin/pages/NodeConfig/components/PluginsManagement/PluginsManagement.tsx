import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, ErrorsEnum, FileUploader, Heading} from '@momentum-xyz/ui-kit';
import {i18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './PluginsManagement.styled';

const MAX_FILE_SIZE = 20_000_000;

const PluginsManagement: FC = () => {
  const {pluginStore} = useStore();

  const [fileToUpload, setFileToUpload] = useState<File>();
  const [error, setError] = useState<string>();

  const handleUpload = async () => {
    if (!fileToUpload) {
      return;
    }

    setError(undefined);

    await pluginStore.mediaUploader.uploadPlugin(fileToUpload);

    if (pluginStore.mediaUploader.isError) {
      setError('Error uploading plugin');
      return;
    }

    setFileToUpload(undefined);

    pluginStore.init();
  };

  console.log('pluginStore', pluginStore.plugins);

  return (
    <styled.Container>
      <styled.List>
        <Heading variant="h3">Plugins</Heading>
        {pluginStore.plugins?.map((plugin) => (
          <styled.Item key={plugin.plugin_id}>
            <span>{plugin.meta.name}</span>
            {/* <styled.Date>{plugin.updated_at?.slice(0, 19)}</styled.Date> */}
          </styled.Item>
        ))}
      </styled.List>
      <styled.BottomPanel>
        <Heading variant="h3">Upload plugin</Heading>
        Upload a tar.gz file containing a plugin.
        <div>
          <FileUploader
            label="Select file"
            dragActiveLabel="Drag and drop a file here"
            withFrame
            onFilesUpload={(file) => {
              console.log('file', file);
              setFileToUpload(file);
            }}
            maxSize={MAX_FILE_SIZE}
            onError={(err) => {
              console.log('File upload error:', err, err.message);
              if (err.message === ErrorsEnum.FileSizeTooLarge) {
                setError(
                  i18n.t('assetsUploader.errorTooLargeFile', {
                    size: MAX_FILE_SIZE
                  })
                );
                return;
              }
              setError(err.message);
            }}
            fileType="archive"
          />
        </div>
        {error && <styled.Error>{error}</styled.Error>}
        {!!fileToUpload && <Button label="Upload" onClick={handleUpload} />}
      </styled.BottomPanel>
    </styled.Container>
  );
};

export default observer(PluginsManagement);
