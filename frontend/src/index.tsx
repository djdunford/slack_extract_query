import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: 'eu-west-2:372e73d7-1bf7-4b12-adb9-2484d12ecfe1',
    region: 'eu-west-2',
    userPoolId: 'eu-west-2_6IR8hhJv5',
    userPoolWebClientId: '41ujni164r350cv4t4i1e1erf7',
  },
  API: {
    endpoints: [
      {
        name: "slackquery",
        endpoint: "https://5ww3ajseqg.execute-api.eu-west-2.amazonaws.com/prod/",
        custom_header: async () => {
          return {Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`};
        },
      },
    ],
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
