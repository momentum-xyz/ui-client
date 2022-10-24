import styled from 'styled-components';
import {Heading} from '@momentum-xyz/ui-kit';

export const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 400px;
  height: 200px;
`;

export const InputContainer = styled.div`
  display: flex;
  position: absolute;
  z-index: var(--dialog-z-index);
  padding-top: 110px;
  width: 100%;
  flex-direction: column;
  gap: 5px;
`;

export const DropdownHeading = styled(Heading)`
  padding-left: 10px;
`;

export const QueryContainer = styled.div`
  z-index: calc(var(--dialog-z-index) + 1);
  height: 50px;
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.accentDanger};
  font-size: var(--font-size-xs);
  margin-left: 10px;
`;

export const TextRow = styled.div`
  padding-left: 5px;
`;
