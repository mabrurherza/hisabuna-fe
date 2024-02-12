import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import "./globals.css";


export const metadata = {
  title: "Hisabuna | Development",
  description: "Hisabuna Development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="">{children}</body>
    </html>
  );
}
