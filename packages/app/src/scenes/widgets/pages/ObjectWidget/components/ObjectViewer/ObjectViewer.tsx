import {FC, useMemo, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {PluginIdEnum} from 'api/enums';
import {ObjectAttribute} from 'core/models';
import {BasicAsset2dIdEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';
import {ImageObjectInterface, TextObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import {ImageViewer, PluginViewer, TextViewer} from './components';
import * as styled from './ObjectViewer.styled';

interface PropsInterface {
  objectId: string;
}

const ObjectViewer: FC<PropsInterface> = ({objectId}) => {
  const {universeStore} = useStore();
  const {objectStore, isCurrentUserWorldAdmin} = universeStore;
  const {pluginLoader} = objectStore;

  useEffect(() => {
    objectStore.initPluginLoader(BasicAsset2dIdEnum.VIDEO, objectId);
  }, [objectId, objectStore]);

  const [attrImage, attrText] = useMemo(() => {
    const attrImage = ObjectAttribute.create({
      objectId,
      pluginId: PluginIdEnum.IMAGE
    });
    attrImage.load();

    const attrText = ObjectAttribute.create({
      objectId,
      pluginId: PluginIdEnum.TEXT
    });
    attrText.load();

    return [attrImage, attrText];
  }, [objectId]);

  const renderHash = attrImage?.valueAs<ImageObjectInterface>()?.render_hash;
  const content = attrText?.valueAs<TextObjectInterface>();

  return (
    <Frame>
      {!!renderHash && (
        <styled.Item>
          <ImageViewer imageSrc={getImageAbsoluteUrl(renderHash, ImageSizeEnum.S5)} />
        </styled.Item>
      )}

      {!!attrText.value && (
        <styled.Item>
          <TextViewer title={content?.title} text={content?.content} />
        </styled.Item>
      )}

      {pluginLoader?.plugin && (
        <styled.Item>
          <PluginViewer
            plugin={pluginLoader.plugin}
            pluginLoader={pluginLoader}
            objectId={objectId}
            isAdmin={isCurrentUserWorldAdmin}
            hideWhenUnset
          />
        </styled.Item>
      )}
    </Frame>
  );
};

export default observer(ObjectViewer);
