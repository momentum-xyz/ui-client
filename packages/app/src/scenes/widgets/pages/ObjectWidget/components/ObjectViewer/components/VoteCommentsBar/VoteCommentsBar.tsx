import {observer} from 'mobx-react-lite';
import {FC, useState} from 'react';
import {Voting, Comment, CommentForm, ButtonEllipse} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';
import {toast} from 'react-toastify';

import {ObjectCommentInterface, ObjectCommentWithUserInterface} from 'core/interfaces';
import {getImageAbsoluteUrl} from 'core/utils';
import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './VoteCommentsBar.styled';

interface PropsInterface {
  objectId: string;
}

const VoteCommentsBar: FC<PropsInterface> = ({objectId}) => {
  const {universeStore, sessionStore} = useStore();
  const {objectStore} = universeStore;
  const {votesAttr, commentsAttr, fetchComments} = objectStore;
  const {
    userId: currentUserId,
    userName: currentUserName,
    userImageUrl: currentUserImageUrl
  } = sessionStore;

  const {t} = useI18n();

  const [isNewCommentShown, setIsNewCommentShown] = useState(false);

  const onAddComment = async (comment: string) => {
    const uuid: string = uuidv4();
    const value: ObjectCommentInterface = {
      uuid: uuid,
      created: new Date().toISOString(),
      content: comment
    };

    try {
      await commentsAttr?.setItem(uuid, value);
      await fetchComments();
    } catch (e) {
      console.log(e);
      toast.error(<ToastContent isDanger icon="alert" text={t('assetsUploader.errorSave')} />);
    }
  };
  const onDeleteComment = async (commentId: string) => {
    try {
      await commentsAttr?.deleteItem(commentId);
      await fetchComments();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <styled.VotesCommentsPanel>
        {!!votesAttr && (
          <Voting
            count={votesAttr.count || 0}
            isActive={!!votesAttr.value}
            disabled={sessionStore.isGuest}
            onClick={async () => {
              if (votesAttr.value) {
                await votesAttr.delete();
              } else {
                await votesAttr.set({});
              }
              await votesAttr.load();
              await votesAttr.countAllUsers();
            }}
          />
        )}
        <ButtonEllipse
          icon="comment"
          label={t('actions.comment')}
          disabled={sessionStore.isGuest}
          onClick={() => setIsNewCommentShown(!isNewCommentShown)}
        />
      </styled.VotesCommentsPanel>

      {isNewCommentShown && (
        <CommentForm
          author={currentUserName}
          authorImageSrc={currentUserImageUrl}
          onCancel={() => setIsNewCommentShown(false)}
          onComment={(comment) => {
            onAddComment(comment);
            setIsNewCommentShown(false);
          }}
        />
      )}

      {!!commentsAttr && (
        <styled.CommentsList>
          {((commentsAttr.items || []) as ObjectCommentWithUserInterface[]).map(
            ({uuid, created, content, _user}) => (
              <Comment
                key={uuid}
                message={content}
                author={_user.profile.name}
                authorImageSrc={getImageAbsoluteUrl(_user.profile.avatar_hash)}
                dateISO={created}
                onDelete={currentUserId === _user.user_id ? () => onDeleteComment(uuid) : undefined}
              />
            )
          )}
        </styled.CommentsList>
      )}
    </>
  );
};

export default observer(VoteCommentsBar);
