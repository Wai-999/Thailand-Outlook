import type { Metadata } from 'next';
import { Playfair_Display, Lato, Poppins, Noto_Sans_Thai } from 'next/font/google';
import './whole.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MainContentWrapper from '@/components/MainContentWrapper';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display-loaded',
  display: 'swap',
});

const body = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body-loaded',
  display: 'swap',
});

const label = Poppins({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-label-loaded',
  display: 'swap',
});

const thai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '600'],
  variable: '--font-thai-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Thailand Outlook — Economic Research Dashboard',
  description:
    "An independent research dashboard tracking Thailand's economy: macro trends, sector intelligence, and transparent statistical analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${label.variable} ${thai.variable}`}>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <MainContentWrapper>
            <TopBar />
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
          </MainContentWrapper>
        </div>
      </body>
    </html>
  );
}
