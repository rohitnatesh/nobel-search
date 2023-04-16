import { HomePage } from './HomePage';
import { homePageLoader } from './HomePage/loader';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    loader: homePageLoader,
    errorElement: 'Something went wrong!',
  },
  {
    path: '*',
    element: 'Page not found!',
  },
];
