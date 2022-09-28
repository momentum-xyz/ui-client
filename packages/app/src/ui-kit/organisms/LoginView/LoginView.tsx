import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import {Text, Button, ButtonInfoInterface} from 'ui-kit';

import * as styled from './LoginView.styled';

interface PropsInterface extends PropsWithThemeInterface {
  logo: string;
  title: string;
  okBtn?: ButtonInfoInterface;
  backBtn?: ButtonInfoInterface;
}

const LoginView: FC<PropsInterface> = (props) => {
  const {theme, logo, title, okBtn, backBtn, children} = props;
  return (
    <styled.Wrapper data-testid="LoginView-test">
      <styled.Logo src={logo} />
      <styled.Title>
        <Text theme={theme} size="l" text={title} weight="medium" />
      </styled.Title>

      <styled.Web3>{children}</styled.Web3>

      <styled.Actions>
        {backBtn && (
          <styled.Action>
            <Button
              theme={theme}
              icon={backBtn.icon}
              label={backBtn.title}
              variant={backBtn.variant}
              disabled={backBtn.disabled}
              onClick={backBtn.onClick}
              wide
            />
          </styled.Action>
        )}
        {okBtn && (
          <styled.Action>
            <Button
              theme={theme}
              icon={okBtn.icon}
              label={okBtn.title}
              variant={okBtn.variant}
              disabled={okBtn.disabled}
              onClick={okBtn.onClick}
              wide
            />
          </styled.Action>
        )}
      </styled.Actions>
    </styled.Wrapper>
  );
};

export default LoginView;
