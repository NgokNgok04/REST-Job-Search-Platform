import React, { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <main className="mt-[70px]">{children}</main>
    </div>
  );
};

export default Layout;
