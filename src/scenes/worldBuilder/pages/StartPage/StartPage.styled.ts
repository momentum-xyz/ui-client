import styled from 'styled-components';

import {Button, Text} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
`;

export const Information = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Description = styled(Text)`
  max-width: 951px;
`;

export const StyledButton = styled(Button)`
  width: fit-content;
`;

export const LogoContainer = styled.div`
  overflow: hidden;
  height: 440px;
`;

export const Logo = styled.img`
  transform: translateY(-140px);
`;
