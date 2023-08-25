import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.div`
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
`;

export const Message = styled.div`
  font-size: var(--font-size-s);
  line-height: 22px;
`;

export const UploadBlock = styled.div``;

export const TracksContainer = styled.div`
  margin: 10px 0 0 0;
  padding: 20px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const TrackList = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ActionBar = styled.div`
  padding: 10px;

  > button {
    flex: 1;
    justify-content: center;
    width: 156px;
  }
`;
