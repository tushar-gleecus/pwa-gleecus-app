'use client';
import { ReactNode } from 'react';

export default function AppLayoutClient({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="app-header bg-slate-950 text-white shadow-md px-4 py-3 flex items-center justify-between">
        <img src="/logo.svg" alt="Logo" className="logo h-10" />
        <a href="/history">
          <button className="nav-btn bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-full font-semibold shadow">
            📜 History
          </button>
        </a>
      </header>

      <main className="main-content bg-black min-h-screen">{children}</main>

      <footer className="app-footer bg-slate-950 text-white text-center py-3">
        © 2025 My PWA App
      </footer>
    </>
  );
}
