import {FC, memo, useState} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, Hexagon, Textarea} from '../../atoms';

import * as styled from './CommentForm.styled';

export interface CommentFormPropsInterface {
  author: string;
  authorImageSrc: string | null;
  onComment: (message: string) => void;
  onCancel: () => void;
}

const CommentForm: FC<CommentFormPropsInterface> = ({
  author,
  authorImageSrc,
  onComment,
  onCancel
}) => {
  const [message, setMessage] = useState<string>('');

  const {t} = useI18n();

  return (
    <styled.Container data-testid="CommentForm-test">
      <styled.TitleContainer>
        <Hexagon iconName="astronaut" imageSrc={authorImageSrc} type="fourth-borderless" />
        <styled.Title>
          <styled.Name>{author}</styled.Name>
        </styled.Title>
      </styled.TitleContainer>

      <styled.Message>
        <Textarea
          lines={3}
          value={message}
          placeholder={t('placeholders.addComment')}
          onChange={(value) => setMessage(value)}
        />
      </styled.Message>

      <styled.Actions>
        <ButtonEllipse
          icon="close_large"
          label={t('actions.cancel')}
          onClick={onCancel}
          disabled={!message}
        />
        <ButtonEllipse
          icon="add"
          label={t('actions.addComment')}
          onClick={() => onComment(message)}
          disabled={!message}
        />
      </styled.Actions>
    </styled.Container>
  );
};

export default memo(CommentForm);
