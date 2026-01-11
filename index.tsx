
// Import React so we can use JSX (the HTML-like syntax in JavaScript)
import React from 'react';
// Import ReactDOM which is the bridge between React and the browser's Document Object Model (DOM)
import ReactDOM from 'react-dom/client';
// Import our main App component from the local App.tsx file
import App from './App';

// Find the <div> with id="root" in our index.html where the entire app will "live"
const rootElement = document.getElementById('root');

// If the root element doesn't exist, we throw an error because the app has nowhere to mount
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create the React root using the new React 18 API for better performance
const root = ReactDOM.createRoot(rootElement);

// Render the App component into the root. StrictMode helps catch potential bugs during development.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
