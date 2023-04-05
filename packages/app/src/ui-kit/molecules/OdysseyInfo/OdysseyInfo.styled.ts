import styled from 'styled-components';

export const OdysseyInfoContainer = styled.div``;

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 18px;
  justify-content: space-between;
  padding-bottom: 18px;
`;

export const TopContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 80px 80px;
  column-gap: 5px;
  row-gap: 8px;
`;

export const Info = styled.div`
  padding: 6px 0px 20px 6px;
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

export const Statistics = styled.div`
  padding: 0 6px;
  color: ${(props) => props.theme.accentText};
  font-size: var(--font-size-xs);
  font-weight: 500;
`;

export const StatisticsData = styled.div`
  padding: 0 6px 20.5px 6px;
  color: ${(props) => props.theme.accentText};
  font-size: var(--font-size-xs);
  font-weight: 500;
`;

export const StatisticsItem = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgba(255, 242, 241, 0.2);
  gap: 10px;
`;

export const StatisticsValue = styled.div`
  font-size: var(--font-size-xs);
  font-weight: 400;
  color: var(--white-100);
`;
