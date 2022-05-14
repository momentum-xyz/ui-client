import React, {FC, useRef} from 'react';
import {AddToCalendarPropsInterface} from 'react-add-to-calendar-hoc';

import {useClickOutside} from 'ui-kit';

import * as styled from './AddToCalendarDropdown.styled';

interface PropsInterface extends AddToCalendarPropsInterface {}

const AddToCalendarDropdown: FC<PropsInterface> = (props) => {
  const {children, onRequestClose = () => {}} = props;
  const ref = useRef(null);

  useClickOutside(ref, onRequestClose);

  return <styled.AddEventContainer ref={ref}>{children}</styled.AddEventContainer>;
};

export default AddToCalendarDropdown;
