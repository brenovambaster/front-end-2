"use client";

import '../styles/globals.css';

import "primereact/resources/themes/lara-light-cyan/theme.css";

import 'primeicons/primeicons.css';
import { PrimeReactProvider } from "primereact/api";
import Menu from '../components/Menu';

import { AuthProvider } from '@/contexts/AuthContext';

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
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </PrimeReactProvider>
            </body>
        </html>
    )
}