import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jardin de La Farlède',
  description: 'Manuel et calendrier d\'entretien',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 text-sm">
            <Link href="/" className="font-semibold">🌿 Jardin</Link>
            <Link href="/plantes" className="hover:underline">Plantes</Link>
            <Link href="/calendrier" className="hover:underline">Calendrier</Link>
            <Link href="/interieur" className="hover:underline">Intérieur</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}