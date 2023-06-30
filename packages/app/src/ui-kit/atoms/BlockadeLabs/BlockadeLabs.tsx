import {FC} from 'react';

import logo from 'static/images/blockadelabs.svg';

import * as styled from './BlockadeLabs.styled';

interface BlockadeLabsPropsInterface
  extends styled.LogoPropsInterface,
    styled.BlockadeLabsPropsInterface {
  withLicense?: boolean;
}

export const BlockadeLabs: FC<BlockadeLabsPropsInterface> = ({withLicense, ...props}) => (
  <styled.Container {...props}>
    <styled.Logo src={logo} alt="Blockade Labs" {...props} />
    {withLicense && (
      <styled.Attribution>
        AI Skyboxes are provided by{' '}
        <a href="https://www.blockadelabs.com/" target="_blank" rel="noopener noreferrer">
          Blockade Labs
        </a>{' '}
        and licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          cc4.0
        </a>
      </styled.Attribution>
    )}
  </styled.Container>
);
