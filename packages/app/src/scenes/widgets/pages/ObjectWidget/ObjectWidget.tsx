import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {AssetTypeEnum, WidgetEnum} from 'core/enums';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {CanvasChildViewer, CanvasViewer, Customization, ObjectViewer} from './components';
import * as styled from './ObjectWidget.styled';

const ObjectWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {universeStore, widgetManagerStore} = useStore();
  const {objectStore} = universeStore;
  const {objectContentStore, asset2dId} = objectStore;
  const {assetType} = objectContentStore;

  const objectId = data?.id.toString() || '';

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

  if (!objectId || !asset2dId || !assetType) {
    return null;
  }

  return (
    <styled.Container data-testid="ObjectWidget-test">
      {assetType === AssetTypeEnum.CLAIMABLE && <Customization onClose={onClose} />}

      {assetType === AssetTypeEnum.CANVAS_CHILD && <CanvasChildViewer onClose={onClose} />}

      {assetType === AssetTypeEnum.CANVAS_ROOT && <CanvasViewer onClose={onClose} />}

      {![AssetTypeEnum.CLAIMABLE, AssetTypeEnum.CANVAS_CHILD, AssetTypeEnum.CANVAS_ROOT].includes(
        assetType as AssetTypeEnum
      ) && <ObjectViewer objectId={objectId} onClose={onClose} />}
    </styled.Container>
  );
};

export default observer(ObjectWidget);
