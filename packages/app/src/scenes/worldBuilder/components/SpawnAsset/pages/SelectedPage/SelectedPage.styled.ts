import {Input, Text} from '@momentum-xyz/ui-kit';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const Image = styled.img`
  width: 196px;
  height: 197px;

  border-radius: 10px;
`;

export const NameLabel = styled(Text)``;

export const NameInput = styled(Input)`
  width: 280px;

  input {
    background-color: #000c29;
  }

  input::placeholder {
    font-weight: 400;
  }
`;

export const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CheckBox = styled.input`
  position: relative;
  height: 20px;
  width: 20px;
  border: 1px solid ${(props) => props.theme.text};

  :checked::after {
    content: '';
    position: absolute;
    background: ${(props) => props.theme.accent};
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    top: 5px;
    left: 5px;
  }
`;

export const CustobObjectActions = styled.div`
  display: flex;
  gap: 20px;
`;
