import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, TabInterface, Tabs} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {AssetTypeEnum, BasicAsset2dIdEnum, WidgetEnum} from 'core/enums';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {ImagePage, ObjectPluginPage, TextPage} from './components';
import * as styled from './ObjectWidget.styled';

const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
  {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: 'Picture'},
  {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: 'Video'},
  {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: 'Text'}
];

const ObjectWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {objectStore, widgetManagerStore} = useStore();
  const {pluginLoader, assetStore, currentAssetId} = objectStore;
  const {assetType} = assetStore;

  useEffect(() => {
    if (data?.id) {
      objectStore
        .init(data.id.toString())
        .then((assetId) => {
          if (!assetId) {
            widgetManagerStore.close(WidgetEnum.OBJECT);
          }
        })
        .catch(() => {
          widgetManagerStore.close(WidgetEnum.OBJECT);
        });
    }

    return () => {
      objectStore.resetModel();
    };
  }, [data?.id, objectStore, widgetManagerStore]);

  if (!currentAssetId) {
    return null;
  }

  return (
    <styled.Container data-testid="ObjectWidget-test">
      <Panel
        isFullHeight
        size="large"
        icon="document"
        variant="primary"
        title={objectStore.objectName || ''}
        onClose={() => widgetManagerStore.close(WidgetEnum.OBJECT)}
      >
        <styled.Tabs>
          <Tabs tabList={TABS_LIST} activeId={currentAssetId} />
        </styled.Tabs>

        {assetType === AssetTypeEnum.TEXT && <TextPage />}
        {assetType === AssetTypeEnum.IMAGE && <ImagePage />}
        {assetType === AssetTypeEnum.PLUGIN && pluginLoader?.plugin && (
          <ObjectPluginPage
            plugin={pluginLoader.plugin}
            pluginLoader={pluginLoader}
            objectId={data?.id.toString() || ''}
          />
        )}
      </Panel>
    </styled.Container>
  );
};

export default observer(ObjectWidget);
