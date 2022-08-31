import styled from 'styled-components';

import {Button, Heading, Text} from 'ui-kit';
import blueBloc from 'static/images/blue-bloc.png';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
  overflow-y: scroll;
`;

export const Title = styled(Heading)`
  h1 {
    font-size: 60px;
  }
`;

export const Information = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const Description = styled(Text)`
  max-width: 950px;
`;

export const StyledButton = styled(Button)`
  width: fit-content;
`;

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

export const ButtonAndSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 55px;
  align-items: center;
`;

export const Spacer = styled.div``;
