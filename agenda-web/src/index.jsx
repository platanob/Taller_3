// index.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';

const port = process.env.PORT || 3000;
App.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)

