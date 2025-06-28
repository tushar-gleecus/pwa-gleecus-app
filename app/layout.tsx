import '../styles/globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gleecus PWA App',
  description: 'PWA to capture speech and image input with offline support.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHistory = pathname === '/history';

  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <img src="/logo.svg" alt="Gleecus Logo" className="logo" width="120" height="40" />
          <Link href={isHistory ? '/' : '/history'}>
            <button className="nav-btn">{isHistory ? '🏠 Home' : '📜 History'}</button>
          </Link>
        </header>
        <main className="main-content">{children}</main>
        <footer className="app-footer">© 2025 My PWA App</footer>
      </body>
    </html>
  );
}
