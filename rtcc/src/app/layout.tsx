import '../styles/globals.css'

import "primereact/resources/themes/lara-light-cyan/theme.css";

import 'primeicons/primeicons.css';

import Menu from '../components/Menu'
export const metadata = {
  title: 'Next.js', 
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  )
}