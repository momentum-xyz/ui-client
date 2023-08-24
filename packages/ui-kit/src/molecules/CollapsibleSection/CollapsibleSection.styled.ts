import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface TitlePropsInterface {
  disabled?: boolean;
}

export const Title = styled.div<TitlePropsInterface>`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  text-transform: uppercase;
  letter-spacing: 1.3px;

  margin: 10px 0;

  ${(props) => props.disabled && `opacity: 0.5;`}
`;

export const Head = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;

  color: ${(props) => props.theme.text};
`;

interface ContentPropsInterface {
  collapsed?: boolean;
}

export const Content = styled.div<ContentPropsInterface>`
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${(props) =>
    props.collapsed &&
    `
    display: none;

    transition: all 0.3s ease-in-out;
  `}
`;
