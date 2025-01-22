import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './context/auth-context';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Orders Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
