import { HomePage } from './HomePage';
import { homePageLoader } from './HomePage/loader';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    loader: homePageLoader,
  },
  {
    path: '*',
    element: 'Page not found!',
  },
];
