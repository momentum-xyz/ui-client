import {FC, memo} from 'react';
import {dateWithoutTime, useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, Hexagon} from '../../atoms';

import * as styled from './Comment.styled';

export interface CommentPropsInterface {
  author: string;
  authorImageSrc: string | null;
  dateISO: string;
  message: string;
  onDelete?: () => void;
}

const Comment: FC<CommentPropsInterface> = ({
  author,
  authorImageSrc,
  message,
  dateISO,
  onDelete
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="Comment-test">
      <styled.TitleContainer>
        <Hexagon iconName="astronaut" imageSrc={authorImageSrc} type="fourth-borderless" />
        <styled.Title>
          <styled.Name>{author}</styled.Name>
          <styled.Date>{dateWithoutTime(dateISO)}</styled.Date>
        </styled.Title>
      </styled.TitleContainer>

      <styled.Message>{message}</styled.Message>

      {!!onDelete && (
        <styled.Actions>
          <ButtonEllipse icon="bin" label={t('actions.delete')} onClick={onDelete} />
        </styled.Actions>
      )}
    </styled.Container>
  );
};

export default memo(Comment);
