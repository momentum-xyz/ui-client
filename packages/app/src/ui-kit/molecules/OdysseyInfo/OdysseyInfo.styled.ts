import styled from 'styled-components';

export const OdysseyInfoContainer = styled.div``;

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 20px;
  justify-content: space-between;
`;

export const TopContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;

  & img {
    border-radius: 50%;
  }
`;

export const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 90px 90px;
  grid-template-rows: 30px 30px;
  column-gap: 5px;
  row-gap: 10px;
`;

export const Description = styled.div`
  padding: 5px 10px 10px 10px;
  opacity: 0.9;
`;

export const Statistics = styled.div`
  padding: 6px 10px 0 10px;
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-xs);
  font-weight: 500;
`;

export const StatisticsData = styled.div`
  padding: 0 10px 20px 10px;
  color: ${(props) => props.theme.accent};
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
