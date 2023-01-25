import React, {FC, memo} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './LoaderFallback.styled';

interface PropsInterface extends PropsWithThemeInterface {
  text: string;
}

const LoaderFallback: FC<PropsInterface> = ({text}) => {
  return <styled.Container data-testid="LoaderFallback-test">{text}</styled.Container>;
};

export default memo(LoaderFallback);
