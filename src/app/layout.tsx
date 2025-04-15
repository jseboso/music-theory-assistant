import { SupabaseProvider } from '@/components/SupabaseProvider';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music Theory Assistant',
  description: 'Learn music theory with interactive lessons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}