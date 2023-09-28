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
      <body
        className={poppins.className}
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <div className="min-h-screen h-full flex flex-col">
          <Toaster position={'top-right'} />
          <AuthProvider>
            <Header />
            <div className="flex-1 box-border h-[90%]">{children}</div>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
