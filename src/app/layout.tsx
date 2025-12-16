import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query';

const lato = Lato({
  variable: '--font-lato-sans',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
