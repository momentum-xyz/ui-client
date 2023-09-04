import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {AssetTypeEnum, WidgetEnum} from 'core/enums';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {CanvasChildViewer, CanvasViewer, Customization, ObjectViewer} from './components';
import * as styled from './ObjectWidget.styled';

const ObjectWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {universeStore, widgetManagerStore} = useStore();
  const {objectStore} = universeStore;
  const {objectContentStore, asset2dId} = objectStore;
  const {assetType, customizableContent} = objectContentStore;

  const {t} = useI18n();

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
      {assetType === AssetTypeEnum.CLAIMABLE && (
        <Panel
          isFullHeight
          size="normal"
          variant="primary"
          icon={customizableContent.widgetIcon}
          title={customizableContent.widgetTitle}
          onClose={onClose}
        >
          <Customization />
        </Panel>
      )}

      {assetType === AssetTypeEnum.CANVAS_CHILD && (
        <Panel
          isFullHeight
          size="normal"
          variant="primary"
          icon="cubicle"
          title={t('titles.objectInfo')}
          onClose={onClose}
        >
          <CanvasChildViewer onClose={onClose} />
        </Panel>
      )}

      {assetType === AssetTypeEnum.CANVAS_ROOT && (
        <Panel
          icon="idea"
          size="large"
          isFullHeight
          variant="primary"
          title={t('labels.contributionOverview')}
          onClose={onClose}
        >
          <CanvasViewer onClose={onClose} />
        </Panel>
      )}

      {![AssetTypeEnum.CLAIMABLE, AssetTypeEnum.CANVAS_CHILD, AssetTypeEnum.CANVAS_ROOT].includes(
        assetType as AssetTypeEnum
      ) && (
        <Panel
          isFullHeight
          size="normal"
          icon="document"
          variant="primary"
          title={objectStore.objectName || ''}
          onClose={onClose}
        >
          <ObjectViewer objectId={objectId} />
        </Panel>
      )}
    </styled.Container>
  );
};

export default observer(ObjectWidget);
