import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
`;

export const Title = styled.div`
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
`;

export const Text = styled.div`
  line-height: 22px;
`;

export const ActionsBar = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;
  align-items: center;
`;
