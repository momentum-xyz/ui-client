import styled from 'styled-components';

import {Heading} from 'ui-kit';
import blueBloc from 'static/images/blue-bloc.png';

export const LogoContainer = styled.div`
  background: url(${blueBloc});
  background-size: contain;
  background-repeat: no-repeat;
  width: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const Logo = styled.img`
  width: 525px;
`;

export const Title = styled(Heading)`
  h1 {
    font-size: 60px;
  }
`;
