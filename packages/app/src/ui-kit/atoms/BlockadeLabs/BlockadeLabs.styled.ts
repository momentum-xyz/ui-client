import styled from 'styled-components';

export interface BlockadeLabsPropsInterface {
  bottomRightAbsolute?: boolean;
  bottomRightFlex?: boolean;
}

export const Container = styled.div<BlockadeLabsPropsInterface>`
  text-align: right;

  ${(props) => props.bottomRightAbsolute && 'position: absolute; bottom: 20px; right: 20px;'}
  ${(props) => props.bottomRightFlex && 'margin-top: auto;'}
`;

export interface LogoPropsInterface {
  small?: boolean;
}

export const Logo = styled.img<LogoPropsInterface>`
  height: 25px;

  ${(props) => props.small && 'height: 14px;'}
`;

export const Attribution = styled.div`
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.1px;
`;
