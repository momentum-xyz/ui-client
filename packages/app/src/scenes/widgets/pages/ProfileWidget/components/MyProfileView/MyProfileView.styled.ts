import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const AvatarContainer = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const NameContainer = styled.div`
  max-width: 160px;
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Info = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Link = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
  color: var(--white);
`;

export const LocationText = styled(Text)`
  max-width: 250px;
`;

export const Container = styled.div``;

export const HeaderItem = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  justify-content: left;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  width: 100%;
  gap: 10px;

  margin-bottom: 0;

  ${HeaderItem} ~ ${HeaderItem} {
    margin-left: 10px;
  }
`;

export const Initiatives = styled.div`
  padding: 8px 0 10px 0;
`;
