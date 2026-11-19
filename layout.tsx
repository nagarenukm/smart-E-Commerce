import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECORA | Sustainable Shopping",
  description: "Shop consciously. Live sustainably."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
