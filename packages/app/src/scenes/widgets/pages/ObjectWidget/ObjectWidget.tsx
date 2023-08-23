import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {AssetTypeEnum, WidgetEnum} from 'core/enums';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {Customization, ObjectViewer} from './components';
import * as styled from './ObjectWidget.styled';

const ObjectWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {universeStore, widgetManagerStore} = useStore();
  const {objectStore} = universeStore;
  const {objectContentStore, asset2dId} = objectStore;
  const {assetType, customizableContent} = objectContentStore;

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

  if (!objectId || !asset2dId) {
    return null;
  }

  return (
    <styled.Container data-testid="ObjectWidget-test">
      {assetType === AssetTypeEnum.CLAIMABLE ? (
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
      ) : (
        <Panel
          isFullHeight
          size="large"
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
