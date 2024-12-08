import React, { ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import { AuthProvider } from "@/contexts/authContext";
type LayoutProps = {
  cn?: string;
  children: ReactNode;
};
const Layout: React.FC<LayoutProps> = ({ cn, children }) => {
  return (
    <div className={`flex flex-col min-h-screen max-h-screen  ${cn}`}>
      <AuthProvider>
        <Navbar />
        <main className=" px-10">{children}</main>
      </AuthProvider>
    </div>
  );
};

export default Layout;
