import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

export const metadata: Metadata = {
  title: "&Nuts Admin Portal",
  description: "Admin dashboard for &Nuts Trading e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
