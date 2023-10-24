import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, ErrorsEnum, FileUploader, Heading, IconButton} from '@momentum-xyz/ui-kit';
import {i18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './PluginsManagement.styled';

const MAX_FILE_SIZE = 20_000_000;

const PluginsManagement: FC = () => {
  const {pluginStore, adminStore} = useStore();

  const [fileToUpload, setFileToUpload] = useState<File>();
  const [error, setError] = useState<string>();

  const [expandedPluginId, setExpandedPluginId] = useState<string>();

  const handleUpload = async () => {
    if (!fileToUpload) {
      return;
    }

    setError(undefined);

    const hash = await pluginStore.mediaUploader.uploadPlugin(fileToUpload);

    if (!hash) {
      setError('Error uploading plugin');
      return;
    }

    console.log('Activate plugin with hash', hash);
    await adminStore.activatePlugin(hash);

    setFileToUpload(undefined);

    pluginStore.init();
  };

  console.log('pluginStore', pluginStore.plugins);

  return (
    <styled.Container>
      <styled.List>
        <Heading variant="h3">Plugins</Heading>
        {pluginStore.plugins?.map(({plugin_id, meta, updated_at}) => {
          const {
            name,
            displayName,
            description,
            version,
            scopes,
            author,
            homepage,
            repository,
            license
          } = meta || {};
          const isExpanded = expandedPluginId === plugin_id;
          return (
            <styled.Item key={plugin_id}>
              <styled.ExpandHolder>
                <IconButton
                  name={isExpanded ? 'chevron_down' : 'chevron_right'}
                  isWhite
                  size="s"
                  onClick={() => {
                    setExpandedPluginId(isExpanded ? undefined : plugin_id);
                  }}
                />
              </styled.ExpandHolder>
              {!isExpanded && (
                <styled.LayoutCollapsed>
                  <styled.Title>{displayName || name}</styled.Title>
                  <styled.Description>{description?.slice(0, 100)}</styled.Description>
                  <span>{version}</span>
                </styled.LayoutCollapsed>
              )}
              {isExpanded && (
                <div>
                  <styled.LayoutExpanded>
                    <styled.Title>{displayName || name}</styled.Title>
                    <span />

                    <span>Version:</span>
                    <span>{version}</span>

                    {!!author && (
                      <>
                        <span>Author:</span>
                        <span>{author}</span>
                      </>
                    )}

                    {!!homepage && (
                      <>
                        <span>Homepage:</span>
                        <a href={homepage} target="_blank" rel="noreferrer">
                          {homepage}
                        </a>
                      </>
                    )}

                    {!!repository && (
                      <>
                        <span>Repository:</span>
                        <a href={repository} target="_blank" rel="noreferrer">
                          {repository}
                        </a>
                      </>
                    )}

                    {!!license && (
                      <>
                        <span>License:</span>
                        <span>{license}</span>
                      </>
                    )}

                    <span>Last modified:</span>
                    <span>{updated_at?.slice(0, 16)?.split('T')?.join(' ')}</span>

                    {!!scopes && (
                      <>
                        <span>Scopes:</span>
                        <ul>
                          {Object.entries<string[]>(scopes).map(([scope, value]) => (
                            <li key={scope}>
                              {scope}: {value.join(', ')}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </styled.LayoutExpanded>

                  <br />
                  <styled.Description>{description?.slice(0, 100)}</styled.Description>
                </div>
              )}
            </styled.Item>
          );
        })}
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
          >
            {fileToUpload && (
              <styled.FilePreview>
                <div>{fileToUpload.name}</div>
                <div>size: {(fileToUpload.size / (1024 * 1024)).toFixed(1)}MB</div>
              </styled.FilePreview>
            )}
          </FileUploader>
        </div>
        {error && <styled.Error>{error}</styled.Error>}
        {!!fileToUpload && <Button label="Upload" onClick={handleUpload} />}
      </styled.BottomPanel>
    </styled.Container>
  );
};

export default observer(PluginsManagement);
