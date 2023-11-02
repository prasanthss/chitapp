import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import ErrorBoundary from './ErrorBoundary'; // Your custom error bounda

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  </BrowserRouter>,
)
