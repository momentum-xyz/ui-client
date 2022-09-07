import styled from 'styled-components';

import {Heading, Input} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 40px;
  gap: 20px;
  overflow-y: scroll;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 90px;
  width: 70%;
`;

export const FormFieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

export const InputLabel = styled(Heading)`
  flex-shrink: 0;
  width: 160px;
  transform: translateY(5px);
`;

export const InputStyled = styled(Input)`
  width: 400px;
  flex-shrink: 0;
`;
