import {FC, memo} from 'react';
import {timelineDate} from '@momentum-xyz/core';

import {Hexagon} from '../../atoms';

import * as styled from './TimelineItem.styled';

export interface TimelineItemPropsInterface {
  title: string;
  dateISO?: string;
  imageSrc?: string;
}

const TimelineItem: FC<TimelineItemPropsInterface> = ({title, dateISO, imageSrc}) => {
  return (
    <styled.Container data-testid="TimelineHead-test">
      <Hexagon imageSrc={imageSrc} type="third-borderless" />
      <styled.TitleContainer>
        <styled.Title>{title}</styled.Title>
        {dateISO && <styled.Date>{timelineDate(dateISO)}</styled.Date>}
      </styled.TitleContainer>
    </styled.Container>
  );
};

export default memo(TimelineItem);
