import Auth from "@/components/Auth";
import SideBar from "@/components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Auth checkingFor="protected">
        <SideBar>{children}</SideBar>
      </Auth>
    </>
  );
}
