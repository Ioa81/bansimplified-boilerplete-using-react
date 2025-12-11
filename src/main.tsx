import { RouterProvider, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import TanstackProvider from './contexts/TanstackProvider';
import "./index.css";
import { routerTree } from './routes/_root';


const router = createRouter({ routeTree: routerTree });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TanstackProvider>
        <RouterProvider router={ router } />
        <TanStackRouterDevtools router={ router } />
      </TanstackProvider>
    </BrowserRouter>
  </StrictMode>
)
