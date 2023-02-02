import {FC} from 'react';

import * as styled from './SectionedScreen.styled';

export const SectionedScreen: FC = () => {
  return (
    <styled.Container>
      <styled.InnerContainer style={{flexGrow: 1}}>
        <styled.Section
          id="left-top"
          style={{background: 'green', justifyContent: 'flex-start', flexGrow: 1}}
        />
        <styled.Section
          id="right-top"
          style={{background: 'blue', justifyContent: 'flex-end', flexGrow: 0}}
        />
      </styled.InnerContainer>
      <styled.InnerContainer style={{flexGrow: 0}}>
        <styled.Section
          id="left-bottom"
          style={{background: 'red', justifyContent: 'flex-start', flexGrow: 0}}
        />
        <styled.Section
          id="right-bottom"
          style={{background: 'yellow', justifyContent: 'flex-end', flexGrow: 1}}
        />
      </styled.InnerContainer>
    </styled.Container>
  );
};
