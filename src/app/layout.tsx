import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Trivia Turbine',
  description: 'Generate trivia questions on any subject!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
