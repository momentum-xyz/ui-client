import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, Panel, TabInterface, Tabs} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {AssetTypeEnum, BasicAsset2dIdEnum, WidgetEnum} from 'core/enums';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {CustomViewer, ImageViewer, PluginViewer, TextViewer} from './components';
import * as styled from './ObjectWidget.styled';

const ObjectWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {universeStore, widgetManagerStore} = useStore();
  const {objectStore, isCurrentUserWorldAdmin} = universeStore;
  const {pluginLoader, objectContentStore, asset2dId} = objectStore;
  const {assetType, normalContent, customizableContent} = objectContentStore;

  const onClose = useCallback(() => {
    widgetManagerStore.close(WidgetEnum.OBJECT);
  }, [widgetManagerStore]);

  useEffect(() => {
    if (data?.id) {
      objectStore.init(data.id.toString()).then((assetId) => {
        if (!assetId) {
          onClose();
        }
      });
    }
    return () => {
      objectStore.resetModel();
    };
  }, [data?.id, objectStore, onClose]);

  if (!asset2dId) {
    return null;
  }

  const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
    {
      id: BasicAsset2dIdEnum.IMAGE,
      icon: 'picture_upload',
      label: 'Picture',
      disabled: asset2dId !== BasicAsset2dIdEnum.IMAGE.toString()
    },
    {
      id: BasicAsset2dIdEnum.VIDEO,
      icon: 'video_upload',
      label: 'Video',
      disabled: asset2dId !== BasicAsset2dIdEnum.VIDEO.toString()
    },
    {
      id: BasicAsset2dIdEnum.TEXT,
      icon: 'upload',
      label: 'Text',
      disabled: asset2dId !== BasicAsset2dIdEnum.TEXT.toString()
    }
  ];

  return (
    <styled.Container data-testid="ObjectWidget-test">
      {assetType === AssetTypeEnum.TEXT && (
        <Panel
          isFullHeight
          size="large"
          icon="document"
          variant="primary"
          title={objectStore.objectName || ''}
          onClose={onClose}
        >
          <styled.Wrapper>
            <Frame>
              <styled.Tabs>
                <Tabs tabList={TABS_LIST} activeId={asset2dId} />
              </styled.Tabs>
              <TextViewer
                title={normalContent.content?.title}
                text={normalContent.content?.content}
              />
            </Frame>
          </styled.Wrapper>
        </Panel>
      )}

      {assetType === AssetTypeEnum.IMAGE && (
        <Panel
          isFullHeight
          size="large"
          icon="document"
          variant="primary"
          title={objectStore.objectName || ''}
          onClose={onClose}
        >
          <styled.Wrapper>
            <Frame>
              <styled.Tabs>
                <Tabs tabList={TABS_LIST} activeId={asset2dId} />
              </styled.Tabs>
              <ImageViewer imageSrc={normalContent.imageSrc} />
            </Frame>
          </styled.Wrapper>
        </Panel>
      )}

      {assetType === AssetTypeEnum.CLAIMABLE && (
        <Panel
          isFullHeight
          size="normal"
          variant="primary"
          icon={customizableContent?.widgetIcon || 'alert'}
          title={customizableContent?.widgetTitle || ''}
          onClose={onClose}
        >
          <CustomViewer />
        </Panel>
      )}

      {assetType === AssetTypeEnum.PLUGIN && (
        <Panel
          isFullHeight
          size="large"
          icon="document"
          variant="primary"
          title={objectStore.objectName || ''}
          onClose={onClose}
        >
          <styled.Wrapper>
            <Frame>
              <styled.Tabs>
                <Tabs tabList={TABS_LIST} activeId={asset2dId} />
              </styled.Tabs>

              {pluginLoader?.plugin && (
                <PluginViewer
                  plugin={pluginLoader.plugin}
                  pluginLoader={pluginLoader}
                  objectId={data?.id.toString() || ''}
                  isAdmin={isCurrentUserWorldAdmin}
                  onClose={onClose}
                />
              )}
            </Frame>
          </styled.Wrapper>
        </Panel>
      )}
    </styled.Container>
  );
};

export default observer(ObjectWidget);
