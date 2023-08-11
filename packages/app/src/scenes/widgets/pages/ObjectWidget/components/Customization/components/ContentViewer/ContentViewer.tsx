import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {dateWithoutTime, getTime, useI18n} from '@momentum-xyz/core';
import {
  Frame,
  Image,
  Voting,
  Comment,
  TextLinkify,
  CommentForm,
  ButtonEllipse,
  ImageSizeEnum,
  Hexagon
} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {CustomizableObjectInterface} from 'api';
import {ObjectCommentWithUserInterface} from 'core/interfaces';

import * as styled from './ContentViewer.styled';

interface PropsInterface {
  currentUserId: string;
  currentUserName: string;
  currentUserImageUrl: string;
  currentUserIsGuest: boolean;
  authorName: string | null | undefined;
  authorAvatarHash?: string | null | undefined;
  content: CustomizableObjectInterface;
  hasVote: boolean;
  voteCount: number;
  commentList: ObjectCommentWithUserInterface[];
  onDelete?: () => void;
  onEdit?: () => void;
  onVote: () => void;
  onAddComment: (message: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const ContentViewer: FC<PropsInterface> = ({
  currentUserId,
  currentUserName,
  currentUserImageUrl,
  currentUserIsGuest,
  authorName,
  authorAvatarHash,
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
          <styled.Header>
            <Hexagon
              iconName="astronaut"
              type="fourth-borderless"
              imageSrc={getImageAbsoluteUrl(authorAvatarHash)}
            />

            <styled.UserInfo>
              <styled.UserInfoTitle>
                <styled.UserName>{authorName || content.claimed_by}</styled.UserName>
                <styled.Date>
                  <div>
                    {dateWithoutTime(content.created_at)} / {getTime(content.created_at)}
                  </div>
                </styled.Date>
              </styled.UserInfoTitle>
            </styled.UserInfo>
          </styled.Header>

          <styled.Title>{content.title}</styled.Title>

          <styled.Grid>
            <Image
              height={280}
              errorIcon="photo_camera"
              src={getImageAbsoluteUrl(content.image_hash, ImageSizeEnum.S5)}
            />

            <styled.Opinion>
              <Voting
                count={voteCount}
                isActive={hasVote}
                disabled={currentUserIsGuest}
                onClick={onVote}
              />
              <ButtonEllipse
                icon="comment"
                label={t('actions.comment')}
                disabled={currentUserIsGuest}
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

            {commentList.map(({uuid, created, content, _user}) => (
              <Comment
                key={uuid}
                message={content}
                dateISO={created}
                author={_user.profile.name}
                authorImageSrc={getImageAbsoluteUrl(_user.profile.avatar_hash)}
                onDelete={currentUserId === _user.user_id ? () => onDeleteComment(uuid) : undefined}
              />
            ))}
          </styled.CommentsContainer>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(ContentViewer);
