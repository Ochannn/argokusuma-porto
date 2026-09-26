import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Argo Kusuma | Portfolio",
  description: "Personal portfolio of Argo Kusuma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}