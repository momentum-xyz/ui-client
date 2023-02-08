import {FC} from 'react';

import * as styled from './SectionedScreen.styled';

// this should allow debugging the layout even on prod - just set DEBUG=1 in sessionStorage and refresh
const DEBUG = sessionStorage.getItem('DEBUG') !== null;

export const SectionedScreen: FC = () => {
  return (
    <styled.Container>
      <styled.InnerContainer style={{flexGrow: 1}}>
        <styled.Section
          id="left-top"
          style={{
            background: DEBUG ? '#008000b0' : 'transparent',
            justifyContent: 'flex-start',
            flexGrow: 1,
            maxHeight: '98vh'
          }}
        />
        <styled.Section
          id="right-top"
          style={{
            background: DEBUG ? '#000080b0' : 'transparent',
            justifyContent: 'flex-end',
            flexGrow: 0
          }}
        />
      </styled.InnerContainer>
      <styled.InnerContainer style={{flexGrow: 0}}>
        <styled.Section
          id="left-bottom"
          style={{
            background: DEBUG ? '#800000b0' : 'transparent',
            justifyContent: 'flex-start',
            flexGrow: 1
          }}
        />
        <styled.Section
          id="right-bottom"
          style={{
            background: DEBUG ? '#ffff00b0' : 'transparent',
            justifyContent: 'flex-end',
            flexGrow: 0,
            maxHeight: '40vh',
            maxWidth: '600px'
          }}
        />
      </styled.InnerContainer>
    </styled.Container>
  );
};
