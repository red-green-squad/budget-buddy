import { Header } from '@/components/common/Header';
import AuthProvider from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

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
        <div className="min-h-screen flex flex-col">
          <Toaster position={'bottom-right'} />
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
