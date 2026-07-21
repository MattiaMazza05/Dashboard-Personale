"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/navbar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showNav = !pathname?.startsWith("/login");

  return (
    <>
      <div
        className={
          showNav
            ? "min-h-full flex flex-col pb-28 md:pt-20 md:pb-0"
            : "min-h-full flex flex-col"
        }
      >
        {children}
      </div>
      {showNav ? <Nav /> : null}
    </>
  );
}
