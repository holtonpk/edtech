import "./globals.css";

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
      <body className="">{children}</body>
    </html>
  );
}
