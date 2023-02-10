import {FC} from 'react';

import * as styled from './SectionedScreen.styled';

export const SECTIONED_SCREEN_ID = 'sectioned-screen';

export interface PropsInterface {
  id?: string;
}

export const SectionedScreen: FC<PropsInterface> = ({id = SECTIONED_SCREEN_ID}) => {
  return (
    <styled.Container id={id}>
      <div className="sectioned-screen-section-break" />
    </styled.Container>
  );
};
