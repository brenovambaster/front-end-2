"use client";

import '../../styles/globals.css';

import "primereact/resources/themes/lara-light-cyan/theme.css";

import 'primeicons/primeicons.css';
import { PrimeReactProvider } from "primereact/api";

import { AuthProvider } from '@/contexts/AuthContext';
import Menu from '@/components/Menu';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <PrimeReactProvider>
                    <Menu />
                    {children}
                </PrimeReactProvider>
            </body>
        </html>
    )
}