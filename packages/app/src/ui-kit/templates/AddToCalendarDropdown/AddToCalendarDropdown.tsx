import React, {FC, useRef} from 'react';
import {AddToCalendarPropsInterface} from 'react-add-to-calendar-hoc';
import {useClickOutside} from '@momentum/ui-kit';

import * as styled from './AddToCalendarDropdown.styled';

interface PropsInterface extends AddToCalendarPropsInterface {}

const AddToCalendarDropdown: FC<PropsInterface> = (props) => {
  const {children, onRequestClose = () => {}} = props;
  const ref = useRef(null);

  useClickOutside(ref, onRequestClose);

  return (
    <styled.AddEventContainer ref={ref} data-testid="AddToCalendarDropdown-test">
      {children}
    </styled.AddEventContainer>
  );
};

export default AddToCalendarDropdown;
