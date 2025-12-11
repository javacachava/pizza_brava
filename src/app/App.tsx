import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

// NUEVO
import { AppProviders } from '../contexts/providers/AppProviders';

export const App = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};
