import {FC, memo} from 'react';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './StakingComment.styled';

interface PropsInterface {
  comment: string;
}

const StakingComment: FC<PropsInterface> = ({comment}) => {
  const {t} = useI18n();

  return (
    <styled.StakingCommentContainer>
      <div>{t('labels.lastStakingComment')}:</div>
      <styled.StakingComment>{comment}</styled.StakingComment>
    </styled.StakingCommentContainer>
  );
};

export default memo(StakingComment);
