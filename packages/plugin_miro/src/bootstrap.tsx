import React from 'react';
import ReactDOM from 'react-dom';
import 'static/styles/index.css';
import styled, {ThemeProvider} from 'styled-components';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';
import {HostEmulator} from '@momentum-xyz/sdk';
import {MomentumRequiredPage} from 'pages/MomentumRequiredPage';

import '@momentum-xyz/ui-kit/dist/themes/themes';
import 'shared/services/i18n';

import plugin from './Plugin';

const isDevEnv = process.env.NODE_ENV === 'development';

const root = document.getElementById('root') as HTMLElement;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultThemeConfig}>
      <Container>
        {isDevEnv ? <HostEmulator plugin={plugin} /> : <MomentumRequiredPage />}
      </Container>
    </ThemeProvider>
  </React.StrictMode>,
  root
);
