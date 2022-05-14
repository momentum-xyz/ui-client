import styled from 'styled-components';

export const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .Heading-custom {
    padding-left: 10px;
  }
`;

export const QueryContainer = styled.div``;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.accentDanger};
  font-size: var(--font-size-xs);
  margin-left: 10px;
`;
