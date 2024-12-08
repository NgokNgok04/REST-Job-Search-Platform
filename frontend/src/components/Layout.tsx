import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "./ui/toaster";

type LayoutProps = {
  cn?: string;
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ cn, children }) => {
  return (
    <div className={`flex flex-col min-h-screen max-h-screen  ${cn}`}>
      <Navbar />
      <main className="mt-[70px] px-10">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
