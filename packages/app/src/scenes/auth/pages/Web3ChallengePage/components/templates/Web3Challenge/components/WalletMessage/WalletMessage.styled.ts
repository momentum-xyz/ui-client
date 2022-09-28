import styled from 'styled-components';

export const Message = styled.div`
  color: ${(props) => props.theme.text};
  text-align: center;
  width: 75%;
`;

export const ExtensionMessage = styled.div`
  padding: 16px 0 0 0;
  color: ${(props) => props.theme.text};
  text-align: center;
  width: 100%;
`;

export const Error = styled.div`
  color: ${(props) => props.theme.accentDanger};
  text-align: center;
  width: 60%;
`;
