import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Panel, PositionEnum} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {CustomizableObjectFormInterface} from 'core/interfaces';

import {ContentViewer, NewOrEditForm} from './components';
import * as styled from './Customization.styled';

interface PropsInterface {
  onClose: () => void;
}

const Customization: FC<PropsInterface> = ({onClose}) => {
  const {universeStore, sessionStore, widgetManagerStore} = useStore();
  const {objectStore} = universeStore;
  const {objectContentStore} = objectStore;
  const {customizableContent} = objectContentStore;
  const {userId} = sessionStore;

  const canUserEdit = customizableContent.content?.claimed_by === userId;

  useEffect(() => {
    customizableContent.initSocial(userId);
  }, [customizableContent, userId]);

  const handleSignUp = () => {
    widgetManagerStore.closeAll();
    widgetManagerStore.open(WidgetEnum.LOGIN, PositionEnum.LEFT);
  };

  const handleCustomize = async (form: CustomizableObjectFormInterface) => {
    if (await customizableContent.claimAndCustomize(form)) {
      customizableContent.setIsEditing(false);
      customizableContent.fetchContent();
    }
  };
  const handleBack = () => {
    customizableContent.setIsEditing(false);
  };

  const handleEdit = () => {
    customizableContent.setIsEditing(true);
  };

  const handleDelete = async () => {
    await customizableContent.unclaimAndClear();
  };

  if (customizableContent.isLoading) {
    return <></>;
  }

  if (sessionStore.isGuest && !customizableContent.content) {
    return (
      <styled.NotAllowed>
        <div>
          To customize an object you need to be a member. Join Odyssey by connecting your wallet.
        </div>
        <div>
          <Button icon="astronaut" label="Sign Up now" onClick={handleSignUp} />
        </div>
      </styled.NotAllowed>
    );
  }

  return (
    <Panel
      isFullHeight
      size="normal"
      variant="primary"
      icon={customizableContent.widgetIcon}
      title={customizableContent.widgetTitle}
      onClose={onClose}
    >
      <styled.Container data-testid="CustomViewer-test">
        {customizableContent.isNewOrEditForm && (
          <NewOrEditForm
            content={customizableContent.content}
            isPending={customizableContent.isPending}
            isGenerating={customizableContent.isGenerating}
            generatedImages={customizableContent.generatedImages}
            onGenerateImages={customizableContent.generateAIImages}
            onClearGeneratedImages={customizableContent.clearGeneratedImages}
            onCreateOrUpdate={handleCustomize}
            onBack={handleBack}
          />
        )}

        {customizableContent.isViewForm && !!customizableContent.content && (
          <ContentViewer
            hasVote={customizableContent.hasVote}
            voteCount={customizableContent.voteCount}
            content={customizableContent.content}
            currentUserId={userId}
            currentUserName={sessionStore.userName}
            currentUserImageUrl={sessionStore.userImageUrl}
            currentUserIsGuest={sessionStore.isGuest}
            authorName={customizableContent.author?.name}
            authorAvatarHash={customizableContent.author?.profile.avatarHash}
            commentList={customizableContent.commentList}
            onDelete={canUserEdit ? handleDelete : undefined}
            onEdit={canUserEdit ? handleEdit : undefined}
            onVote={() => customizableContent.toggleVote(userId)}
            onAddComment={async (message) => {
              await customizableContent.addComment(userId, message);
              await customizableContent.fetchAllComments(0);
            }}
            onDeleteComment={async (commentId) => {
              await customizableContent.deleteComment(userId, commentId);
              await customizableContent.fetchAllComments(0);
            }}
          />
        )}
      </styled.Container>
    </Panel>
  );
};

export default observer(Customization);
