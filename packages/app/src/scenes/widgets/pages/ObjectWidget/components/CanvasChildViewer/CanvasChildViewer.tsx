import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import {CanvasChild} from './components';
import * as styled from './CanvasChildViewer.styled';

interface PropsInterface {
  onClose: () => void;
}

const CanvasChildViewer: FC<PropsInterface> = ({onClose}) => {
  const {universeStore, sessionStore} = useStore();
  const {objectStore, world3dStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {canvasChildContent} = objectContentStore;
  const {userId} = sessionStore;

  const {t} = useI18n();

  const canUserEdit = canvasChildContent.ownerId === userId;

  useEffect(() => {
    canvasChildContent.initSocial(userId);

    return () => {
      canvasChildContent.resetModel();
    };
  }, [canvasChildContent, world3dStore, userId]);

  const handleDelete = async () => {
    if (await canvasChildContent.deleteObject()) {
      onClose();
    }
  };

  if (canvasChildContent.isLoading || !canvasChildContent.content || !world3dStore?.canvasConfig) {
    return <></>;
  }

  return (
    <Panel
      isFullHeight
      size="normal"
      variant="primary"
      icon="cubicle"
      title={t('titles.objectInfo')}
      onClose={onClose}
    >
      <styled.Container data-testid="CanvasChildViewer-test">
        <CanvasChild
          hasVote={canvasChildContent.hasVote}
          voteCount={canvasChildContent.voteCount}
          config={world3dStore.canvasConfig}
          content={canvasChildContent.content}
          currentUserId={userId}
          currentUserName={sessionStore.userName}
          currentUserImageUrl={sessionStore.userImageUrl}
          currentUserIsGuest={sessionStore.isGuest}
          authorName={canvasChildContent.author?.name}
          authorAvatarHash={canvasChildContent.author?.profile.avatarHash}
          commentList={canvasChildContent.commentList}
          onDelete={canUserEdit ? handleDelete : undefined}
          onVote={() => canvasChildContent.toggleVote(userId)}
          onAddComment={async (message) => {
            await canvasChildContent.addComment(userId, message);
            await canvasChildContent.fetchAllComments(0);
          }}
          onDeleteComment={async (commentId) => {
            await canvasChildContent.deleteComment(userId, commentId);
            await canvasChildContent.fetchAllComments(0);
          }}
        />
      </styled.Container>
    </Panel>
  );
};

export default observer(CanvasChildViewer);
