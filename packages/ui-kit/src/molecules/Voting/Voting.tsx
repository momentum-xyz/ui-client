import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';

import * as styled from './Voting.styled';

export interface VotingPropsInterface {
  variant?: 'primary';
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

const Voting = forwardRef<HTMLButtonElement, VotingPropsInterface>((props, ref) => {
  const {variant = 'primary', count, isActive, onClick} = props;

  const countString = count > 0 && count < 10 ? `0${count}` : `${count}`;

  return (
    <styled.Button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(variant, isActive && 'isActive')}
      data-testid="Voting-test"
    >
      <IconSvg name="vote_up" size="xs" />
      <span className={cn('count', isActive && 'isActive')}>{countString}</span>
    </styled.Button>
  );
});

export default memo(Voting);
