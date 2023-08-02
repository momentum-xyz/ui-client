import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Frame,
  Image,
  Voting,
  Comment,
  TextLinkify,
  CommentForm,
  ButtonEllipse,
  ImageSizeEnum
} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {CustomizableObjectInterface} from 'api';
import {ObjectCommentInterface} from 'core/interfaces';

import * as styled from './ContentViewer.styled';

interface PropsInterface {
  currentUserName: string;
  currentUserImageUrl: string;
  content: CustomizableObjectInterface;
  hasVote: boolean;
  voteCount: number;
  commentList: ObjectCommentInterface[];
  onDelete?: () => void;
  onEdit?: () => void;
  onVote: () => void;
  onAddComment: (message: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const ContentViewer: FC<PropsInterface> = ({
  currentUserName,
  currentUserImageUrl,
  content,
  hasVote,
  voteCount,
  commentList,
  onDelete,
  onEdit,
  onVote,
  onAddComment,
  onDeleteComment
}) => {
  const [isNewCommentShown, setIsNewCommentShown] = useState(false);

  const {t} = useI18n();

  return (
    <styled.Container data-testid="ContentViewer-test">
      <Frame>
        <styled.Wrapper>
          <styled.Title>{content.title}</styled.Title>
          <styled.Grid>
            <Image
              height={280}
              errorIcon="photo_camera"
              src={getImageAbsoluteUrl(content.image_hash, ImageSizeEnum.S5)}
            />

            <styled.Opinion>
              <Voting count={voteCount} isActive={hasVote} onClick={onVote} />
              <ButtonEllipse
                icon="comment"
                label={t('actions.comment')}
                onClick={() => setIsNewCommentShown(!isNewCommentShown)}
              />
            </styled.Opinion>

            <TextLinkify text={content.text} />

            <styled.Controls>
              {!!onDelete && (
                <ButtonEllipse icon="bin" label={t('actions.remove')} onClick={onDelete} />
              )}

              {
                !!onEdit && <></>
                /*<ButtonEllipse icon="pencil" label={t('actions.edit')} onClick={onEdit} />*/
              }
            </styled.Controls>
          </styled.Grid>

          <styled.CommentsContainer>
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

            {commentList.map(({uuid, created, content}) => (
              <Comment
                key={uuid}
                dateISO={created}
                author={uuid} // TODO
                authorImageSrc="" // TODO
                message={content}
                onDelete={() => onDeleteComment(uuid)}
              />
            ))}
          </styled.CommentsContainer>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(ContentViewer);
