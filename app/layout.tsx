import '../styles/globals.css';
import AppLayoutClient from './AppLayoutClient';

export const metadata = {
  title: 'My PWA App',
  description: 'Image Upload Submission PWA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}
