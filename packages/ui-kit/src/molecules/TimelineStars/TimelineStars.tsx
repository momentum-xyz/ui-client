import {FC, memo} from 'react';

import {IconButton, IconSvg} from '../../atoms';

import * as styled from './TimelineStars.styled';

export interface TimelineStarsPropsInterface {
  isStarActive: boolean;
  label: string;
  totalLabel: string;
  linkLabel?: string;
  onStarClick?: () => void;
  onLinkClick?: () => void;
}

const TimelineStars: FC<TimelineStarsPropsInterface> = ({
  isStarActive,
  label,
  totalLabel,
  linkLabel,
  onStarClick,
  onLinkClick
}) => {
  return (
    <styled.Container data-testid="TimelineStars-test">
      <styled.Stars>
        <IconButton
          isWhite
          onClick={onStarClick}
          name={isStarActive ? 'favorite' : 'star_favorite'}
        />
        <div>{label}</div>
        <IconSvg isWhite name="favorite" />
        <div>{totalLabel}</div>
      </styled.Stars>

      {linkLabel && <styled.Link onClick={onLinkClick}>{linkLabel}</styled.Link>}
    </styled.Container>
  );
};

export default memo(TimelineStars);
