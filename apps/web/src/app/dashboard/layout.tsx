"use client";

import Image from "next/image";

import { Toaster } from "@unibus/ui/toast";

import { MainNav } from "./_components/main-nav";
import { Search } from "./_components/search";
import { UserNav } from "./_components/user-nav";

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster />

      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </div>
    </>
  );
}
