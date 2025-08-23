import '@styles/globals.css';
import React from 'react';
import type { Metadata } from 'next';
import HeaderSection from '@blocks/Header';

export const metadata: Metadata = {
  title: 'Blog VCS',
  description: 'Blog Version Control System — Next.js + TipTap + MongoDB'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50">
        <HeaderSection />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="py-6 text-center text-slate-500">
          © {new Date().getFullYear()} Blog VCS — Built with Next.js & TipTap
        </footer>
      </body>
    </html>
  );
}
