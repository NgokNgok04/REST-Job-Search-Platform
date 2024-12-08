import React, { ReactNode } from "react";
import NavbarTest from "./Navbar/Navbar";
type LayoutProps = {
  cn?: string;
  children: ReactNode;
};
const Layout: React.FC<LayoutProps> = ({ cn, children }) => {
  return (
    <div className={`flex flex-col min-h-screen max-h-screen  ${cn}`}>
      <NavbarTest />
      <main className=" px-10">{children}</main>
    </div>
  );
};

export default Layout;
