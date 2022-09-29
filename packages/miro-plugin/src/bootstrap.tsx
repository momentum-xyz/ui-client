import React from 'react';
import ReactDOM from 'react-dom';
import 'static/styles/index.css';
import styled from 'styled-components';
import axios, {AxiosInstance} from 'axios';
import {DefaultThemeConfig} from '@momentum/ui-kit';

import App from './App';

const REQUEST_TIMEOUT_MS = 10_000;
const root = document.getElementById('root') as HTMLElement;

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const request: AxiosInstance = axios.create({
  baseURL: '',
  responseType: 'json',
  headers: defaultHeaders,
  timeout: REQUEST_TIMEOUT_MS
});

ReactDOM.render(
  <React.StrictMode>
    <Container>
      <App
        theme={DefaultThemeConfig}
        // TODO: Make decision how to set default spaceId value (optionally, depening on the env)
        spaceId="b860dc5a-578a-4d05-b526-2a92e866d975"
        isSpaceAdmin={false}
        request={request}
      />
    </Container>
  </React.StrictMode>,
  root
);
