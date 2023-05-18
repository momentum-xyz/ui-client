import {FC, memo} from 'react';

import * as styled from './LoaderFallback.styled';

export interface LoaderFallbackPropsInterface {
  text: string;
}

const LoaderFallback: FC<LoaderFallbackPropsInterface> = ({text}) => {
  return <styled.Container data-testid="LoaderFallback-test">{text}</styled.Container>;
};

export default memo(LoaderFallback);
