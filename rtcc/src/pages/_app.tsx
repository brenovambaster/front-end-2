
// src/pages/_app.tsx
import { PrimeReactProvider } from 'primereact/api';

// NÃO ALTEE A ORDEM DE IMPORTAÇÃO DOS ARQUIVOS CSS
import '../styles/globals.css';
import 'primereact/resources/themes/tailwind-light/theme.css';


import 'primeicons/primeicons.css';
import Menu from "@/components/Menu";

import React from 'react';

export default function App({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  return (
    <PrimeReactProvider>
      <Menu />

      <Component {...pageProps} />

    </PrimeReactProvider>
  );
}
