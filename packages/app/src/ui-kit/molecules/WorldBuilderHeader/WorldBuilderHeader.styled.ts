import styled from 'styled-components';
import {Heading} from '@momentum-xyz/ui-kit';

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

  &.small {
    width: 340px;
    gap: 19px;
  }
`;

export const Logo = styled.img`
  width: 525px;

  &.small {
    width: 245px;
  }
`;

export const Title = styled(Heading)`
  h1 {
    font-size: 60px;
  }

  &.small {
    h1 {
      font-size: 28px;
    }
  }
`;
