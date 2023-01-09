import {Input} from '@momentum-xyz/ui-kit';
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

export const FileUploaderContainer = styled.div`
  position: relative;
  height: 50px;
  width: 100%;
`;

export const Error = styled.p`
  color: red;
`;

export const PreviewContainer = styled.div`
  width: 300px;
  height: 300px;

  border-radius: 10px;
`;

export const NameInput = styled(Input)`
  width: 280px;

  input {
    background-color: #000c29;
  }

  input::placeholder {
    font-weight: 400;
  }
`;
