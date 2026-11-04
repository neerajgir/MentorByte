import { Suspense } from "react";
import { currentUserRole } from "@/modules/auth/actions";
import { Navbar } from "@/modules/home/components/navbar";
import React from "react";

const NavbarRole = async () => {
  const userRole = await currentUserRole();
  return <Navbar userRole={userRole} />;
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <NavbarRole />
      </Suspense>
      <div className="flex-1 flex flex-col px-4 pb-4">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] dark:bg-size-[16px_16px] bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-size-[16px_16px]" />
        {children}
      </div>
    </main>
  );
};

export default RootLayout;
