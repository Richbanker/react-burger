import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { App } from './components/app/app';
import { store } from './services/store';

import './index.css';
import './pages/pages.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </HashRouter>
    </Provider>
  </StrictMode>
);
