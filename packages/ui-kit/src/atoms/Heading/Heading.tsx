import {FC, PropsWithChildren} from 'react';

import * as styled from './Heading.styled';

interface PropsInterface {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
}

export const Heading: FC<PropsWithChildren<PropsInterface>> = ({variant, children}) => {
  return <styled.Heading className={`variant-${variant}`}>{children}</styled.Heading>;
};
