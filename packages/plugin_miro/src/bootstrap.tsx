import React from 'react';
import ReactDOM from 'react-dom';
import 'static/styles/index.css';
import styled, {ThemeProvider} from 'styled-components';
import {DefaultThemeConfig} from '@momentum/ui-kit';
import {MomentumRequiredPage} from 'pages/MomentumRequiredPage';

import '@momentum/ui-kit/dist/themes/themes';
import 'shared/services/i18n';

const root = document.getElementById('root') as HTMLElement;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultThemeConfig}>
      <Container>
        <MomentumRequiredPage />
      </Container>
    </ThemeProvider>
  </React.StrictMode>,
  root
);
