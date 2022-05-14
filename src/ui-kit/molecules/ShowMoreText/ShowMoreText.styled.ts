import styled from 'styled-components';

interface TextProps {
  lines: number;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: pre-wrap;
`;

export const Text = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  &.collapsed {
    -webkit-line-clamp: ${(props: TextProps) => props.lines};
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const More = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  .IconSvg-custom {
    transform: rotate(180deg);
  }

  &.collapsed {
    .IconSvg-custom {
      transform: none;
    }
  }
`;
