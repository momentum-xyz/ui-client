import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const Body = styled.div`
  display: flex;
  overflow: hidden;
  min-height: 150px;
  max-height: calc(100% - 50px);
  margin-top: 10px;
`;
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

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  width: 80px;
  height: max-content;
  gap: 10px;
  padding-bottom: 5px;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
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
  max-width: 285px;
`;

export const LocationText = styled(Text)`
  max-width: 282px;
`;
