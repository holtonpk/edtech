import "./globals.css";
import {Analytics} from "@vercel/analytics/react";
export const metadata = {
  title: "Frizzle ai",
  description: "Turn anything into a presentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className="">{children}</body>
    </html>
  );
}
