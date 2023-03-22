import {FC, memo} from 'react';
import {getDayWithMonth, getTime} from '@momentum-xyz/core';

import {Hexagon} from '../../atoms';

import * as styled from './CalendarCap.styled';

export interface CalendarCapPropsInterface {
  name: string;
  dateISO: string;
}

const CalendarCap: FC<CalendarCapPropsInterface> = ({name, dateISO}) => {
  return (
    <styled.Container data-testid="CalendarCap-test">
      <Hexagon iconName="calendar" type="third-borderless" transparentBackground />
      <styled.TitleContainer>
        <styled.Day>{getDayWithMonth(dateISO)}</styled.Day>
        <styled.Date>{getTime(dateISO)}</styled.Date>
        <styled.Name>{name}</styled.Name>
      </styled.TitleContainer>
    </styled.Container>
  );
};

export default memo(CalendarCap);
