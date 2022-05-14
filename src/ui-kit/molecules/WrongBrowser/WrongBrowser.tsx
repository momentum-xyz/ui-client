import React, {FC} from 'react';

import {Heading, Text} from 'ui-kit/atoms';

import * as styled from './WrongBrowser.styled';

export interface PropsInterface {
  title: string;
  message: string;
  browserList: string;
}

const WrongBrowser: FC<PropsInterface> = (props) => (
  <styled.Wrapper data-testid="WrongBrowser-test">
    <Heading label={props.title} type="h2" />
    <Text text={props.message} size="m" />
    <Text text={props.browserList} size="m" />
  </styled.Wrapper>
);

export default WrongBrowser;
