import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
  ButtonEllipse,
  CommentForm,
  Frame,
  Image,
  ImageSizeEnum,
  Voting
} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import Linkify from 'react-linkify';

import {CustomizableObjectInterface} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './ContentViewer.styled';

interface PropsInterface {
  currentUserName: string;
  currentUserImageUrl: string;
  content: CustomizableObjectInterface;
  hasVote: boolean;
  voteCount: number;
  onDelete?: () => void;
  onEdit?: () => void;
  onVote: () => void;
  onAddComment: (message: string) => void;
  onDeleteComment: () => void;
}

const ContentViewer: FC<PropsInterface> = ({
  currentUserName,
  currentUserImageUrl,
  content,
  hasVote,
  voteCount,
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

            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a href={decoratedHref} key={key} target="_blank" rel="noreferrer">
                  {decoratedText}
                </a>
              )}
            >
              <styled.Description>{content.text}</styled.Description>
            </Linkify>

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
                onComment={onAddComment}
              />
            )}
          </styled.CommentsContainer>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(ContentViewer);
