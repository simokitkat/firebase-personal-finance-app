import Auth from "@/components/Auth";
import SideBar from "@/components/SideBar";
import { getUserWallets } from "../actions/wallets";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hasWallets } = await getUserWallets();

  return (
    <>
      <Auth checkingFor="protected">
        {hasWallets ? <SideBar>{children}</SideBar> : children}
      </Auth>
    </>
  );
}
