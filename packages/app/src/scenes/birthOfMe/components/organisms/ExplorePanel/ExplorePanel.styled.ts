import styled from 'styled-components';

export const Heading = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Message = styled.div`
  padding: 0 20px;
`;

export const Number = styled.div`
  font-size: 32px;
  font-weight: 300;
  color: ${(props) => props.theme.accent};
`;

export const Explore = styled.div`
  padding: 18px 10px 8px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const Loader = styled.div`
  height: 160px;
  padding: 0 0 15px 0px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const EmptyResult = styled.div`
  height: 160px;
  padding: 0 0 15px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
