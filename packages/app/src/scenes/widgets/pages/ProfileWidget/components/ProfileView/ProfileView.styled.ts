import styled from 'styled-components';

export const Container = styled.div``;

export const UserInfo = styled.div``;

export const AvatarContainer = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const Separator = styled.div`
  border-top: 1px solid ${(props) => props.theme.accentText};
  margin: 10px;
`;

export const NameContainer = styled.div`
  margin: 10px 0;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const AddressContainer = styled.div`
  font-style: italic;
  font-size: 13px;

  letter-spacing: 0.02em;
  text-decoration-line: underline;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BioContainer = styled.div`
  margin-bottom: 10px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  & > button {
    margin-right: 10px;
  }
`;

export const Link = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
  color: ${(props) => props.theme.accentText};
`;

export const OwnedOdysseys = styled.div``;
export const OwnedOdysseysTitle = styled.div`
  margin: 10px;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  display: flex;
  align-items: center;

  & > span {
    margin-right: 10px;
  }
`;
