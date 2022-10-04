import styled from 'styled-components';

export const Dropdown = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  &.error {
    border: 1px solid ${(props) => props.theme.accentDanger};
    border-radius: 6px;
  }
`;

export const Options = styled.div`
  position: absolute;
  width: 100%;
`;

export const DropdownIcon = styled.div`
  padding: 0 12px;
  transition: transform var(--tr-100-ei);

  &.opened {
    transform: rotate(180deg);
  }
`;
