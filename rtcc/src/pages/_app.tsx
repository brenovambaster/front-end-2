
// _app.js
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import Menu from "@/components/Menu";
import 'primeicons/primeicons.css';

import React from 'react';

export default function App({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  return (
    <PrimeReactProvider>
      <Menu />

      <Component {...pageProps} />

    </PrimeReactProvider>
  );
}
