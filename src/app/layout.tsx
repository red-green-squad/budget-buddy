import { Header } from '@/components/common/Header';
import AuthProvider from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Budget Buddy',
  description: 'An Expense Tracking and Management System',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
