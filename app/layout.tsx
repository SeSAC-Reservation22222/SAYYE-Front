import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeSAC Meet",
  description: "회의실 예약 및 관리 시스템",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <body className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
        {children}
      </body>
    </html>
  );
}


