import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('Main.tsx is being executed');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  if (!rootElement) {
    console.error('Root element not found in the DOM');
  } else {
    const root = createRoot(rootElement);
    console.log('Root created successfully');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('Render called on root');
  }
} catch (error) {
  console.error('Error rendering React app:', error);
}
