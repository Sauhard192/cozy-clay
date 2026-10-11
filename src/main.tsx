import './styles/fonts.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/site.css';
import App from './App';
async function start() {
  // Render with the brand fonts ready; recover if fonts fail or take too long.
  await Promise.race([
    Promise.all([
      document.fonts.load('400 1rem "Cherry Bomb One"'),
      document.fonts.load('500 1rem Quicksand'),
      document.fonts.load('700 1rem Quicksand'),
    ]).catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
void start();
