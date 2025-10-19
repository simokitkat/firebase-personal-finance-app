import Auth from "@/components/Auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Auth checkingFor="protected">{children}</Auth>
      </body>
    </html>
  );
}
