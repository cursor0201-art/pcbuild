import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Landing } from './pages/Landing';
import { Builder } from './pages/Builder';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: 'builder', Component: Builder },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'about', Component: About },
      { path: '*', Component: NotFound },
    ],
  },
]);
