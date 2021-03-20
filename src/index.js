import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBw86rhYa9tV2u5RXh42Ez30VlhrLU9xp0",
  authDomain: "storage-project-1eb5d.firebaseapp.com",
  databaseURL: "https://storage-project-1eb5d-default-rtdb.firebaseio.com",
  projectId: "storage-project-1eb5d",
  storageBucket: "storage-project-1eb5d.appspot.com",
  messagingSenderId: "39926656377",
  appId: "1:39926656377:web:e85bf341072110ed04d3a8"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
