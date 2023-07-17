import styled from 'styled-components';
import {rgba} from 'polished';

export const Uploader = styled.div`
  position: relative;
  height: 172px;
  border-radius: 8px;
  border: 1px dashed ${(props) => props.theme.text};

  &.hasFile {
    height: initial;
    border: initial;
    border-radius: initial;
  }
`;

export const Container = styled.div`
  > div {
    padding: 0 20px;
  }

  button {
    margin: 0 20px -90px 20px;
    width: 100%;
  }
`;

export const Message = styled.div`
  padding: 18px 0 0 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export const Description = styled.div`
  font-size: var(--font-size-s);
  font-weight: 600;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const Extensions = styled.div`
  line-height: 22px;
`;

export const SelectedFile = styled.div`
  padding: 8px 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  box-shadow: -1px -1px 2px 0px rgba(158, 238, 255, 0.1);
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
`;

export const Name = styled.div`
  min-width: 0;

  div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
