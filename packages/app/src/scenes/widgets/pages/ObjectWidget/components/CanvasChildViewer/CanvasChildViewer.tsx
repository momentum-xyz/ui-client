import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

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

  const canUserEdit = canvasChildContent.ownerId === userId;

  useEffect(() => {
    canvasChildContent.initSocial(userId);
    canvasChildContent.loadConfig(world3dStore?.canvasObjectId || '');

    return () => {
      canvasChildContent.resetModel();
    };
  }, [canvasChildContent, world3dStore, userId]);

  const handleDelete = async () => {
    if (await canvasChildContent.deleteObject()) {
      onClose();
    }
  };

  if (canvasChildContent.isLoading || !canvasChildContent.content || !canvasChildContent.config) {
    return <></>;
  }

  return (
    <styled.Container data-testid="CanvasChildViewer-test">
      <CanvasChild
        hasVote={canvasChildContent.hasVote}
        voteCount={canvasChildContent.voteCount}
        config={canvasChildContent.config}
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
  );
};

export default observer(CanvasChildViewer);
