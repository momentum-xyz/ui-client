import styled from 'styled-components';

import {SvgButton} from '../SvgButton';

interface TextPropsInterface {
  lines: number;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: pre;
`;

export const Text = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  &.collapsed {
    -webkit-line-clamp: ${(props: TextPropsInterface) => props.lines};
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const MoreTextButton = styled(SvgButton)`
  transform: rotate(180deg);
`;

export const More = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &.collapsed {
    ${MoreTextButton} {
      transform: none;
    }
  }
`;
