import { Home } from './Home';
import { homeLoader } from './Home/loader';
import { PageNotFound } from './PageNotFound';
import { Error } from './Error';
import { Profile } from './Profile';
import { profileLoader } from './Profile/loader';

export const routes = [
  {
    path: '/',
    element: <Home />,
    loader: homeLoader,
    errorElement: <Error />,
  },
  {
    path: '/profile',
    element: <Profile />,
    loader: profileLoader,
    errorElement: <Error />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];
