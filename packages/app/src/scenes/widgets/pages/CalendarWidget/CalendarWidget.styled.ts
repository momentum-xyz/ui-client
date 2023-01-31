import styled from 'styled-components';
import {Button} from '@momentum-xyz/ui-kit';

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
`;

export const FormButton = styled(Button)`
  margin: 10px 0 0;
  width: 100%;
  background: rgba(1, 255, 179, 0.1);
`;

export const Container = styled.div`
  display: flex;
  border-radius: 10px;
  pointer-events: all;
  margin-bottom: 20px;
`;

export const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: var(--dialog-z-index);
`;
