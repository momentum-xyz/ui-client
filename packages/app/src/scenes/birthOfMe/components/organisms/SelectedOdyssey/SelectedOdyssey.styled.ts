import styled from 'styled-components';

export const Header = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const Container = styled.div`
  padding: 6px 10px 10px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  color: #fff2f1;
`;
