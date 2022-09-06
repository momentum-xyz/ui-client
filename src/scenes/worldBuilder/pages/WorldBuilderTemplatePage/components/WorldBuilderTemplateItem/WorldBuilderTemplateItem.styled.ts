import styled from 'styled-components';

import {Text} from 'ui-kit';

export const Container = styled.div`
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid transparent;
  width: 100%;
  aspect-ratio: 1;

  :hover {
    border: 1px solid ${(props) => props.theme.accent};
  }
`;

export const Image = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background: ${(props) => props.theme.bg};
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Description = styled(Text)`
  overflow: hidden;
  max-width: 250px;
`;
