import {FC, memo} from 'react';

import {ButtonEllipse} from '../../atoms';

import * as styled from './CalendarButtons.styled';

export interface CalendarButtonsPropsInterface {
  attendeesLabel: string;
  joinLabel?: string;
  isFavorite?: boolean;
  onJoinClick?: () => void;
  onFavoriteClick?: () => void;
  onFlyClick?: () => void;
}

const CalendarButtons: FC<CalendarButtonsPropsInterface> = ({
  attendeesLabel,
  joinLabel,
  isFavorite,
  onJoinClick,
  onFavoriteClick,
  onFlyClick
}) => {
  return (
    <styled.Container data-testid="CalendarButtons-test">
      <ButtonEllipse label={attendeesLabel} />
      <ButtonEllipse icon="calendar" label={joinLabel} onClick={onJoinClick} />
      <ButtonEllipse icon={isFavorite ? 'favorite' : 'star_favorite'} onClick={onFavoriteClick} />
      <ButtonEllipse icon="fly-to" onClick={onFlyClick} />
    </styled.Container>
  );
};

export default memo(CalendarButtons);
