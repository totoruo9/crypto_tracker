import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { blackTheme } from './theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={blackTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
