import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import App from './App';
import ChatProvider from './context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChatProvider>
    <ChakraProvider>
      <Router>
    <App />
    </Router>
    </ChakraProvider>
  </ChatProvider>
);


