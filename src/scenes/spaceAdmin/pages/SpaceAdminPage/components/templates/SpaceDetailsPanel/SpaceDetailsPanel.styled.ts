import styled from 'styled-components';

export const Info = styled.div`
  width: 100%;
`;

export const Access = styled.div`
  display: flex;
  gap: 14px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: start;
`;

export const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  gap: 20px;
  flex-wrap: wrap;
`;

export const BreadcrumbContainer = styled.div`
  display: contents;
`;

export const Breadcrumb = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BreadcrumbUnderline = styled.div`
  width: 100%;
  height: 1px;
  background: ${(props) => props.theme.accent};
  box-shadow: 0 0 10px 1px rgba(255, 242, 241, 0.5);
`;

export const BreadCrumbsContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;

  ${BreadcrumbContainer} + ${BreadcrumbContainer}::before {
    color: ${(props) => props.theme.accent};
    content: ' > ';
  }
`;
