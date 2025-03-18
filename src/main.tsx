
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import ScrollRestoration from './components/common/ScrollRestoration'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollRestoration>
      <App />
    </ScrollRestoration>
  </BrowserRouter>
);
