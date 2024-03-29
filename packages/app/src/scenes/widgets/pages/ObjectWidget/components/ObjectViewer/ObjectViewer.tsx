import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {ImageObjectInterface, TextObjectInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import {
  ImageViewer,
  ObjectOwnerHeading,
  PluginViewer,
  TextViewer,
  VoteCommentsBar
} from './components';
import * as styled from './ObjectViewer.styled';

interface PropsInterface {
  objectId: string;
}

const ObjectViewer: FC<PropsInterface> = ({objectId}) => {
  const {universeStore} = useStore();
  const {objectStore, isCurrentUserWorldAdmin} = universeStore;
  const {pluginLoader, objectContentStore, owner, updatedAt} = objectStore;
  const {image, text} = objectContentStore.normalContent;

  const renderHash = (image?.value as ImageObjectInterface)?.render_hash;
  const content = text?.value as TextObjectInterface;

  return (
    <Frame>
      {!!owner && (
        <ObjectOwnerHeading
          authorName={owner.name}
          authorAvatarHash={owner.avatarSrc}
          datetime={updatedAt}
        />
      )}

      <styled.Title>{objectStore.objectName || ''}</styled.Title>

      {!!renderHash && (
        <styled.Item>
          <ImageViewer imageSrc={getImageAbsoluteUrl(renderHash, ImageSizeEnum.S5)} />
        </styled.Item>
      )}

      {!!content && (
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

      <VoteCommentsBar objectId={objectId} />
    </Frame>
  );
};

export default observer(ObjectViewer);
