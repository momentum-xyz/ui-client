import styled from 'styled-components';

import {SvgButton} from '../SvgButton';

export const Container = styled.div`
  display: flex;
  gap: 10px;
  height: 18px;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 6px;
  right: 6px;
  padding-right: 4px;
  padding-left: 4px;
  border-radius: 20px;

  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  mixblendmode: difference;
`;

export const SvgItem = styled(SvgButton)`
  opacity: 0.2;

  :hover {
    opacity: 100;
  }
`;
