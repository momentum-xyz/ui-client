import styled from 'styled-components';

export const Message = styled.div`
  padding: 0 5px;
  color: ${(props) => props.theme.warning};
  font-size: var(--font-size-s);
  line-height: var(--font-size-s);
  text-align: right;
`;
